import AdminRoleControls from "./AdminRoleControls.js";

const styles = { section: { marginTop: "28px", borderTop: "2px solid var(--carbon)" }, empty: { padding: "22px 0", color: "var(--muted)" } };

export default function AdminDirectory({ profiles, labels }) {
  return <section style={styles.section} aria-label={labels.directoryTitle}>
    {profiles.length ? profiles.map((profile) => <AdminRoleControls key={profile.id} profile={profile} labels={labels} />) : <p style={styles.empty}>{labels.empty}</p>}
  </section>;
}
