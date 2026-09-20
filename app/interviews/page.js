import Link from "next/link";
import entries from "../../data/entries.js";

export const metadata = {
  title: "Interview Collection",
};

export default function InterviewsPage() {
  return (
    <main className="page-shell">
      <header className="page-hero compact-hero">
        <p className="eyebrow">Interview collection</p>
        <h1>People behind the memories.</h1>
        <p>
          This page groups archive records by contributor so future interview
          notes, photos, and audio can grow from the same structure.
        </p>
      </header>

      <div className="interview-grid">
        {entries.map((entry, index) => (
          <article key={entry.slug} className="interview-card">
            <p className="entry-number">{String(index + 1).padStart(2, "0")}</p>
            <p className="record-kicker">{entry.category}</p>
            <h2>{entry.contributor}</h2>
            <p>{entry.excerpt}</p>
            <dl>
              <div>
                <dt>Period</dt>
                <dd>{entry.period}</dd>
              </div>
              <div>
                <dt>Location</dt>
                <dd>{entry.place}</dd>
              </div>
            </dl>
            {entry.isDemo ? <span className="demo-pill">Demo profile</span> : null}
            <Link className="text-link" href={`/archive/${entry.slug}`}>
              Read memory →
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}