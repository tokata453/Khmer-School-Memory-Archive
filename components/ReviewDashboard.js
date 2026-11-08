"use client";

import { useState } from "react";
import EntryCard from "./EntryCard.js";
import ComboBox from "./ComboBox.js";
import { provinces, schoolLevels } from "../lib/entry-form.js";
import { filterDashboardEntries } from "../lib/dashboard-utils.js";

const styles = { controls: { display: "grid", gap: "16px", margin: "28px 0" }, filters: { display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", border: "1px solid var(--rule)" }, label: { display: "grid", gap: "8px", fontFamily: "var(--font-primary)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: ".045em", textTransform: "uppercase" }, input: { width: "100%", minHeight: "48px", padding: "10px", border: "1px solid var(--rule)", background: "var(--paper)", color: "var(--carbon)" }, empty: { padding: "28px 0", borderTop: "2px solid var(--carbon)", color: "var(--muted)" } };

export default function ReviewDashboard({ entries, labels, form, cardLabels, comboBox }) {
  const [query, setQuery] = useState(""); const [province, setProvince] = useState(""); const [schoolLevel, setSchoolLevel] = useState(""); const [sort, setSort] = useState("oldest");
  const filtered = filterDashboardEntries(entries, { query, province, schoolLevel, sort });
  return <section aria-label={labels.queueTitle}><div style={styles.controls}><label style={styles.label}>{labels.searchLabel}<input style={styles.input} type="search" value={query} placeholder={labels.searchPlaceholder} onChange={(event) => setQuery(event.target.value)} /></label><div className="review-filter-row" style={styles.filters}><label style={styles.label}>{labels.province}<ComboBox id="review-province" value={province} options={[{ value: "", label: labels.allProvinces }, ...provinces.map((value) => ({ value, label: value }))]} placeholder={labels.allProvinces} noResultsLabel={comboBox.noOptions} onChange={setProvince} /></label><label style={styles.label}>{labels.schoolLevel}<ComboBox id="review-school-level" value={schoolLevel} options={[{ value: "", label: labels.allSchoolLevels }, ...schoolLevels.map((value) => ({ value, label: form.levels[value] }))]} placeholder={labels.allSchoolLevels} noResultsLabel={comboBox.noOptions} onChange={setSchoolLevel} /></label><label style={styles.label}>{labels.sort}<ComboBox id="review-sort" value={sort} options={[{ value: "oldest", label: labels.oldest }, { value: "newest", label: labels.newest }]} placeholder={labels.sort} noResultsLabel={comboBox.noOptions} onChange={setSort} /></label></div></div>{filtered.length ? <div className="entry-card-grid">{filtered.map((entry) => <EntryCard key={entry.id} entry={entry} labels={cardLabels} form={form} statusLabel={labels.pending} />)}</div> : <p style={styles.empty}>{labels.noMatches}</p>}</section>;
}
