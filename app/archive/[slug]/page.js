import { notFound } from "next/navigation";
import EntryCard from "../../../components/EntryCard.js";
import entries from "../../../data/entries.js";

export function generateStaticParams() {
  return entries.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const entry = entries.find((item) => item.slug === slug);
  return { title: entry ? entry.title : "Memory not found" };
}

export default async function MemoryDetailPage({ params }) {
  const { slug } = await params;
  const entry = entries.find((item) => item.slug === slug);

  if (!entry) {
    notFound();
  }

  const relatedEntries = entries
    .filter((item) => item.slug !== entry.slug)
    .slice(0, 2);

  return (
    <main className="page-shell detail-shell">
      <article className="memory-detail">
        <p className="eyebrow">Memory detail / {entry.category}</p>
        <h1>{entry.title}</h1>
        <div className="detail-grid">
          <aside className="detail-rail">
            <dl className="catalog-grid">
              <div>
                <dt>Interviewee</dt>
                <dd>{entry.contributor}</dd>
              </div>
              <div>
                <dt>Period</dt>
                <dd>{entry.period}</dd>
              </div>
              <div>
                <dt>Location</dt>
                <dd>{entry.place}</dd>
              </div>
              <div>
                <dt>Topic</dt>
                <dd>{entry.category}</dd>
              </div>
            </dl>
            {entry.isDemo ? (
              <p className="demo-banner">Research-informed fictional demo profile.</p>
            ) : null}
            <section className="object-box">
              <h2>Featured object</h2>
              <p>{entry.featuredObject}</p>
            </section>
          </aside>

          <div className="detail-story">
            <section className="story-section">
              <h2>Story</h2>
              <p>{entry.memory}</p>
            </section>
            <section className="story-section">
              <h2>Learning without internet</h2>
              <p>{entry.learningMethod}</p>
            </section>
            <section className="story-section">
              <h2>Looking back</h2>
              <p>{entry.reflection}</p>
            </section>
          </div>
        </div>
      </article>

      <section className="section-block">
        <div className="section-heading">
          <p className="eyebrow">Related memories</p>
          <h2>Continue reading</h2>
        </div>
        <div className="record-list compact-list">
          {relatedEntries.map((relatedEntry, index) => (
            <EntryCard
              key={relatedEntry.slug}
              entry={relatedEntry}
              recordNumber={index + 1}
            />
          ))}
        </div>
      </section>
    </main>
  );
}