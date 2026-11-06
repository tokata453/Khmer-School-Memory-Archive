"use client";

import { useState } from "react";
import { createClient } from "../lib/supabase/client.js";

const styles = { row: { display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: "16px", padding: "16px 0", borderTop: "1px solid var(--rule)" }, name: { margin: 0, fontWeight: 700 }, email: { margin: "4px 0 0", color: "var(--muted)", overflowWrap: "anywhere" }, controls: { display: "flex", flexWrap: "wrap", justifyContent: "flex-end", gap: "8px", alignContent: "start" }, button: { minHeight: "36px", padding: "7px 10px", border: "1px solid var(--carbon)", background: "var(--paper)", color: "var(--carbon)", font: "inherit", fontWeight: 700 }, active: { background: "var(--carbon)", color: "var(--paper)" } };

export default function AdminRoleControls({ profile, labels }) {
  const [roles, setRoles] = useState(profile.roles);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function toggle(role) {
    setSaving(true);
    setMessage("");
    const hasRole = roles.includes(role);
    const query = createClient().from("user_roles");
    const { error } = hasRole
      ? await query.delete().eq("user_id", profile.id).eq("role", role)
      : await query.insert({ user_id: profile.id, role });
    if (error) {
      setMessage(labels.saveFailed);
    } else {
      setRoles((current) => hasRole ? current.filter((item) => item !== role) : [...current, role]);
    }
    setSaving(false);
  }

  return <article style={styles.row}>
    <div><p style={styles.name}>{profile.user_name || labels.unnamed}</p><p style={styles.email}>{profile.email}</p>{message ? <p role="alert">{message}</p> : null}</div>
    <div style={styles.controls}>{["reviewer", "admin"].map((role) => <button key={role} type="button" style={{ ...styles.button, ...(roles.includes(role) ? styles.active : {}) }} disabled={saving} onClick={() => toggle(role)}>{roles.includes(role) ? labels.removeRole.replace("{role}", labels[role]) : labels.addRole.replace("{role}", labels[role])}</button>)}</div>
  </article>;
}
