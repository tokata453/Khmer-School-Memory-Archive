"use client";

import { useEffect, useState } from "react";
import { Upload, X } from "lucide-react";
import AccountAvatar from "./AccountAvatar.js";

const styles = { shell: { display: "grid", width: "240px", justifyItems: "center", alignContent: "start", gap: "12px", textAlign: "center" }, preview: { position: "relative", display: "grid", width: "176px", height: "176px", placeItems: "center", overflow: "hidden", border: "1px solid var(--rule)", background: "var(--concrete)" }, remove: { position: "absolute", top: "6px", right: "6px", display: "grid", width: "32px", height: "32px", placeItems: "center", padding: 0, border: "1px solid var(--paper)", borderRadius: "50%", background: "var(--carbon)", color: "var(--paper)" }, picker: { display: "flex", width: "100%", minHeight: "44px", gap: "8px", alignItems: "center", justifyContent: "center", padding: "8px 10px", border: "1px solid var(--carbon)", background: "var(--paper)", color: "var(--carbon)", fontWeight: 700, lineHeight: 1.2, cursor: "pointer" }, input: { position: "absolute", width: "1px", height: "1px", padding: 0, margin: "-1px", overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", border: 0 }, help: { lineHeight: 1.4 }, error: { margin: 0, color: "var(--vermilion)", fontWeight: 700 } };

export default function ProfilePhotoUpload({ avatarUrl, name, labels, error, disabled, onChange, onRemove }) {
  const [preview, setPreview] = useState("");
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);
  function choose(event) {
    const file = event.target.files?.[0] || null;
    setPreview((current) => { if (current) URL.revokeObjectURL(current); return file ? URL.createObjectURL(file) : ""; });
    onChange(file);
  }
  return <section className="profile-photo-upload" style={styles.shell} aria-labelledby="profile-photo-label">
    <strong id="profile-photo-label">{labels.photo}</strong>
    <span style={styles.preview}><AccountAvatar url={preview || avatarUrl} name={name} size={176} />{avatarUrl ? <button style={styles.remove} type="button" aria-label={labels.removePhoto} disabled={disabled} onClick={onRemove}><X size={16} aria-hidden="true" /></button> : null}</span>
    <label style={styles.picker}><Upload size={16} aria-hidden="true" />{labels.choosePhoto}<input style={styles.input} type="file" accept="image/jpeg,image/png,image/webp" disabled={disabled} onChange={choose} /></label>
    <small style={styles.help}>{labels.photoHelp}</small>
    {error ? <p style={styles.error} role="alert">{error}</p> : null}
  </section>;
}