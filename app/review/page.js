import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardStats from "../../components/DashboardStats.js";
import ReviewDashboard from "../../components/ReviewDashboard.js";
import ReviewHistory from "../../components/ReviewHistory.js";
import ReviewWorkload from "../../components/ReviewWorkload.js";
import { getReviewHistory } from "../../lib/dashboard.js";
import { getPendingEntriesForReview } from "../../lib/entries.js";
import { normalizeLanguage } from "../../lib/language.js";
import { createClient } from "../../lib/supabase/server.js";
import { getTranslation } from "../../lib/translations.js";

const styles = { hero: { padding: "34px 0 24px", borderBottom: "1px solid var(--rule)" }, title: { margin: 0, fontFamily: "var(--font-primary)", fontSize: "var(--text-display)", fontWeight: 700, lineHeight: .82 }, intro: { margin: "14px 0 0", color: "var(--muted)", fontSize: "var(--text-lead)", lineHeight: 1.75 }, queue: { padding: "28px 0 64px" }, section: { marginTop: "48px" } };

export const metadata = { title: "Review entries" };
export const dynamic = "force-dynamic";

export default async function ReviewPage() {
  const [supabase, cookieStore] = await Promise.all([createClient(), cookies()]);
  const { data: { user } } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  if (!user) redirect("/login");
  // Do not rely on the hidden navigation link: protect the page on the server.
  const { data: isReviewer } = await supabase.rpc("is_reviewer");
  if (!isReviewer) redirect("/archive");
  const language = normalizeLanguage(cookieStore.get("language")?.value);
  const translation = getTranslation(language);
  // The queue contains only other contributors' pending entries, oldest first.
  const [entries, history] = await Promise.all([getPendingEntriesForReview(user.id, supabase), getReviewHistory({ reviewerId: user.id, client: supabase })]);
  const oldestDays = entries.length ? Math.max(0, Math.floor((Date.now() - new Date(entries[0].created_at).getTime()) / 86400000)) : 0;

  return <main className="page-shell"><header className="page-hero compact-hero archive-hero" style={styles.hero}><h1 style={styles.title}>{translation.review.title}</h1><p style={styles.intro}>{translation.review.intro}</p></header><div style={styles.queue}><DashboardStats items={[{ value: entries.length, label: translation.review.pendingCount }, { value: oldestDays, label: translation.review.oldestDays }, { value: history.filter((item) => item.decision === "published").length, label: translation.review.published }, { value: history.filter((item) => item.decision === "returned").length, label: translation.review.returned }]} /><ReviewWorkload entries={entries} labels={translation.review} /><div style={styles.section}><h2>{translation.review.queueTitle}</h2><ReviewDashboard entries={entries} labels={translation.review} form={translation.form} cardLabels={translation.entryCard} comboBox={translation.comboBox} /></div><ReviewHistory history={history} labels={translation.review} language={language} /></div></main>;
}
