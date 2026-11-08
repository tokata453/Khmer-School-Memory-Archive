const styles = { section: { marginTop: "28px" }, list: { display: "flex", flexWrap: "wrap", gap: "8px", margin: "12px 0 0", padding: 0, listStyle: "none" }, item: { padding: "7px 10px", border: "1px solid var(--rule)", background: "var(--paper)", fontWeight: 700 } };

export default function ReviewWorkload({ entries, labels }) {
  const provinces = entries.reduce((counts, entry) => ({ ...counts, [entry.province]: (counts[entry.province] || 0) + 1 }), {});
  if (!entries.length) return null;
  return <section style={styles.section} aria-label={labels.workloadTitle}><h2>{labels.workloadTitle}</h2><ul style={styles.list}>{Object.entries(provinces).sort(([a], [b]) => a.localeCompare(b)).map(([province, count]) => <li key={province} style={styles.item}>{province}: {count}</li>)}</ul></section>;
}
