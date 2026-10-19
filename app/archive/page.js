import EntryBrowser from "../../components/EntryBrowser.js";
import { cookies } from "next/headers";
import { getEntries } from "../../lib/entries.js";
import { normalizeLanguage } from "../../lib/language.js";
import { getTranslation } from "../../lib/translations.js";

export const metadata = {
  title: "Archive Memories",
};

export default async function ArchivePage() {
  const [entries, cookieStore] = await Promise.all([getEntries(), cookies()]);
  const t = getTranslation(normalizeLanguage(cookieStore.get("language")?.value));

  return (
    <main className="page-shell">
      <header className="page-hero compact-hero archive-hero">
        <h1>{t.archive.title}</h1>
        <p>{t.archive.intro.replace("{count}", entries.length)}</p>
      </header>
      <EntryBrowser entries={entries} labels={{ ...t.archive, entryCard: t.entryCard }} />
    </main>
  );
}