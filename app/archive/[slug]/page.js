import { notFound } from "next/navigation";
import EntryCard from "../../../components/EntryCard.js";
import EntryActions from "../../../components/EntryActions.js";
import { createClient } from "../../../lib/supabase/server.js";
import { getEntries, getEntryBySlug } from "../../../lib/entries.js";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const entry = await getEntryBySlug(slug);
  return { title: entry ? entry.title : "Memory not found" };
}

export default async function MemoryDetailPage({ params }) {
  const { slug } = await params;
  const [entry, supabase] = await Promise.all([getEntryBySlug(slug), createClient()]);

  if (!entry) {
    notFound();
  }

  const [{ data }, entries] = await Promise.all([
    supabase ? supabase.auth.getUser() : { data: { user: null } },
    getEntries(),
  ]);
  const relatedEntries = entries
    .filter((item) => item.slug !== entry.slug)
    .slice(0, 2);

  return (
    <main className="page-shell detail-shell">
      <article className="memory-detail">
        <h1>{entry.title}</h1>
        {entry.photo_url ? <img className="entry-photo" src={entry.photo_url} alt={`Photo for ${entry.title}`} /> : null}
        {data.user?.id === entry.owner_id ? <EntryActions id={entry.id} slug={entry.slug} /> : null}
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