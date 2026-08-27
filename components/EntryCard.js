// EntryCard turns one interview summary into a readable archive card.
// The fields come from the interview guide, but are grouped for scanning.

const styles = {
  card: {
    marginTop: 24,
    padding: 24,
    backgroundColor: "#1C222C",
    border: "1px solid #2E3644",
    borderRadius: 10,
  },
  kicker: {
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    letterSpacing: 1,
    color: "#2EE6A8",
    margin: 0,
  },
  demo: {
    display: "inline-block",
    marginTop: 10,
    padding: "4px 8px",
    border: "1px solid #526B34",
    borderRadius: 999,
    color: "#D7E8BE",
    fontFamily: "'Courier New', monospace",
    fontSize: 11,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    lineHeight: 1.3,
    margin: "10px 0 8px",
  },
  meta: {
    fontFamily: "'Courier New', monospace",
    fontSize: 13,
    color: "#5A6373",
    borderTop: "1px solid #2E3644",
    margin: "16px 0 0",
    paddingTop: 12,
  },
  section: { marginTop: 18 },
  label: {
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    letterSpacing: 0.5,
    color: "#2EE6A8",
    margin: "0 0 6px",
    textTransform: "uppercase",
  },
  text: { fontSize: 15, lineHeight: 1.6, color: "#97A1B3", margin: 0 },
};

export default function EntryCard({ entry }) {
  const sections = [
    ["Featured object", entry.featuredObject],
    ["School memory", entry.memory],
    ["Learning without the internet", entry.learningMethod],
    ["Looking back", entry.reflection],
  ];

  return (
    <article style={styles.card}>
      <p style={styles.kicker}>{entry.category}</p>
      {entry.isDemo ? (
        <span style={styles.demo}>RESEARCH-INFORMED FICTIONAL DEMO</span>
      ) : null}
      <h2 style={styles.title}>{entry.title}</h2>
      <p style={styles.meta}>
        {entry.contributor} · {entry.place} · {entry.period}
      </p>

      {sections.map(([label, text]) => (
        <section key={label} style={styles.section}>
          <h3 style={styles.label}>{label}</h3>
          <p style={styles.text}>{text}</p>
        </section>
      ))}
    </article>
  );
}
