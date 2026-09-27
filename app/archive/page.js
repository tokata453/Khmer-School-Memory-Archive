import EntryBrowser from "../../components/EntryBrowser.js";
import { getEntries } from "../../lib/entries.js";

export const metadata = {
  title: "Archive Memories",
};

export default async function ArchivePage() {
  const entries = await getEntries();

  return (
    <main className="page-shell">
      <header className="page-hero compact-hero archive-hero">
        <h1>Browse school memories before digital learning.</h1>
        <p>
          Search {entries.length} archive records by name, province, object,
          school memory, period, or topic.
        </p>
      </header>
      <EntryBrowser entries={entries} />
    </main>
  );
}