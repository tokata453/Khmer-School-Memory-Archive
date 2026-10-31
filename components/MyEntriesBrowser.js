"use client";

import { useState } from "react";
import Link from "next/link";
import EntryCard from "./EntryCard.js";
import ComboBox from "./ComboBox.js";
import { provinces, schoolLevels } from "../lib/entry-form.js";
import { filterMyEntries } from "../lib/my-entries.js";

const styles = {
  controls: { display: "grid", gap: "16px", margin: "28px 0" },
  filters: { display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", border: "1px solid var(--rule)" },
  label: { display: "grid", gap: "8px", fontFamily: "var(--font-primary)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.045em", textTransform: "uppercase" },
  input: { width: "100%", minHeight: "48px", padding: "10px", border: "1px solid var(--rule)", borderRadius: 0, color: "var(--carbon)", background: "var(--paper)", font: "inherit" },
  empty: { padding: "28px 0", borderTop: "2px solid var(--carbon)", color: "var(--muted)" },
  emptyAction: { display: "inline-block", marginTop: "16px", padding: "10px 14px", textDecoration: "none" },
};

export default function MyEntriesBrowser({ entries, labels, form, cardLabels, comboBox }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [province, setProvince] = useState("");
  const [schoolLevel, setSchoolLevel] = useState("");
  const [decade, setDecade] = useState("");
  const [sort, setSort] = useState("newest");
  const filteredEntries = filterMyEntries(entries, { query, status, province, schoolLevel, decade, sort });

  if (!entries.length) return <div style={styles.empty}><p>{labels.noEntries}</p><Link className="primary-link" style={styles.emptyAction} href="/contribute">{form.addEntry}</Link></div>;

  return (
    <section aria-label={labels.myEntriesTitle}>
      <div className="my-entries-controls search-row" style={styles.controls}>
        <label style={styles.label} htmlFor="my-entries-search">
          {labels.searchLabel}
          <input id="my-entries-search" style={styles.input} type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={labels.searchPlaceholder} />
        </label>
        <div className="my-entries-filter-row" style={styles.filters}>
          <label style={styles.label}>{labels.status}<ComboBox id="my-entries-status" value={status} options={[{ value: "", label: labels.allStatuses }, ...["pending", "published", "returned"].map((value) => ({ value, label: labels[value] }))]} placeholder={labels.allStatuses} noResultsLabel={comboBox.noOptions} onChange={setStatus} /></label>
          <label style={styles.label}>{labels.province}<ComboBox id="my-entries-province" value={province} options={[{ value: "", label: labels.allProvinces }, ...provinces.map((value) => ({ value, label: value }))]} placeholder={labels.allProvinces} noResultsLabel={comboBox.noOptions} onChange={setProvince} /></label>
          <label style={styles.label}>{labels.schoolLevel}<ComboBox id="my-entries-school-level" value={schoolLevel} options={[{ value: "", label: labels.allSchoolLevels }, ...schoolLevels.map((value) => ({ value, label: form.levels[value] }))]} placeholder={labels.allSchoolLevels} noResultsLabel={comboBox.noOptions} onChange={setSchoolLevel} /></label>
          <label style={styles.label}>{labels.decade}<ComboBox id="my-entries-decade" value={decade} options={[{ value: "", label: labels.allDecades }, ...[...new Set(entries.map((entry) => Math.floor(entry.memory_year / 10) * 10))].sort().map((value) => ({ value: String(value), label: `${value}s` }))]} placeholder={labels.allDecades} noResultsLabel={comboBox.noOptions} onChange={setDecade} /></label>
          <label style={styles.label}>{labels.sort}<ComboBox id="my-entries-sort" value={sort} options={[{ value: "newest", label: labels.newest }, { value: "oldest", label: labels.oldest }]} placeholder={labels.sort} noResultsLabel={comboBox.noOptions} onChange={setSort} /></label>
        </div>
      </div>
      {filteredEntries.length ? (
        <div className="entry-card-grid">
          {filteredEntries.map((entry) => <EntryCard key={entry.id} entry={entry} labels={cardLabels} form={form} statusLabel={`${labels.status}: ${labels[entry.status]}`} />)}
        </div>
      ) : <div style={styles.empty}><p>{labels.noMatchingEntries}</p><Link className="primary-link" style={styles.emptyAction} href="/contribute">{form.addEntry}</Link></div>}
    </section>
  );
}