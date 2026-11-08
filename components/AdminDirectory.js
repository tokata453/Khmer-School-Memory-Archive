"use client";

import { useState } from "react";
import AdminRoleControls from "./AdminRoleControls.js";

const styles = { controls: { margin: "16px 0" }, input: { width: "100%", minHeight: "46px", padding: "10px", border: "1px solid var(--rule)", background: "var(--paper)", color: "var(--carbon)" }, section: { borderTop: "2px solid var(--carbon)" }, empty: { padding: "22px 0", color: "var(--muted)" } };

export default function AdminDirectory({ profiles, labels }) {
  const [query, setQuery] = useState("");
  const text = query.trim().toLowerCase();
  const filtered = profiles.filter((profile) => !text || [profile.user_name, profile.email, ...profile.roles].join(" ").toLowerCase().includes(text));
  return <section aria-label={labels.directoryTitle}><label className="visually-hidden" htmlFor="admin-directory-search">{labels.searchAccounts}</label><div style={styles.controls}><input id="admin-directory-search" style={styles.input} type="search" value={query} placeholder={labels.searchAccounts} onChange={(event) => setQuery(event.target.value)} /></div><div style={styles.section}>{filtered.length ? filtered.map((profile) => <AdminRoleControls key={profile.id} profile={profile} labels={labels} />) : <p style={styles.empty}>{labels.noMatches}</p>}</div></section>;
}
