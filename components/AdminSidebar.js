import Link from "next/link";

export default function AdminSidebar({ activeTab, isAdmin, labels }) {
  const reviewTabs = [["queue", labels.reviewQueue], ["activity", labels.reviewActivity]];
  const adminTabs = [["accounts", labels.directoryTitle], ["entries", labels.entriesTitle]];

  return (
    <aside className="admin-sidebar" aria-label={labels.manageSections}>
      <p className="admin-sidebar-heading">{labels.reviewSection}</p>
      <nav className="admin-sidebar-nav">
        {reviewTabs.map(([value, label]) => <Link key={value} className={activeTab === value ? "is-active" : ""} href={`/admin?tab=${value}`} aria-current={activeTab === value ? "page" : undefined}>{label}</Link>)}
      </nav>
      {isAdmin ? <>
        <p className="admin-sidebar-heading">{labels.administrationSection}</p>
        <nav className="admin-sidebar-nav">
          {adminTabs.map(([value, label]) => <Link key={value} className={activeTab === value ? "is-active" : ""} href={`/admin?tab=${value}`} aria-current={activeTab === value ? "page" : undefined}>{label}</Link>)}
        </nav>
      </> : null}
    </aside>
  );
}
