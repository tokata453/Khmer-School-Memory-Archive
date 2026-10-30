import Link from "next/link";
import { cookies } from "next/headers";
import { getPublishedEntries } from "../../lib/entries.js";
import { normalizeLanguage } from "../../lib/language.js";
import { getTranslation } from "../../lib/translations.js";

const styles = {
  hero: { display: "block", padding: "54px 0 36px", borderBottom: "1px solid var(--rule)" }, heroTitle: { maxWidth: "none", margin: 0, fontFamily: "var(--font-display)", fontSize: "var(--text-display)", fontWeight: 800, lineHeight: .82, letterSpacing: ".015em" }, intro: { maxWidth: "720px", margin: "24px 0 0", color: "var(--muted)", fontSize: "var(--text-lead)", lineHeight: 1.75 }, grid: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "0 38px", borderTop: "2px solid var(--carbon)" }, card: { display: "grid", gridTemplateColumns: "80px 1fr", gap: "10px 24px", padding: "28px 0", borderBottom: "1px solid var(--rule)" }, number: { gridRow: "span 6", margin: 0, color: "var(--vermilion)", fontFamily: "var(--font-display)", fontSize: "calc(var(--text-section) * 1.15)", lineHeight: .85 }, title: { margin: 0, fontSize: "var(--text-section)", fontWeight: 600, lineHeight: 1 }, text: { color: "var(--muted)", fontSize: "var(--text-lead)", lineHeight: 1.75 }, details: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", margin: 0 }, detail: { borderTop: "1px solid var(--rule)", paddingTop: "10px" }, value: { margin: "7px 0 0", color: "var(--muted)" },
};

export const metadata = {
  title: "Interview Collection",
};

export default async function InterviewsPage() {
  const [entries, cookieStore] = await Promise.all([getPublishedEntries(), cookies()]);
  const t = getTranslation(normalizeLanguage(cookieStore.get("language")?.value));

  return (
    <main className="page-shell">
      <header className="page-hero compact-hero archive-hero" style={styles.hero}>
        <h1 style={styles.heroTitle}>{t.interviews.title}</h1>
        <p style={styles.intro}>{t.interviews.intro}</p>
      </header>

      <div className="interview-grid" style={styles.grid}>
        {entries.map((entry, index) => (
          <article key={entry.slug} className="interview-card" style={styles.card}>
            <p className="entry-number" style={styles.number}>{String(index + 1).padStart(2, "0")}</p>
            <p className="record-kicker">{t.form.levels[entry.school_level] || entry.school_level?.replace("_", " ")}</p>
            <h2 style={styles.title}>{entry.display_name || t.entryCard.anonymous}</h2>
            <p style={styles.text}>{entry.image_description}</p>
            <dl style={styles.details}>
              <div style={styles.detail}>
                <dt>{t.interviews.period}</dt>
                <dd style={styles.value}>{entry.memory_year}</dd>
              </div>
              <div style={styles.detail}>
                <dt>{t.interviews.location}</dt>
                <dd style={styles.value}>{entry.province}</dd>
              </div>
            </dl>
            <Link className="text-link" href={`/archive/${entry.slug}`}>
              {t.interviews.read}
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}