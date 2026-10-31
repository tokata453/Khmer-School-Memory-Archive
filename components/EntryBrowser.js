"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import EntryCard from "./EntryCard.js";
import ComboBox from "./ComboBox.js";
import { provinces, schoolLevels } from "../lib/entry-form.js";
import { sortArchiveEntries } from "../lib/archive-browser.js";

const styles = {
  panel: { paddingTop: "0px" },
  controls: { display: "grid", gap: "16px", margin: "28px 0" },
  filters: { display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", border: "1px solid var(--rule)" },
  label: { display: "grid", gap: "8px", fontFamily: "var(--font-primary)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.045em", textTransform: "uppercase" },
  input: { width: "100%", minHeight: "48px", padding: "10px", border: "1px solid var(--rule)", borderRadius: 0, color: "var(--carbon)", background: "var(--paper)", font: "inherit" },
  list: {},
  empty: {
    padding: "28px 0",
    borderTop: "2px solid var(--carbon)",
    borderBottom: "1px solid var(--rule)",
  },
  emptyTitle: { margin: "0 0 8px", fontSize: "var(--text-section)" },
  emptyText: { color: "var(--muted)" },
  emptyAction: { display: "inline-block", marginTop: "16px", padding: "10px 14px", textDecoration: "none" },
};

export default function EntryBrowser({ entries, labels, form, comboBox }) {
  const [query, setQuery] = useState("");
  const [province, setProvince] = useState("");
  const [schoolLevel, setSchoolLevel] = useState("");
  const [decade, setDecade] = useState("");
  const [sort, setSort] = useState("newest");
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

  const sortedEntries = sortArchiveEntries(filteredEntries, sort);
  const resultLabel =
    sortedEntries.length === 1
      ? labels.oneResult
      : labels.manyResults.replace("{count}", sortedEntries.length);

  return (
    <section
      className="browser-panel"
      style={styles.panel}
      aria-labelledby="browse-heading"
    >
      <div className="archive-controls search-row" style={styles.controls}>
        <label style={styles.label} htmlFor="entry-search">
          {labels.searchLabel}
          <input
            id="entry-search"
            style={styles.input}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={labels.placeholder}
          />
        </label>
        <div className="archive-filter-row" style={styles.filters}>
          <label style={styles.label}>
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
          <label style={styles.label}>
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
          <label style={styles.label}>
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
          <label style={styles.label}>
            {labels.sort}
            <ComboBox
            id="archive-sort"
            value={sort}
            options={[
              { value: "newest", label: labels.newest },
              { value: "oldest", label: labels.oldest },
            ]}
            placeholder={labels.sort}
            noResultsLabel={comboBox.noOptions}
            onChange={setSort}
            />
          </label>
        </div>
      </div>

      {sortedEntries.length > 0 ? (
        <div
          className="entry-card-grid"
          style={styles.list}
          aria-label={labels.entries}
        >
          {sortedEntries.map((entry) => (
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
          <Link className="primary-link" style={styles.emptyAction} href="/contribute">
            {form.addEntry}
          </Link>
        </div>
      )}
    </section>
  );
}
