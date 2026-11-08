import Link from "next/link";

const styles = { section: { marginTop: "48px" }, list: { borderTop: "2px solid var(--carbon)" }, item: { display: "flex", justifyContent: "space-between", gap: "16px", padding: "14px 0", borderBottom: "1px solid var(--rule)", textDecoration: "none" }, meta: { flex: "none", color: "var(--muted)", fontSize: "0.86rem" }, decision: { color: "var(--muted)", fontSize: "0.86rem", fontWeight: 700 } };

export default function ReviewHistory({ history, labels, language, reviewerNames = {} }) {
  if (!history.length) return null;
  const formatter = new Intl.DateTimeFormat(language === "km" ? "km-KH" : "en", { dateStyle: "medium", timeStyle: "short" });
  return <section style={styles.section} aria-label={labels.historyTitle}><h2>{labels.historyTitle}</h2><div style={styles.list}>{history.map((item) => <Link key={item.id} href={`/archive/${item.entrySlug}`} style={styles.item}><span><strong>{item.entryTitle}</strong><br /><span style={styles.decision}>{labels[item.decision]}{reviewerNames[item.reviewer_id] ? ` · ${reviewerNames[item.reviewer_id]}` : ""}</span></span><span style={styles.meta}>{formatter.format(new Date(item.createdAt))}</span></Link>)}</div></section>;
}
