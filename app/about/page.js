import collection from "../../collection.config.js";
import { cookies } from "next/headers";
import { normalizeLanguage } from "../../lib/language.js";
import { getTranslation } from "../../lib/translations.js";

const styles = {
  hero: { display: "block", padding: "34px 0 16px" },
  title: {
    maxWidth: "none",
    margin: 0,
    fontFamily: "var(--font-primary)",
    fontSize: "var(--text-display)",
    fontWeight: 700,
    lineHeight: 0.82,
    letterSpacing: ".015em",
  },
  intro: {
    maxWidth: "1000px",
    margin: "14px 0 0",
    color: "var(--muted)",
    fontSize: "var(--text-lead)",
    lineHeight: 1.75,
  },
  stack: { display: "grid", gap: "28px", paddingTop: "28px" },
  panel: { padding: "24px" },
  sectionTitle: {
    maxWidth: "1000px",
    margin: 0,
    fontFamily: "var(--font-primary)",
    fontSize: "var(--text-section)",
    fontWeight: 700,
    lineHeight: 0.9,
  },
  text: {
    color: "var(--muted)",
    fontSize: "var(--text-lead)",
    lineHeight: 1.75,
  },
  process: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    border: "1px solid var(--rule)",
    borderTop: "3px double var(--gold)",
    background: "var(--paper)",
  },
  step: {
    minHeight: "190px",
    padding: "18px",
    borderRight: "1px solid var(--rule)",
  },
  lastStep: { borderRight: 0 },
  number: {
    color: "var(--gold)",
    fontFamily: "var(--font-primary)",
    fontVariantNumeric: "tabular-nums",
    letterSpacing: "-0.03em",
    fontSize: "1.25rem",
    fontWeight: 700,
  },
  stepText: {
    margin: "64px 0 0",
    fontFamily: "var(--font-primary)",
    fontSize: "var(--text-section)",
    fontWeight: 700,
    lineHeight: 1,
  },
  credits: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))",
    gap: "1px",
    marginTop: "20px",
    border: "1px solid var(--rule)",
    background: "var(--rule)",
  },
  credit: { minHeight: "112px", padding: "18px", background: "#fffdf5" },
  creditLabel: {
    display: "block",
    marginBottom: "12px",
    color: "var(--muted)",
    fontFamily: "var(--font-primary)",
    fontSize: "var(--text-label)",
    fontWeight: 700,
    letterSpacing: ".08em",
    textTransform: "uppercase",
  },
  creditValue: {
    margin: 0,
    fontFamily: "var(--font-primary)",
    fontSize: "1.2rem",
    fontWeight: 700,
    lineHeight: 1.4,
  },
};

export const metadata = {
  title: "About Project",
};

export default async function AboutPage() {
  const cookieStore = await cookies();
  const t = getTranslation(
    normalizeLanguage(cookieStore.get("language")?.value),
  );

  return (
    <main className="page-shell">
      <header
        className="page-hero compact-hero archive-hero"
        style={styles.hero}
      >
        <h1 style={styles.title}>{t.about.title}</h1>
        <p style={styles.intro}>{collection.description}</p>
      </header>

      <div className="about-stack" style={styles.stack}>
        <section className="archive-panel" style={styles.panel}>
          <h2 style={styles.sectionTitle}>{t.about.purpose}</h2>
          <p style={styles.text}>{t.about.purposeBody}</p>
        </section>

        <section
          className="process-grid"
          style={styles.process}
          aria-label={t.about.processLabel}
        >
          {t.about.steps.map((step, index) => (
            <div
              style={{
                ...styles.step,
                ...(index === t.about.steps.length - 1 ? styles.lastStep : {}),
              }}
              key={step}
            >
              <span style={styles.number}>
                {String(index + 1).padStart(2, "0")}
              </span>
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
          <div style={styles.credits}>
            <div style={styles.credit}>
              <span style={styles.creditLabel}>{t.about.created}</span>
              <p style={styles.creditValue}>{collection.curator}</p>
            </div>
            <div style={styles.credit}>
              <span style={styles.creditLabel}>{t.about.source}</span>
              <p style={styles.creditValue}>{collection.source}</p>
            </div>
            <div style={styles.credit}>
              <span style={styles.creditLabel}>{t.about.method}</span>
              <p style={styles.creditValue}>{t.footer.built}</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
