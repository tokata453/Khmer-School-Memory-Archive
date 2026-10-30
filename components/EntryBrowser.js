"use client";

import { useEffect, useState } from "react";
import EntryCard from "./EntryCard.js";
import ComboBox from "./ComboBox.js";
import { provinces, schoolLevels } from "../lib/entry-form.js";

const styles = {
  panel: { paddingTop: "0px" },
  header: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: "20px",
    alignItems: "end",
  },
  kicker: { display: "none" },
  title: {
    margin: "18px 0 0",
    fontFamily: "var(--font-display)",
    fontSize: "var(--text-display)",
    fontWeight: 800,
    lineHeight: 0.82,
    letterSpacing: ".015em",
  },
  count: {
    color: "var(--vermilion)",
    fontFamily: "var(--font-interface)",
    fontSize: "var(--text-label)",
    fontWeight: 700,
    letterSpacing: "0.045em",
    textTransform: "uppercase",
  },
  searchRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    alignItems: "end",
    margin: "28px 0 34px",
    padding: "18px 0",
    borderTop: "2px solid var(--carbon)",
    borderBottom: "1px solid var(--rule)",
  },
  searchGroup: {
    flex: "2 1 360px",
    minWidth: "min(100%, 260px)",
  },
  searchLabel: {
    display: "block",
    marginBottom: "4px",
    color: "var(--carbon)",
    fontFamily: "var(--font-interface)",
    fontSize: "0.9rem",
    fontWeight: 700,
  },
  searchInput: {
    width: "100%",
    minHeight: "44px",
    padding: "10px 0",
    border: 0,
    borderBottom: "2px solid var(--carbon)",
    borderRadius: 0,
    color: "var(--carbon)",
    background: "transparent",
    font: "inherit",
  },
  filterLabel: {
    display: "grid",
    flex: "1 1 180px",
    gap: "4px",
    minWidth: "160px",
    padding: "0",
    fontWeight: 700,
  },
  select: {
    width: "100%",
    padding: "10px 0",
    border: 0,
    borderRadius: 0,
    color: "var(--carbon)",
    background: "transparent",
    font: "inherit",
  },
  list: {},
  empty: {
    padding: "28px 0",
    borderTop: "2px solid var(--carbon)",
    borderBottom: "1px solid var(--rule)",
  },
  emptyTitle: { margin: "0 0 8px", fontSize: "var(--text-section)" },
  emptyText: { color: "var(--muted)" },
};

export default function EntryBrowser({ entries, labels, form, comboBox }) {
  const [query, setQuery] = useState("");
  const [province, setProvince] = useState("");
  const [schoolLevel, setSchoolLevel] = useState("");
  const [decade, setDecade] = useState("");
  const normalizedQuery = query.trim().toLowerCase();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setQuery(searchParams.get("q") || "");
    const value = searchParams.get("schoolLevel") || "";
    setSchoolLevel(schoolLevels.includes(value) ? value : "");
    if (window.location.hash === "#entry-search") {
      document.getElementById("entry-search")?.focus();
    }
  }, []);

  const filteredEntries = entries.filter((entry) => {
    const matchesQuery =
      !normalizedQuery ||
      (() => {
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
    return (
      matchesQuery &&
      (!province || entry.province === province) &&
      (!schoolLevel || entry.school_level === schoolLevel) &&
      (!decade || Math.floor(entry.memory_year / 10) * 10 === Number(decade))
    );
  });

  const resultLabel =
    filteredEntries.length === 1
      ? labels.oneResult
      : labels.manyResults.replace("{count}", filteredEntries.length);

  return (
    <section
      className="browser-panel"
      style={styles.panel}
      aria-labelledby="browse-heading"
    >
      <div className="search-row archive-search-row" style={styles.searchRow}>
        <div style={styles.searchGroup}>
          <label
            className="search-label"
            style={styles.searchLabel}
            htmlFor="entry-search"
          >
            {labels.searchLabel}
          </label>
          <input
            id="entry-search"
            className="search-input"
            style={styles.searchInput}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={labels.placeholder}
          />
        </div>

        <label style={styles.filterLabel}>
          {labels.province}
          <ComboBox
            id="archive-province"
            value={province}
            options={[
              { value: "", label: labels.allProvinces },
              ...provinces.map((value) => ({ value, label: value })),
            ]}
            placeholder={labels.allProvinces}
            noResultsLabel={comboBox.noOptions}
            onChange={setProvince}
          />
        </label>
        <label style={styles.filterLabel}>
          {labels.schoolLevel}
          <ComboBox
            id="archive-school-level"
            value={schoolLevel}
            options={[
              { value: "", label: labels.allSchoolLevels },
              ...schoolLevels.map((value) => ({
                value,
                label: form.levels[value],
              })),
            ]}
            placeholder={labels.allSchoolLevels}
            noResultsLabel={comboBox.noOptions}
            onChange={setSchoolLevel}
          />
        </label>
        <label style={styles.filterLabel}>
          {labels.decade}
          <ComboBox
            id="archive-decade"
            value={decade}
            options={[
              { value: "", label: labels.allDecades },
              ...[
                ...new Set(
                  entries.map(
                    (entry) => Math.floor(entry.memory_year / 10) * 10,
                  ),
                ),
              ]
                .sort()
                .map((value) => ({ value: String(value), label: `${value}s` })),
            ]}
            placeholder={labels.allDecades}
            noResultsLabel={comboBox.noOptions}
            onChange={setDecade}
          />
        </label>
      </div>

      {filteredEntries.length > 0 ? (
        <div
          className="entry-card-grid"
          style={styles.list}
          aria-label={labels.entries}
        >
          {filteredEntries.map((entry) => (
            <EntryCard
              key={entry.slug}
              entry={entry}
              labels={labels.entryCard}
              form={form}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state" style={styles.empty} role="status">
          <p className="empty-title" style={styles.emptyTitle}>
            {labels.emptyTitle}
          </p>
          <p className="empty-text" style={styles.emptyText}>
            {labels.emptyText}
          </p>
        </div>
      )}
    </section>
  );
}
