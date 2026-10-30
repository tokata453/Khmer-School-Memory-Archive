import collection from "../collection.config.js";
import EntryCard from "../components/EntryCard.js";
import { cookies } from "next/headers";
import { getPublishedEntries } from "../lib/entries.js";
import { normalizeLanguage } from "../lib/language.js";
import { getTranslation } from "../lib/translations.js";
import HomeSearch from "../components/HomeSearch.js";

const styles = {
  block: { paddingTop: "64px" }, heading: { display: "flex", justifyContent: "space-between", gap: "20px", alignItems: "center", marginBottom: "20px" }, sectionTitle: { margin: 0, color: "var(--indigo)", fontFamily: "var(--font-display)", fontSize: "var(--text-section)", fontWeight: 700, lineHeight: 1.08 }, list: {}, panel: { display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(260px, .6fr)", gap: "40px", padding: "32px", border: "1px solid var(--rule)", borderRadius: "2px", background: "var(--paper)" }, panelTitle: { margin: 0, color: "var(--indigo)", fontFamily: "var(--font-display)", fontSize: "var(--text-section)", fontWeight: 700, lineHeight: 1.08 }, panelText: { maxWidth: "560px", margin: 0, color: "var(--muted)", fontSize: "var(--text-lead)", lineHeight: 1.75 },
};

export default async function Home() {
  const [entries, cookieStore] = await Promise.all([getPublishedEntries(), cookies()]);
  const t = getTranslation(normalizeLanguage(cookieStore.get("language")?.value));
  const featuredEntries = entries.slice(0, 3);
  const facts = [
    [entries.length, t.archive.entries],
    [new Set(entries.map((entry) => entry.province).filter(Boolean)).size, t.archive.province],
    [new Set(entries.map((entry) => entry.school_level).filter(Boolean)).size, t.archive.schoolLevel],
    [new Set(entries.map((entry) => Math.floor(Number(entry.memory_year) / 10) * 10).filter(Number.isFinite)).size, t.archive.decade],
  ];

  return (
    <main>
      <section className="home-hero">
        <div className="home-hero-content">
          <p className="home-hero-eyebrow">{t.home.eyebrow}</p>
          <h1 className="home-hero-title">{collection.name}</h1>
          <p className="home-hero-description">{collection.description}</p>
          <HomeSearch archive={t.archive} form={t.form} header={t.header} comboBox={t.comboBox} />
        </div>
      </section>

      <section className="home-facts" aria-label={t.archive.entries}>
        {facts.map(([value, label]) => <div className="home-fact" key={label}><strong>{value}</strong><span>{label}</span></div>)}
      </section>

      <section className="page-shell section-block" style={styles.block}>
        <div className="section-heading" style={styles.heading}>
          <h2 style={styles.sectionTitle}>{t.home.start}</h2>
        </div>
        <div className="entry-card-grid" style={styles.list}>
          {featuredEntries.length > 0 ? (
            featuredEntries.map((entry) => (
              <EntryCard key={entry.slug} entry={entry} labels={t.entryCard} form={t.form} />
            ))
          ) : (
            <p>{t.home.empty}</p>
          )}
        </div>
      </section>

      <section className="page-shell section-block" style={styles.block}>
        <div className="archive-panel" style={styles.panel}>
          <h2 style={styles.panelTitle}>{t.home.recordsTitle}</h2>
          <p style={styles.panelText}>{t.home.recordsBody}</p>
        </div>
      </section>
    </main>
  );
}
