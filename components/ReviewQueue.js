import EntryCard from "./EntryCard.js";

const styles = { empty: { padding: "28px 0", borderTop: "2px solid var(--carbon)", color: "var(--muted)" } };

export default function ReviewQueue({ entries, labels, form, cardLabels }) {
  if (!entries.length) return <section style={styles.empty}><p>{labels.empty}</p></section>;
  return <section aria-label={labels.queueTitle}><div className="entry-card-grid">{entries.map((entry) => <EntryCard key={entry.id} entry={entry} labels={cardLabels} form={form} statusLabel={labels.pending} />)}</div></section>;
}
