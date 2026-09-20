import collection from "../collection.config.js";
import entries from "../data/entries.js";
import EntryCard from "../components/EntryCard.js";
import Link from "next/link";

export default function Home() {
  const featuredEntries = entries.slice(0, 3);

  return (
    <main>
      <section className="hero-section page-shell">
        <div className="hero-copy">
          <p className="eyebrow">01 / Oral history archive</p>
          <h1 className="archive-title">Khmer School Memories Before Digital Learning</h1>
        </div>
        <div className="hero-intro">
          <p className="archive-description">{collection.description}</p>
          <Link className="primary-link" href="/archive">
            Enter archive
          </Link>
        </div>
      </section>

      <section className="page-shell section-block">
        <div className="section-heading">
          <p className="eyebrow">Selected records</p>
          <h2>Start with three memories</h2>
        </div>
        <div className="record-list">
          {featuredEntries.map((entry, index) => (
            <EntryCard key={entry.slug} entry={entry} recordNumber={index + 1} />
          ))}
        </div>
      </section>

      <section className="page-shell museum-split">
        <div className="archive-panel">
          <p className="eyebrow">Why this archive</p>
          <h2>School memories treated like cultural records.</h2>
          <p>
            This project collects memories about Cambodian learning before
            smartphones, search engines, online classrooms, and AI tools became
            common. Each record keeps attention on people, places, learning
            materials, and study habits.
          </p>
        </div>
        <aside className="fieldwork-notice">
          <p className="notice-label">Current fieldwork</p>
          <p className="notice-text">
            Current records are temporary research-informed fictional demo
            profiles. They show the archive format and will be replaced with
            approved notes from real interviews.
          </p>
        </aside>
      </section>
    </main>
  );
}
