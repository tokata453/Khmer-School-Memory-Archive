"use client";

import { useEffect, useState } from "react";

const styles = {
  upload: { display: "grid", gap: "10px" }, label: { margin: 0, fontFamily: "var(--font-interface)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.045em", textTransform: "uppercase" }, hidden: { position: "absolute", width: "1px", height: "1px", padding: 0, margin: "-1px", overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", border: 0 }, box: { position: "relative", display: "grid", minHeight: "min(58vw, 590px)", placeItems: "center", overflow: "hidden", border: "1px solid var(--carbon)", background: "var(--paper)", cursor: "pointer" }, image: { width: "100%", height: "100%", minHeight: "inherit", objectFit: "cover" }, empty: { display: "grid", gap: "8px", padding: "28px", color: "var(--muted)", textAlign: "center" }, emptyTitle: { color: "var(--carbon)", fontSize: "var(--text-section)" }, action: { position: "absolute", right: "14px", bottom: "14px", padding: "9px 12px", color: "var(--paper)", background: "var(--carbon)", fontFamily: "var(--font-interface)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.035em", textTransform: "uppercase" }, help: { margin: 0, fontSize: "0.9rem", color: "var(--muted)" }, error: { margin: 0, fontSize: "0.9rem", color: "var(--vermilion)" },
};

export default function PhotoUpload({ entry, error, onChange }) {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  function selectPhoto(event) {
    const file = event.target.files?.[0] || null;
    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return file ? URL.createObjectURL(file) : null;
    });
    onChange(file);
  }

  const imageUrl = previewUrl || entry?.photo_url;
  const helpId = error ? "photo-error" : "photo-help";

  return (
    <section className="photo-upload" style={styles.upload}>
      <label className="photo-upload-label" style={styles.label} htmlFor="photo">Image connected to your school memory / រូបភាពដែលទាក់ទងនឹងអនុស្សាវរីយ៍សាលារៀនរបស់អ្នក *</label>
      <input className="visually-hidden" style={styles.hidden} id="photo" type="file" accept="image/jpeg,image/png,image/webp" required={!entry?.photo_url}
        aria-invalid={Boolean(error)} aria-describedby={helpId} onChange={selectPhoto} />
      <label className="photo-upload-box" style={styles.box} htmlFor="photo">
        {imageUrl ? <img style={styles.image} src={imageUrl} alt="Selected school memory preview / ការមើលរូបភាពដែលបានជ្រើសរើសជាមុន" /> : (
          <span className="photo-upload-empty" style={styles.empty}><strong style={styles.emptyTitle}>Choose an image / ជ្រើសរើសរូបភាព</strong><span>JPEG, PNG, or WebP · Maximum 5 MB</span></span>
        )}
        <span className="photo-upload-action" style={styles.action}>{imageUrl ? "Replace image / ប្ដូររូបភាព" : "Upload image / ផ្ទុករូបភាពឡើង"}</span>
      </label>
      <p className="field-help" style={styles.help} id="photo-help">Use an image you own or have permission to share. Do not share private student information without permission. / ប្រើរូបភាពដែលអ្នកជាម្ចាស់ ឬមានសិទ្ធិចែករំលែក។ កុំចែករំលែកព័ត៌មានឯកជនរបស់សិស្សដោយគ្មានការអនុញ្ញាត។</p>
      {error ? <p className="field-error" style={styles.error} id="photo-error">{error}</p> : null}
    </section>
  );
}