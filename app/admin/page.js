import { redirect } from "next/navigation";
import AdminDirectory from "../../components/AdminDirectory.js";
import AdminEntryBrowser from "../../components/AdminEntryBrowser.js";
import DashboardStats from "../../components/DashboardStats.js";
import ReviewHistory from "../../components/ReviewHistory.js";
import { getAdminDirectory } from "../../lib/admin.js";
import { getReviewHistory } from "../../lib/dashboard.js";
import { dashboardCounts } from "../../lib/dashboard-utils.js";
import { getEntries } from "../../lib/entries.js";
import { createClient } from "../../lib/supabase/server.js";
import { cookies } from "next/headers";
import { normalizeLanguage } from "../../lib/language.js";
import { getTranslation } from "../../lib/translations.js";

const styles = { hero: { padding: "34px 0 24px", borderBottom: "1px solid var(--rule)" }, title: { margin: 0, fontFamily: "var(--font-primary)", fontSize: "var(--text-display)", lineHeight: .82 }, intro: { margin: "14px 0 0", color: "var(--muted)", fontSize: "var(--text-lead)", lineHeight: 1.75 }, body: { padding: "28px 0 64px" }, actions: { display: "flex", flexWrap: "wrap", gap: "10px", margin: "28px 0 48px" }, action: { padding: "10px 14px", border: "1px solid var(--carbon)", fontWeight: 700, textDecoration: "none" }, section: { marginTop: "48px" } };

export const metadata = { title: "Archive administration" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [supabase, cookieStore] = await Promise.all([createClient(), cookies()]);
  const { data: { user } } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  if (!user) redirect("/login?next=/admin");
  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) redirect("/archive");
  const language = normalizeLanguage(cookieStore.get("language")?.value);
  const labels = getTranslation(language).admin;
  const [profiles, entries, history] = await Promise.all([getAdminDirectory(supabase), getEntries(supabase), getReviewHistory({ client: supabase })]);
  const counts = dashboardCounts(entries);
  const reviewers = profiles.filter((profile) => profile.roles.includes("reviewer") || profile.roles.includes("admin")).length;
  const admins = profiles.filter((profile) => profile.roles.includes("admin")).length;
  const reviewerNames = Object.fromEntries(profiles.map((profile) => [profile.id, profile.user_name || profile.email]));
  return <main className="page-shell"><header style={styles.hero}><h1 style={styles.title}>{labels.title}</h1><p style={styles.intro}>{labels.intro}</p></header><div style={styles.body}><DashboardStats items={[{ value: profiles.length, label: labels.accounts }, { value: reviewers, label: labels.reviewers }, { value: admins, label: labels.admins }, { value: counts.pending, label: labels.pending }, { value: counts.published, label: labels.published }]} /><nav style={styles.actions} aria-label={labels.quickActions}>{[[labels.reviewQueue, "/review"], [labels.browseArchive, "/archive"], [labels.addEntry, "/contribute"], [labels.notifications, "/notifications"]].map(([label, href]) => <a key={href} style={styles.action} href={href}>{label}</a>)}</nav><section><h2>{labels.directoryTitle}</h2><AdminDirectory profiles={profiles} labels={labels} /></section><section style={styles.section}><h2>{labels.entriesTitle}</h2><AdminEntryBrowser entries={entries} labels={labels} comboBox={getTranslation(language).comboBox} /></section><ReviewHistory history={history} labels={labels} language={language} reviewerNames={reviewerNames} /></div></main>;
}
