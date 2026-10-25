import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import EntryCard from "../../../components/EntryCard.js";
import EntryActions from "../../../components/EntryActions.js";
import { createClient } from "../../../lib/supabase/server.js";
import { getEntries, getEntryBySlug } from "../../../lib/entries.js";
import { normalizeLanguage } from "../../../lib/language.js";
import { getTranslation } from "../../../lib/translations.js";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const entry = await getEntryBySlug(slug);
  return { title: entry ? entry.title : "Memory not found" };
}

export default async function MemoryDetailPage({ params }) {
  const { slug } = await params;
  const [supabase, cookieStore] = await Promise.all([createClient(), cookies()]);
  const [{ data: { user } }, { data: reviewer }] = await Promise.all([
    supabase ? supabase.auth.getUser() : { data: { user: null } },
    supabase ? supabase.rpc("is_reviewer") : { data: false },
  ]);
  const entries = await getEntries(supabase);
  const entry = entries.find((item) => item.slug.normalize("NFC") === slug.normalize("NFC"));

  if (!entry) {
    notFound();
  }
  const t = getTranslation(normalizeLanguage(cookieStore.get("language")?.value)).detail;

  const relatedEntries = entries
    .filter((item) => item.slug !== entry.slug)
    .slice(0, 2);

  return (
    <main className="page-shell detail-shell">
      <article className="memory-detail">
        <h1>{entry.title}</h1>
        {entry.photo_url ? <img className="entry-photo" src={entry.photo_url} alt={entry.image_description} /> : null}
        {user?.id === entry.owner_id ? <EntryActions id={entry.id} slug={entry.slug} /> : null}
        <div className="detail-grid">
          <aside className="detail-rail">
            <dl className="catalog-grid">
              <div>
                <dt>{t.sharedBy}</dt>
                <dd>{entry.display_name || t.anonymous}</dd>
              </div>
              <div>
                <dt>{t.year}</dt>
                <dd>{entry.memory_year}</dd>
              </div>
              <div>
                <dt>{t.province}</dt>
                <dd>{entry.province}</dd>
              </div>
              <div>
                <dt>{t.schoolLevel}</dt>
                <dd>{entry.school_level?.replace("_", " ")}</dd>
              </div>
            </dl>
            {entry.place_time_details ? <section className="object-box"><h2>{t.moreDetails}</h2><p>{entry.place_time_details}</p></section> : null}
          </aside>

          <div className="detail-story">
            <section className="story-section">
              <h2>{t.memory}</h2>
              <p>{entry.story}</p>
            </section>
          </div>
        </div>
      </article>

      <section className="section-block">
        <div className="section-heading">
          <h2>{t.continue}</h2>
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