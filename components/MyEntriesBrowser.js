"use client";

import { useState } from "react";
import EntryCard from "./EntryCard.js";
import { filterMyEntries } from "../lib/my-entries.js";

const styles = {
  controls: { display: "grid", gridTemplateColumns: "minmax(0, 1fr) 220px", gap: "16px", margin: "28px 0" },
  label: { display: "grid", gap: "8px", fontFamily: "var(--font-interface)", fontSize: "var(--text-label)", fontWeight: 750, letterSpacing: "0.045em", textTransform: "uppercase" },
  input: { width: "100%", minHeight: "48px", padding: "10px", border: "1px solid var(--rule)", borderRadius: 0, color: "var(--carbon)", background: "var(--paper)", font: "inherit" },
  empty: { padding: "28px 0", borderTop: "2px solid var(--carbon)", color: "var(--muted)" },
};

export default function MyEntriesBrowser({ entries, labels, form, cardLabels }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const filteredEntries = filterMyEntries(entries, query, status);

  if (!entries.length) return <p style={styles.empty}>{labels.noEntries}</p>;

  return (
    <section aria-label={labels.myEntriesTitle}>
      <div className="my-entries-controls" style={styles.controls}>
        <label style={styles.label} htmlFor="my-entries-search">
          {labels.searchLabel}
          <input id="my-entries-search" style={styles.input} type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={labels.searchPlaceholder} />
        </label>
        <label style={styles.label}>
          {labels.status}
          <select style={styles.input} value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="">{labels.allStatuses}</option>
            <option value="pending">{labels.pending}</option>
            <option value="published">{labels.published}</option>
            <option value="returned">{labels.returned}</option>
          </select>
        </label>
      </div>
      {filteredEntries.length ? (
        <div className="entry-card-grid">
          {filteredEntries.map((entry) => <EntryCard key={entry.id} entry={entry} labels={cardLabels} form={form} statusLabel={`${labels.status}: ${labels[entry.status]}`} />)}
        </div>
      ) : <p style={styles.empty}>{labels.noMatchingEntries}</p>}
    </section>
  );
}