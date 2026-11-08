const styles = { grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", borderTop: "2px solid var(--carbon)", borderLeft: "1px solid var(--rule)" }, card: { display: "grid", gap: "5px", minHeight: "112px", padding: "18px", borderRight: "1px solid var(--rule)", borderBottom: "1px solid var(--rule)", background: "var(--paper)" }, value: { fontFamily: "var(--font-primary)", fontSize: "2rem", fontWeight: 700, lineHeight: 1 }, label: { color: "var(--muted)", fontWeight: 700 } };

export default function DashboardStats({ items }) {
  return <section style={styles.grid} aria-label="Dashboard statistics">{items.map((item) => <div key={item.label} style={styles.card}><strong style={styles.value}>{item.value}</strong><span style={styles.label}>{item.label}</span></div>)}</section>;
}
