import EntryBrowser from "../../components/EntryBrowser.js";
import entries from "../../data/entries.js";

export const metadata = {
  title: "Archive Memories",
};

export default function ArchivePage() {
  return (
    <main className="page-shell">
      <header className="page-hero compact-hero">
        <p className="eyebrow">Archive index / {entries.length} records</p>
        <h1>Browse Cambodian school memories before digital learning.</h1>
        <p>
          Search by name, province, object, school memory, period, or topic. This
          page is the main reading room for the archive.
        </p>
      </header>
      <EntryBrowser entries={entries} />
    </main>
  );
}