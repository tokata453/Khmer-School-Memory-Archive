export default function EntryCard({ entry, recordNumber }) {
  const sections = [
    ["School memory", entry.memory],
    ["Learning without the internet", entry.learningMethod],
    ["Looking back", entry.reflection],
  ];

  return (
    <article className="entry-card">
      <div className="entry-header">
        <div>
          <p className="record-kicker">
            Record {String(recordNumber).padStart(2, "0")} / {entry.category}
          </p>
          <h2 className="entry-title">{entry.title}</h2>
          <p className="entry-meta">
            {entry.contributor} / {entry.place} / {entry.period}
          </p>
        </div>

        {entry.isDemo ? (
          <span className="demo-pill">Research-informed fictional demo</span>
        ) : null}
      </div>

      <div className="object-box">
        <p className="detail-label">Featured object</p>
        <p className="detail-text">{entry.featuredObject}</p>
      </div>

      <div className="entry-grid">
        {sections.map(([label, text]) => (
          <section key={label} className="detail-block">
            <h3 className="detail-label">{label}</h3>
            <p className="detail-text">{text}</p>
          </section>
        ))}
      </div>
    </article>
  );
}
