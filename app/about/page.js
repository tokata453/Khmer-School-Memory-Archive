import collection from "../../collection.config.js";
import { cookies } from "next/headers";
import { normalizeLanguage } from "../../lib/language.js";
import { getTranslation } from "../../lib/translations.js";

const styles = {
  hero: { display: "block", padding: "54px 0 36px", borderBottom: "1px solid var(--rule)" }, title: { maxWidth: "none", margin: 0, fontFamily: "var(--font-display)", fontSize: "var(--text-display)", fontWeight: 800, lineHeight: .82, letterSpacing: ".015em" }, intro: { maxWidth: "720px", margin: "24px 0 0", color: "var(--muted)", fontSize: "var(--text-lead)", lineHeight: 1.75 }, stack: { display: "grid", gap: "46px" }, panel: { borderTop: "2px solid var(--carbon)", paddingTop: "16px" }, sectionTitle: { maxWidth: "680px", margin: 0, fontFamily: "var(--font-display)", fontSize: "var(--text-section)", fontWeight: 800, lineHeight: .9 }, text: { color: "var(--muted)", fontSize: "var(--text-lead)", lineHeight: 1.75 }, process: { display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", borderTop: "2px solid var(--carbon)", borderBottom: "1px solid var(--rule)" }, step: { minHeight: "210px", padding: "18px", borderRight: "1px solid var(--rule)" }, lastStep: { borderRight: 0 }, number: { color: "var(--vermilion)", fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 800 }, stepText: { margin: "82px 0 0", fontSize: "var(--text-section)", lineHeight: 1 },
};

export const metadata = {
  title: "About Project",
};

export default async function AboutPage() {
  const cookieStore = await cookies();
  const t = getTranslation(normalizeLanguage(cookieStore.get("language")?.value));

  return (
    <main className="page-shell">
      <header className="page-hero compact-hero archive-hero" style={styles.hero}>
        <h1 style={styles.title}>{t.about.title}</h1>
        <p style={styles.intro}>{collection.description}</p>
      </header>

      <div className="about-stack" style={styles.stack}>
        <section className="archive-panel" style={styles.panel}>
          <h2 style={styles.sectionTitle}>{t.about.purpose}</h2>
          <p style={styles.text}>{t.about.purposeBody}</p>
        </section>

        <section className="process-grid" style={styles.process} aria-label={t.about.processLabel}>
          {t.about.steps.map((step, index) => (
            <div style={{ ...styles.step, ...(index === t.about.steps.length - 1 ? styles.lastStep : {}) }} key={step}>
              <span style={styles.number}>{String(index + 1).padStart(2, "0")}</span>
              <p style={styles.stepText}>{step}</p>
            </div>
          ))}
        </section>

        <section className="archive-panel" style={styles.panel}>
          <h2 style={styles.sectionTitle}>{t.about.method}</h2>
          <p style={styles.text}>{t.about.methodBody}</p>
        </section>

        <section className="archive-panel" style={styles.panel}>
          <h2 style={styles.sectionTitle}>{t.about.credits}</h2>
          <p style={styles.text}>
            {t.about.created} {collection.curator} for ICT 340 - Vibe Coding at the
            American University of Phnom Penh.
          </p>
          <p style={styles.text}>{t.about.source}: {collection.source}.</p>
        </section>
      </div>
    </main>
  );
}