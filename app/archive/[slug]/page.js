import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import EntryCard from "../../../components/EntryCard.js";
import EntryActions from "../../../components/EntryActions.js";
import { createClient } from "../../../lib/supabase/server.js";
import { getEntries, getEntryBySlug } from "../../../lib/entries.js";
import { getRelatedEntries } from "../../../lib/related-entries.js";
import { normalizeLanguage } from "../../../lib/language.js";
import { getTranslation } from "../../../lib/translations.js";

const styles = {
  shell: { paddingTop: 0 }, detail: {}, heroContent: { display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: "var(--space-5)", alignItems: "start" }, title: { margin: 0, fontFamily: "var(--font-primary)", fontSize: "var(--text-display)", fontWeight: 700, lineHeight: .82, letterSpacing: ".015em" }, intro: { maxWidth: "720px", margin: "14px 0 0", color: "var(--muted)", fontSize: "var(--text-lead)", lineHeight: 1.75 }, photoFrame: { position: "relative", height: "280px", overflow: "hidden" }, photoBackground: { position: "absolute", inset: 0, backgroundImage: "var(--detail-image)", backgroundPosition: "center", backgroundSize: "cover" }, photo: { position: "relative", zIndex: 1, display: "block", width: "100%", height: "100%", objectFit: "contain", filter: "saturate(.76) sepia(.15)" }, grid: { display: "grid", gridTemplateColumns: "var(--layout-rail) minmax(0, 1fr)", gap: "var(--space-8)" }, catalog: { display: "grid", gap: "18px", margin: 0 }, catalogItem: { borderTop: "1px solid var(--rule)", paddingTop: "10px" }, catalogValue: { margin: "7px 0 0", color: "var(--muted)" }, box: { marginTop: "32px", borderTop: "2px solid var(--carbon)", paddingTop: "14px" }, sectionTitle: { margin: 0, fontFamily: "var(--font-primary)", fontSize: "var(--text-section)", fontWeight: 700, lineHeight: .9 }, text: { marginBottom: 0, color: "var(--muted)", fontSize: "var(--text-lead)", lineHeight: 1.75 }, story: { maxWidth: "var(--layout-reading)" }, storySection: {}, block: { paddingTop: "56px" }, heading: { display: "grid", gridTemplateColumns: "max-content 1fr", gap: "30px", alignItems: "start", marginBottom: "18px", borderTop: "2px solid var(--carbon)", paddingTop: "16px" }, list: {},
};

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
  const language = normalizeLanguage(cookieStore.get("language")?.value);
  const translation = getTranslation(language);
  const t = translation.detail;

  const relatedEntries = getRelatedEntries(entry, entries);

  return (
    <main className="page-shell detail-shell" style={styles.shell}>
      <article className="memory-detail" style={styles.detail}>
        <header className="page-hero compact-hero archive-hero detail-hero"><div className="detail-hero-content" style={styles.heroContent}><div><h1 style={styles.title}>{entry.title}</h1><p style={styles.intro}>{entry.image_description}</p></div>{user?.id === entry.owner_id ? <EntryActions id={entry.id} slug={entry.slug} language={language} /> : null}</div></header>
        <div className="detail-grid" style={styles.grid}>
          <aside className="detail-rail">
            {entry.photo_url ? <div className="detail-photo-frame" style={styles.photoFrame}>
              <span className="detail-photo-background" style={{ ...styles.photoBackground, "--detail-image": `url("${entry.photo_url}")` }} aria-hidden="true" />
              <img className="entry-photo" style={styles.photo} src={entry.photo_url} alt={entry.image_description} />
            </div> : null}
            <dl className="catalog-grid" style={styles.catalog}>
              <div style={styles.catalogItem}>
                <dt>{t.sharedBy}</dt>
                <dd style={styles.catalogValue}>{entry.display_name || t.anonymous}</dd>
              </div>
              <div style={styles.catalogItem}>
                <dt>{t.year}</dt>
                <dd style={styles.catalogValue}>{entry.memory_year}</dd>
              </div>
              <div style={styles.catalogItem}>
                <dt>{t.province}</dt>
                <dd style={styles.catalogValue}>{entry.province}</dd>
              </div>
              <div style={styles.catalogItem}>
                <dt>{t.schoolLevel}</dt>
                <dd style={styles.catalogValue}>{translation.form.levels[entry.school_level] || entry.school_level?.replace("_", " ")}</dd>
              </div>
            </dl>
            {entry.place_time_details ? <section className="object-box" style={styles.box}><h2 style={styles.sectionTitle}>{t.moreDetails}</h2><p style={styles.text}>{entry.place_time_details}</p></section> : null}
          </aside>

          <div className="detail-story" style={styles.story}>
            <section className="story-section" style={styles.storySection}>
              <h2 style={styles.sectionTitle}>{t.memory}</h2>
              <p className="detail-story-text" style={styles.text}>{entry.story}</p>
            </section>
          </div>
        </div>
      </article>

      {relatedEntries.length ? <section className="section-block" style={styles.block}>
        <div className="section-heading" style={styles.heading}>
          <h2 style={styles.sectionTitle}>{t.moreMemories}</h2>
        </div>
        <div className="entry-card-grid" style={styles.list}>
          {relatedEntries.map((relatedEntry) => (
            <EntryCard
              key={relatedEntry.slug}
              entry={relatedEntry}
              labels={translation.entryCard}
              form={translation.form}
            />
          ))}
        </div>
      </section>
      : null}
    </main>
  );
}
