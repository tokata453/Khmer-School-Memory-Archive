import collection from "../collection.config.js";
import EntryCard from "../components/EntryCard.js";
import Link from "next/link";
import { cookies } from "next/headers";
import { getPublishedEntries } from "../lib/entries.js";
import { normalizeLanguage } from "../lib/language.js";
import { getTranslation } from "../lib/translations.js";

const styles = {
  hero: { marginTop: "26px", overflow: "hidden", borderTop: "2px solid var(--carbon)", borderBottom: "1px solid var(--carbon)", background: "var(--paper)" }, content: { padding: "clamp(28px, 5vw, 68px)" }, title: { maxWidth: "900px", margin: 0, color: "var(--carbon)", fontFamily: "var(--font-display)", fontSize: "var(--text-display)", fontWeight: 800, lineHeight: .82, letterSpacing: ".015em" }, description: { maxWidth: "34rem", margin: "clamp(28px, 4vw, 52px) 0 0", paddingTop: "16px", borderTop: "1px solid var(--rule)", color: "var(--muted)", fontSize: "var(--text-lead)", lineHeight: 1.75 }, link: { display: "inline-block", marginTop: "28px", padding: "13px 18px", border: "1px solid var(--carbon)", borderRadius: 0, background: "var(--vermilion)", color: "var(--paper)", fontFamily: "var(--font-interface)", fontWeight: 750, textDecoration: "none" }, block: { paddingTop: "56px" }, heading: { display: "grid", gridTemplateColumns: "max-content 1fr", gap: "30px", alignItems: "start", marginBottom: "18px", borderTop: "2px solid var(--carbon)", paddingTop: "16px" }, sectionTitle: { margin: 0, fontFamily: "var(--font-display)", fontSize: "var(--text-section)", fontWeight: 800, lineHeight: .88, letterSpacing: ".015em" }, list: {}, panel: { display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(260px, .6fr)", gap: "40px", padding: "28px 0", borderTop: "2px solid var(--carbon)", borderBottom: "1px solid var(--rule)" }, panelTitle: { margin: 0, fontFamily: "var(--font-display)", fontSize: "var(--text-section)", lineHeight: .9 }, panelText: { maxWidth: "560px", margin: 0, color: "var(--muted)", fontSize: "var(--text-lead)", lineHeight: 1.75 },
};

export default async function Home() {
  const [entries, cookieStore] = await Promise.all([getPublishedEntries(), cookies()]);
  const t = getTranslation(normalizeLanguage(cookieStore.get("language")?.value));
  const featuredEntries = entries.slice(0, 3);

  return (
    <main>
      <section className="hero-section page-shell" style={styles.hero}>
        <div className="hero-content" style={styles.content}>
          <h1 className="archive-title" style={styles.title}>{collection.name}</h1>
          <p className="archive-description" style={styles.description}>{collection.description}</p>
          <Link className="primary-link" style={styles.link} href="/archive">
            {t.home.browse}
          </Link>
        </div>
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
