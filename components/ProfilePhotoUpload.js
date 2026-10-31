"use client";

import { useEffect, useState } from "react";
import AccountAvatar from "./AccountAvatar.js";

const styles = { shell: { display: "grid", gap: "12px" }, preview: { display: "grid", width: "128px", height: "128px", placeItems: "center", overflow: "hidden", border: "1px solid var(--rule)", background: "var(--concrete)" }, input: { maxWidth: "100%" }, error: { margin: 0, color: "var(--vermilion)", fontWeight: 700 } };

export default function ProfilePhotoUpload({ avatarUrl, name, labels, error, disabled, onChange, onRemove }) {
  const [preview, setPreview] = useState("");
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);
  function choose(event) {
    const file = event.target.files?.[0] || null;
    setPreview((current) => { if (current) URL.revokeObjectURL(current); return file ? URL.createObjectURL(file) : ""; });
    onChange(file);
  }
  return <section style={styles.shell} aria-labelledby="profile-photo-label">
    <strong id="profile-photo-label">{labels.photo}</strong>
    <span style={styles.preview}><AccountAvatar url={preview || avatarUrl} name={name} size={128} /></span>
    <label>{labels.choosePhoto}<input style={styles.input} type="file" accept="image/jpeg,image/png,image/webp" disabled={disabled} onChange={choose} /></label>
    <small>{labels.photoHelp}</small>
    {error ? <p style={styles.error} role="alert">{error}</p> : null}
    {avatarUrl ? <button type="button" disabled={disabled} onClick={onRemove}>{labels.removePhoto}</button> : null}
  </section>;
}