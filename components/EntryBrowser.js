"use client";

import { useEffect, useState } from "react";
import EntryCard from "./EntryCard.js";
import { provinces, schoolLevels } from "../lib/entry-form.js";

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
    <section className="browser-panel" aria-labelledby="browse-heading">
      <div className="browser-header">
        <div>
          <p className="browser-kicker">{labels.kicker}</p>
          <h2 id="browse-heading" className="browser-title">
            {labels.searchTitle}
          </h2>
        </div>
        <p className="result-count" aria-live="polite">
          {resultLabel}
        </p>
      </div>

      <div className="search-row">
        <label className="search-label" htmlFor="entry-search">
          {labels.searchLabel}
        </label>
        <div className="search-controls">
          <input
            id="entry-search"
            className="search-input"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={labels.placeholder}
          />
          <button
            className="clear-search"
            type="button"
            onClick={() => setQuery("")}
            disabled={!query}
          >
            {labels.clear}
          </button>
        </div>
      </div>

      <div className="filter-row">
        <label>Province<select value={province} onChange={(event) => setProvince(event.target.value)}><option value="">All provinces</option>{provinces.map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
        <label>School level<select value={schoolLevel} onChange={(event) => setSchoolLevel(event.target.value)}><option value="">All school levels</option>{schoolLevels.map(([value, text]) => <option key={value} value={value}>{text}</option>)}</select></label>
        <label>Decade<select value={decade} onChange={(event) => setDecade(event.target.value)}><option value="">All decades</option>{[...new Set(entries.map((entry) => Math.floor(entry.memory_year / 10) * 10))].sort().map((value) => <option key={value} value={value}>{value}s</option>)}</select></label>
      </div>

      {filteredEntries.length > 0 ? (
        <div className="entries-list" aria-label={labels.entries}>
          {filteredEntries.map((entry, index) => (
            <EntryCard key={entry.slug} entry={entry} recordNumber={index + 1} labels={labels.entryCard} />
          ))}
        </div>
      ) : (
        <div className="empty-state" role="status">
          <p className="empty-title">{labels.emptyTitle}</p>
          <p className="empty-text">{labels.emptyText}</p>
        </div>
      )}
    </section>
  );
}
