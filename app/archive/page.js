import EntryBrowser from "../../components/EntryBrowser.js";
import { cookies } from "next/headers";
import { getPublishedEntries } from "../../lib/entries.js";
import { normalizeLanguage } from "../../lib/language.js";
import { getTranslation } from "../../lib/translations.js";

const styles = {
  hero: {
    display: "block",
    padding: "34px 0 16px",
  },
  title: {
    maxWidth: "none",
    margin: 0,
    fontFamily: "var(--font-display)",
    fontSize: "var(--text-display)",
    fontWeight: 800,
    lineHeight: 0.82,
    letterSpacing: ".015em",
  },
  intro: {
    maxWidth: "720px",
    margin: "14px 0 0",
    color: "var(--muted)",
    fontSize: "var(--text-lead)",
    lineHeight: 1.75,
  },
};

export const metadata = {
  title: "Archive Memories",
};

export default async function ArchivePage() {
  const [entries, cookieStore] = await Promise.all([
    getPublishedEntries(),
    cookies(),
  ]);
  const t = getTranslation(
    normalizeLanguage(cookieStore.get("language")?.value),
  );

  return (
    <main className="page-shell">
      <header
        className="page-hero compact-hero archive-hero"
        style={styles.hero}
      >
        <h1 style={styles.title}>{t.archive.title}</h1>
        <p style={styles.intro}>
          {t.archive.intro.replace("{count}", entries.length)}
        </p>
      </header>
      <EntryBrowser
        entries={entries}
        labels={{ ...t.archive, entryCard: t.entryCard }}
        form={t.form}
        comboBox={t.comboBox}
      />
    </main>
  );
}
