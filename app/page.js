import collection from "../collection.config.js";
import entries from "../data/entries.js";
import EntryCard from "../components/EntryCard.js";

export default function Home() {
  return (
    <main className="page-shell">
      <header className="archive-hero">
        <p className="eyebrow">Khmer Living Archive / Field Notebook</p>
        <h1 className="archive-title">{collection.name}</h1>
        <p className="archive-description">{collection.description}</p>

        <div className="archive-meta" aria-label="Archive details">
          <div className="meta-card">
            <p className="meta-label">Curated by</p>
            <p className="meta-value">{collection.curator}</p>
          </div>
          <div className="meta-card">
            <p className="meta-label">Source</p>
            <p className="meta-value">{collection.source}</p>
          </div>
          <div className="meta-card">
            <p className="meta-label">Records</p>
            <p className="meta-value">{entries.length} prototype entries</p>
          </div>
        </div>
      </header>

      <aside className="fieldwork-notice">
        <p className="notice-label">Fieldwork status</p>
        <p className="notice-text">
          These five cards are temporary research-informed fictional demo
          profiles. They show the archive format and will be replaced with five
          real interview entries after fieldwork.
        </p>
      </aside>

      <section className="entries-list" aria-label="Archive entries">
        {entries.map((entry, index) => (
          <EntryCard key={entry.title} entry={entry} recordNumber={index + 1} />
        ))}
      </section>

      <footer className="archive-footer">
        <p className="footer-note">
          Built in ICT 340 - Vibe Coding, American University of Phnom Penh,
          Fall 2026. This archive is under construction all semester.
        </p>
      </footer>
    </main>
  );
}
