"use client";

import { useState } from "react";
import EntryCard from "./EntryCard.js";

export default function EntryBrowser({ entries }) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();

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
      ? "1 matching entry"
      : `${filteredEntries.length} matching entries`;

  return (
    <section className="browser-panel" aria-labelledby="browse-heading">
      <div className="browser-header">
        <div>
          <p className="browser-kicker">Browse the archive</p>
          <h2 id="browse-heading" className="browser-title">
            Search entries
          </h2>
        </div>
        <p className="result-count" aria-live="polite">
          {resultLabel}
        </p>
      </div>

      <div className="search-row">
        <label className="search-label" htmlFor="entry-search">
          Search by name, place, object, memory, or year
        </label>
        <div className="search-controls">
          <input
            id="entry-search"
            className="search-input"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try Kampong Cham, textbook, notes..."
          />
          <button
            className="clear-search"
            type="button"
            onClick={() => setQuery("")}
            disabled={!query}
          >
            Clear
          </button>
        </div>
      </div>

      {filteredEntries.length > 0 ? (
        <div className="entries-list" aria-label="Archive entries">
          {filteredEntries.map((entry, index) => (
            <EntryCard key={entry.slug} entry={entry} recordNumber={index + 1} />
          ))}
        </div>
      ) : (
        <div className="empty-state" role="status">
          <p className="empty-title">No entries found</p>
          <p className="empty-text">
            Try a different name, province, object, memory, or year. Clearing the
            search will show every archive entry again.
          </p>
        </div>
      )}
    </section>
  );
}
