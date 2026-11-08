"use client";

import Link from "next/link";
import { useState } from "react";
import ComboBox from "./ComboBox.js";
import { filterDashboardEntries } from "../lib/dashboard-utils.js";

const styles = { controls: { display: "grid", gridTemplateColumns: "minmax(0, 1fr) 220px", gap: "16px", margin: "16px 0" }, label: { display: "grid", gap: "8px", fontFamily: "var(--font-primary)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: ".045em", textTransform: "uppercase" }, input: { width: "100%", minHeight: "48px", padding: "10px", border: "1px solid var(--rule)", background: "var(--paper)", color: "var(--carbon)" }, list: { borderTop: "2px solid var(--carbon)" }, row: { display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: "16px", padding: "16px 0", borderBottom: "1px solid var(--rule)" }, meta: { margin: "5px 0 0", color: "var(--muted)" }, links: { display: "flex", gap: "10px", alignItems: "start", fontWeight: 700 }, empty: { padding: "22px 0", color: "var(--muted)" } };

export default function AdminEntryBrowser({ entries, labels, comboBox }) {
  const [query, setQuery] = useState(""); const [status, setStatus] = useState("");
  const filtered = filterDashboardEntries(entries, { query, status, sort: "newest" });
  return <section aria-label={labels.entriesTitle}><div style={styles.controls}><label style={styles.label}>{labels.searchEntries}<input style={styles.input} type="search" value={query} placeholder={labels.searchEntries} onChange={(event) => setQuery(event.target.value)} /></label><label style={styles.label}>{labels.status}<ComboBox id="admin-entry-status" value={status} options={[{ value: "", label: labels.allStatuses }, ...["pending", "published", "returned"].map((value) => ({ value, label: labels[value] }))]} placeholder={labels.allStatuses} noResultsLabel={comboBox.noOptions} onChange={setStatus} /></label></div><div style={styles.list}>{filtered.length ? filtered.map((entry) => <article key={entry.id} style={styles.row}><div><strong>{entry.title}</strong><p style={styles.meta}>{entry.display_name || labels.unnamed} · {labels[entry.status]}</p></div><div style={styles.links}><Link href={`/archive/${entry.slug}`}>{labels.view}</Link><Link href={`/archive/${entry.slug}/edit`}>{labels.edit}</Link></div></article>) : <p style={styles.empty}>{labels.noMatches}</p>}</div></section>;
}
