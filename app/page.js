import collection from "../collection.config.js";
import EntryCard from "../components/EntryCard.js";
import Link from "next/link";
import { cookies } from "next/headers";
import { getPublishedEntries } from "../lib/entries.js";
import { normalizeLanguage } from "../lib/language.js";
import { getTranslation } from "../lib/translations.js";
import HomeSearch from "../components/HomeSearch.js";
import HomeExplore from "../components/HomeExplore.js";
import HomeProcess from "../components/HomeProcess.js";
import HomeInvitation from "../components/HomeInvitation.js";
import { schoolLevels } from "../lib/entry-form.js";

const styles = {
  block: { paddingTop: "64px" }, heading: { display: "flex", justifyContent: "space-between", gap: "20px", alignItems: "center", marginBottom: "20px" }, sectionTitle: { margin: 0, color: "var(--indigo)", fontFamily: "var(--font-display)", fontSize: "var(--text-section)", fontWeight: 700, lineHeight: 1.08 }, list: {}, panel: { display: "grid", gap: "14px", padding: "32px", border: "1px solid var(--rule)", borderRadius: "2px", background: "var(--paper)" }, panelTitle: { margin: 0, color: "var(--indigo)", fontFamily: "var(--font-display)", fontSize: "var(--text-section)", fontWeight: 700, lineHeight: 1.08 }, panelText: { maxWidth: "720px", margin: 0, color: "var(--muted)", fontSize: "var(--text-lead)", lineHeight: 1.75 },
};

export default async function Home() {
  const [entries, featuredEntries, cookieStore] = await Promise.all([
    getPublishedEntries(),
    getPublishedEntries({ order: "newest", limit: 3 }),
    cookies(),
  ]);
  const language = normalizeLanguage(cookieStore.get("language")?.value);
  const t = getTranslation(language);
  const memoryYears = entries
    .map((entry) => Number(entry.memory_year))
    .filter((year) => Number.isInteger(year) && year >= 1900);
  const facts = [
    [entries.length, t.home.publishedMemories],
    [new Set(entries.map((entry) => entry.province).filter(Boolean)).size, t.home.provinces],
    [new Set(entries.map((entry) => entry.school_level).filter(Boolean)).size, t.home.schoolLevels],
    [new Set(memoryYears.map((year) => Math.floor(year / 10) * 10)).size, t.home.decades],
  ];
  const levels = schoolLevels
    .map((value) => ({
      value,
      label: t.form.levels[value],
      count: entries.filter((entry) => entry.school_level === value).length,
    }))
    .filter((level) => level.count > 0);

  return (
    <main>
      <section className="home-hero">
        <div className="home-hero-content">
          <p className="home-hero-eyebrow">{t.home.eyebrow}</p>
          <h1 className="home-hero-title">{language === "km" ? collection.nameKhmer : collection.name}</h1>
          <p className="home-hero-description">{language === "km" ? collection.descriptionKhmer : collection.description}</p>
          <HomeSearch archive={t.archive} form={t.form} header={t.header} comboBox={t.comboBox} />
        </div>
      </section>

      <section className="home-facts" aria-label={t.home.statisticsLabel}>
        {facts.map(([value, label]) => <div className="home-fact" key={label}><strong>{value}</strong><span>{label}</span></div>)}
      </section>

      <section className="page-shell section-block" style={styles.block}>
        <div className="section-heading" style={styles.heading}>
          <h2 style={styles.sectionTitle}>{t.home.start}</h2>
          <Link className="section-link" href="/archive">{t.home.browseAll}</Link>
        </div>
        <div className="entry-card-grid" style={styles.list}>
          {featuredEntries.length > 0 ? (
            featuredEntries.map((entry) => (
              <EntryCard key={entry.slug} entry={entry} labels={t.entryCard} form={t.form} headingLevel="h3" />
            ))
          ) : (
            <p>{t.home.empty}</p>
          )}
        </div>
      </section>

      <HomeExplore levels={levels} labels={t.home.explore} />

      <section className="page-shell section-block" style={styles.block}>
        <div className="archive-panel" style={styles.panel}>
          <h2 style={styles.panelTitle}>{t.home.recordsTitle}</h2>
          <div className="home-records-grid">
            <p style={styles.panelText}>{t.home.recordsBody}</p>
            <ul>{t.home.recordsPoints.map((point) => <li key={point}>{point}</li>)}</ul>
          </div>
          <Link className="section-link" href="/about">{t.home.learnMore}</Link>
        </div>
      </section>

      <HomeProcess labels={t.home.process} />
      <HomeInvitation labels={t.home.invitation} />
    </main>
  );
}
