"use client";

import { useEffect, useState } from "react";
import EntryCard from "./EntryCard.js";
import { provinces, schoolLevels } from "../lib/entry-form.js";

const styles = {
  panel: { paddingTop: "34px" }, header: { display: "grid", gridTemplateColumns: "1fr auto", gap: "20px", alignItems: "start" }, kicker: { display: "none" }, title: { margin: "18px 0 0", fontSize: "var(--text-display)", fontWeight: 600, lineHeight: 0.83, letterSpacing: "-0.045em" }, count: { color: "var(--indigo)", fontFamily: "var(--font-interface)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.045em", textTransform: "uppercase" }, searchRow: { margin: "28px 0 34px", padding: "18px 0", borderTop: "1px solid var(--rule)", borderBottom: "1px solid var(--rule)" }, searchLabel: { display: "block", marginBottom: "10px", color: "var(--carbon)", fontFamily: "var(--font-interface)", fontSize: "0.9rem", fontWeight: 700 }, controls: { display: "grid", gridTemplateColumns: "1fr auto", gap: "14px" }, searchInput: { width: "100%", minHeight: "52px", padding: "10px 0", border: 0, borderBottom: "2px solid var(--carbon)", borderRadius: 0, color: "var(--carbon)", background: "transparent", font: "inherit" }, clear: { minHeight: "52px", padding: "0 18px", border: 0, borderRadius: 0, color: "var(--paper)", background: "var(--carbon)", font: "inherit", fontFamily: "var(--font-interface)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.045em", cursor: "pointer" }, filters: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "16px", marginTop: "20px" }, filterLabel: { display: "grid", gap: "8px", fontWeight: 700 }, select: { width: "100%", padding: "13px", border: "1px solid var(--rule)", borderRadius: 0, color: "var(--carbon)", background: "var(--paper)", font: "inherit" }, list: { borderTop: "1px solid var(--carbon)" }, empty: { padding: "28px 0", borderTop: "2px solid var(--carbon)", borderBottom: "1px solid var(--rule)" }, emptyTitle: { margin: "0 0 8px", fontSize: "var(--text-section)" }, emptyText: { color: "var(--muted)", fontSize: "var(--text-lead)", lineHeight: 1.75 },
};

export default function EntryBrowser({ entries, labels }) {
  const [query, setQuery] = useState("");
  const [province, setProvince] = useState("");
  const [schoolLevel, setSchoolLevel] = useState("");
  const [decade, setDecade] = useState("");
  const normalizedQuery = query.trim().toLowerCase();

  useEffect(() => {
    if (window.location.hash === "#entry-search") {
      document.getElementById("entry-search")?.focus();
    }
  }, []);

  const filteredEntries = entries.filter((entry) => {
        const matchesQuery = !normalizedQuery || (() => {
        const searchableText = [
          entry.title,
          entry.image_description,
          entry.story,
          entry.province,
          entry.school_level,
          entry.memory_year,
          entry.place_time_details,
          entry.display_name,
        ]
          .join(" ")
          .toLowerCase();

        return searchableText.includes(normalizedQuery);
        })();
        return matchesQuery && (!province || entry.province === province) && (!schoolLevel || entry.school_level === schoolLevel) && (!decade || Math.floor(entry.memory_year / 10) * 10 === Number(decade));
      });

  const resultLabel =
    filteredEntries.length === 1
      ? labels.oneResult
      : labels.manyResults.replace("{count}", filteredEntries.length);

  return (
    <section className="browser-panel" style={styles.panel} aria-labelledby="browse-heading">
      <div className="browser-header" style={styles.header}>
        <div>
          <p className="browser-kicker" style={styles.kicker}>{labels.kicker}</p>
          <h2 id="browse-heading" className="browser-title" style={styles.title}>
            {labels.searchTitle}
          </h2>
        </div>
        <p className="result-count" style={styles.count} aria-live="polite">
          {resultLabel}
        </p>
      </div>

      <div className="search-row" style={styles.searchRow}>
        <label className="search-label" style={styles.searchLabel} htmlFor="entry-search">
          {labels.searchLabel}
        </label>
        <div className="search-controls" style={styles.controls}>
          <input
            id="entry-search"
            className="search-input"
            style={styles.searchInput}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={labels.placeholder}
          />
          <button
            className="clear-search"
            style={styles.clear}
            type="button"
            onClick={() => setQuery("")}
            disabled={!query}
          >
            {labels.clear}
          </button>
        </div>
      </div>

      <div className="filter-row" style={styles.filters}>
        <label style={styles.filterLabel}>Province<select style={styles.select} value={province} onChange={(event) => setProvince(event.target.value)}><option value="">All provinces</option>{provinces.map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
        <label style={styles.filterLabel}>School level<select style={styles.select} value={schoolLevel} onChange={(event) => setSchoolLevel(event.target.value)}><option value="">All school levels</option>{schoolLevels.map(([value, text]) => <option key={value} value={value}>{text}</option>)}</select></label>
        <label style={styles.filterLabel}>Decade<select style={styles.select} value={decade} onChange={(event) => setDecade(event.target.value)}><option value="">All decades</option>{[...new Set(entries.map((entry) => Math.floor(entry.memory_year / 10) * 10))].sort().map((value) => <option key={value} value={value}>{value}s</option>)}</select></label>
      </div>

      {filteredEntries.length > 0 ? (
        <div className="entries-list" style={styles.list} aria-label={labels.entries}>
          {filteredEntries.map((entry, index) => (
            <EntryCard key={entry.slug} entry={entry} recordNumber={index + 1} labels={labels.entryCard} />
          ))}
        </div>
      ) : (
        <div className="empty-state" style={styles.empty} role="status">
          <p className="empty-title" style={styles.emptyTitle}>{labels.emptyTitle}</p>
          <p className="empty-text" style={styles.emptyText}>{labels.emptyText}</p>
        </div>
      )}
    </section>
  );
}
