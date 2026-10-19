"use client";

import { useEffect, useState } from "react";
import EntryCard from "./EntryCard.js";

export default function EntryBrowser({ entries, labels }) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();

  useEffect(() => {
    if (window.location.hash === "#entry-search") {
      document.getElementById("entry-search")?.focus();
    }
  }, []);

  const filteredEntries = normalizedQuery
    ? entries.filter((entry) => {
        const searchableText = [
          entry.title,
          entry.category,
          entry.contributor,
          entry.place,
          entry.period,
          entry.featuredObject,
          entry.excerpt,
          entry.memory,
          entry.learningMethod,
          entry.reflection,
        ]
          .join(" ")
          .toLowerCase();

        return searchableText.includes(normalizedQuery);
      })
    : entries;

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
