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
          <h1 className="archive-title">{collection.name}</h1>
        </div>
        <div className="hero-intro">
          <p className="archive-description">{collection.description}</p>
          <Link className="primary-link" href="/archive">
            Enter archive
          </Link>
        </div>
        <div className="hero-media" aria-hidden="true">
          <div className="hero-media-stack">
            <span className="hero-play-shape" />
          </div>
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

      <section className="page-shell section-block">
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
      </section>
    </main>
  );
}
