import { redirect } from "next/navigation";
import AdminDirectory from "../../components/AdminDirectory.js";
import AdminEntryBrowser from "../../components/AdminEntryBrowser.js";
import AdminSidebar from "../../components/AdminSidebar.js";
import DashboardStats from "../../components/DashboardStats.js";
import ReviewHistory from "../../components/ReviewHistory.js";
import ReviewDashboard from "../../components/ReviewDashboard.js";
import ReviewWorkload from "../../components/ReviewWorkload.js";
import { getAdminDirectory } from "../../lib/admin.js";
import { getReviewHistory } from "../../lib/dashboard.js";
import { dashboardCounts } from "../../lib/dashboard-utils.js";
import { getEntries, getPendingEntriesForReview } from "../../lib/entries.js";
import { createClient } from "../../lib/supabase/server.js";
import { cookies } from "next/headers";
import { normalizeLanguage } from "../../lib/language.js";
import { getTranslation } from "../../lib/translations.js";

const styles = {
  hero: { padding: "var(--space-6) 0 var(--space-5)", borderBottom: "1px solid var(--rule)" },
  title: { margin: 0, fontFamily: "var(--font-primary)", fontSize: "var(--text-display)", lineHeight: .82 },
  intro: { margin: "14px 0 0", color: "var(--muted)", fontSize: "var(--text-lead)", lineHeight: 1.75 },
  body: { padding: "var(--space-6) 0 var(--space-10)" },
};

export const metadata = { title: "Archive dashboard" };
export const dynamic = "force-dynamic";

export default async function AdminPage({ searchParams }) {
  const [supabase, cookieStore, params] = await Promise.all([createClient(), cookies(), searchParams]);
  const { data: { user } } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  if (!user) redirect("/login?next=/admin");
  const [{ data: isReviewer }, { data: isAdmin }] = await Promise.all([supabase.rpc("is_reviewer"), supabase.rpc("is_admin")]);
  if (!isReviewer) redirect("/archive");
  const language = normalizeLanguage(cookieStore.get("language")?.value);
  const translation = getTranslation(language);
  const labels = translation.admin;
  const requestedTab = params.tab;
  const reviewerTabs = ["queue", "activity"];
  const adminTabs = ["accounts", "entries"];
  // Never render or load an administrator view for a reviewer-only account.
  const tab = (isAdmin && [...reviewerTabs, ...adminTabs].includes(requestedTab)) || reviewerTabs.includes(requestedTab) ? requestedTab : "queue";
  const needsQueue = tab === "queue";
  const needsHistory = tab === "queue" || tab === "activity";
  const needsProfiles = isAdmin && (tab === "accounts" || tab === "activity");
  const [queueEntries, history, profiles, entries] = await Promise.all([
    needsQueue ? getPendingEntriesForReview(user.id, supabase) : Promise.resolve([]),
    needsHistory ? getReviewHistory({ reviewerId: isAdmin ? undefined : user.id, client: supabase }) : Promise.resolve([]),
    needsProfiles ? getAdminDirectory(supabase) : Promise.resolve([]),
    tab === "entries" ? getEntries(supabase) : Promise.resolve([]),
  ]);
  const oldestDays = queueEntries.length ? Math.max(0, Math.floor((Date.now() - new Date(queueEntries[0].created_at).getTime()) / 86400000)) : 0;
  const counts = dashboardCounts(entries);
  const reviewers = profiles.filter((profile) => profile.roles.includes("reviewer") || profile.roles.includes("admin")).length;
  const admins = profiles.filter((profile) => profile.roles.includes("admin")).length;
  const reviewerNames = Object.fromEntries(profiles.map((profile) => [profile.id, profile.user_name || profile.email]));

  return (
    <main className="page-shell">
      <header style={styles.hero}>
        <h1 style={styles.title}>{isAdmin ? labels.dashboardTitle : translation.review.dashboardTitle}</h1>
        <p style={styles.intro}>{isAdmin ? labels.dashboardIntro : translation.review.dashboardIntro}</p>
      </header>
      <div className="admin-layout" style={styles.body}>
        <AdminSidebar activeTab={tab} isAdmin={isAdmin} labels={labels} />
        <section className="admin-tab-panel" aria-labelledby={`admin-${tab}-title`}>
          {tab === "queue" ? <>
            <DashboardStats items={[{ value: queueEntries.length, label: translation.review.pendingCount }, { value: oldestDays, label: translation.review.oldestDays }, { value: history.filter((item) => item.decision === "published").length, label: translation.review.published }, { value: history.filter((item) => item.decision === "returned").length, label: translation.review.returned }]} />
            <ReviewWorkload entries={queueEntries} labels={translation.review} />
            <h2 id="admin-queue-title" className="admin-panel-title">{translation.review.queueTitle}</h2>
            <ReviewDashboard entries={queueEntries} labels={translation.review} form={translation.form} cardLabels={translation.entryCard} comboBox={translation.comboBox} />
          </> : null}
          {tab === "activity" ? <><h2 id="admin-activity-title">{isAdmin ? labels.historyTitle : translation.review.historyTitle}</h2><ReviewHistory history={history} labels={isAdmin ? labels : translation.review} language={language} reviewerNames={reviewerNames} /></> : null}
          {tab === "accounts" ? <><DashboardStats items={[{ value: profiles.length, label: labels.accounts }, { value: reviewers, label: labels.reviewers }, { value: admins, label: labels.admins }]} /><h2 id="admin-accounts-title" className="admin-panel-title">{labels.directoryTitle}</h2><AdminDirectory profiles={profiles} labels={labels} /></> : null}
          {tab === "entries" ? <><DashboardStats items={[{ value: counts.pending, label: labels.pending }, { value: counts.published, label: labels.published }, { value: counts.returned, label: labels.returned }]} /><h2 id="admin-entries-title" className="admin-panel-title">{labels.entriesTitle}</h2><AdminEntryBrowser entries={entries} labels={labels} comboBox={translation.comboBox} /></> : null}
        </section>
      </div>
    </main>
  );
}
