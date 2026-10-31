"use client";

import { useEffect, useState } from "react";
import { Upload } from "lucide-react";

const styles = {
  upload: { display: "grid", width: "100%", minWidth: 0, gap: "10px" },
  label: {
    margin: 0,
    fontFamily: "var(--font-interface)",
    fontSize: "var(--text-label)",
    fontWeight: 700,
    letterSpacing: "0.045em",
    textTransform: "uppercase",
  },
  required: { color: "var(--vermilion)" },
  hidden: {
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: 0,
    margin: "-1px",
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    border: 0,
  },
  box: {
    position: "relative",
    display: "grid",
    width: "100%",
    minWidth: 0,
    aspectRatio: "16 / 9",
    placeItems: "center",
    overflow: "hidden",
    border: "1px dashed var(--gold)",
    background: "var(--paper)",
    cursor: "pointer",
  },
  image: {
    position: "absolute",
    inset: 0,
    display: "block",
    width: "100%",
    height: "100%",
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
    objectPosition: "center",
    filter: "saturate(.78) sepia(.12)",
  },
  empty: {
    display: "grid",
    gap: "6px",
    padding: "18px",
    color: "var(--muted)",
    textAlign: "center",
    justifyItems: "center",
    alignContent: "center",
  },
  emptyTitle: {
    color: "var(--carbon)",
    fontFamily: "var(--font-interface)",
    fontSize: "1rem",
  },
  emptyHelp: {
    width: "28ch",
    maxWidth: "100%",
    margin: 0,
    fontSize: "0.75rem",
    lineHeight: 1.4,
  },
  activeBox: { borderColor: "var(--carbon)", background: "var(--concrete)" },
  error: { margin: 0, fontSize: "0.9rem", color: "var(--vermilion)" },
};

export default function PhotoUpload({ entry, error, form, onChange, disabled }) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [dragging, setDragging] = useState(false);

  useEffect(
    () => () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    },
    [previewUrl],
  );

  function setPhoto(file) {
    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return file?.type.startsWith("image/") ? URL.createObjectURL(file) : null;
    });
    onChange(file);
  }

  function selectPhoto(event) {
    if (disabled) return;
    setPhoto(event.target.files?.[0] || null);
  }

  function handleDrop(event) {
    event.preventDefault();
    setDragging(false);
    if (disabled) return;
    setPhoto(event.dataTransfer.files?.[0] || null);
  }

  const imageUrl = previewUrl || entry?.photo_url;
  const helpId = error ? "photo-error" : "photo-help";

  return (
    <section className={`photo-upload${error ? " has-error" : ""}${disabled ? " is-disabled" : ""}`} style={styles.upload} id="photo-upload" tabIndex={error ? -1 : undefined}>
      <label
        className="photo-upload-label"
        style={styles.label}
        htmlFor="photo"
      >
        {form.imageLabel} <span style={styles.required}>*</span>
      </label>
      <input
        className="visually-hidden"
        style={styles.hidden}
        id="photo"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        required={!entry?.photo_url}
        aria-invalid={Boolean(error)}
        aria-describedby={helpId}
        disabled={disabled}
        onChange={selectPhoto}
      />
      <label className="photo-upload-box" style={{ ...styles.box, ...(dragging ? styles.activeBox : {}) }} htmlFor="photo"
        onDragEnter={(event) => { event.preventDefault(); if (!disabled) setDragging(true); }} onDragOver={(event) => event.preventDefault()} onDragLeave={() => setDragging(false)} onDrop={handleDrop}>
        {imageUrl ? (
          <>
            <span className="photo-upload-background" style={{ "--photo-image": `url("${imageUrl}")` }} aria-hidden="true" />
            <img className="photo-upload-image" style={styles.image} src={imageUrl} alt={form.imageAlt} />
          </>
        ) : (
          <span className="photo-upload-empty" style={styles.empty}>
            <Upload aria-hidden="true" size={22} strokeWidth={1.5} />
            <strong style={styles.emptyTitle}>{form.uploadPrompt}</strong>
            <span style={styles.emptyHelp}>{form.imageHelp}</span>
          </span>
        )}
      </label>
      <p className="sr-only" id="photo-help">
        {form.imageHelp}
      </p>
      {error ? (
        <p className="field-error" style={styles.error} id="photo-error">
          {error}
        </p>
      ) : null}
    </section>
  );
}
