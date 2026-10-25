"use client";

import { useEffect, useState } from "react";

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
    <section className="photo-upload">
      <label className="photo-upload-label" htmlFor="photo">Image connected to your school memory / រូបភាពដែលទាក់ទងនឹងអនុស្សាវរីយ៍សាលារៀនរបស់អ្នក *</label>
      <input className="visually-hidden" id="photo" type="file" accept="image/jpeg,image/png,image/webp" required={!entry?.photo_url}
        aria-invalid={Boolean(error)} aria-describedby={helpId} onChange={selectPhoto} />
      <label className="photo-upload-box" htmlFor="photo">
        {imageUrl ? <img src={imageUrl} alt="Selected school memory preview / ការមើលរូបភាពដែលបានជ្រើសរើសជាមុន" /> : (
          <span className="photo-upload-empty"><strong>Choose an image / ជ្រើសរើសរូបភាព</strong><span>JPEG, PNG, or WebP · Maximum 5 MB</span></span>
        )}
        <span className="photo-upload-action">{imageUrl ? "Replace image / ប្ដូររូបភាព" : "Upload image / ផ្ទុករូបភាពឡើង"}</span>
      </label>
      <p className="field-help" id="photo-help">Use an image you own or have permission to share. Do not share private student information without permission. / ប្រើរូបភាពដែលអ្នកជាម្ចាស់ ឬមានសិទ្ធិចែករំលែក។ កុំចែករំលែកព័ត៌មានឯកជនរបស់សិស្សដោយគ្មានការអនុញ្ញាត។</p>
      {error ? <p className="field-error" id="photo-error">{error}</p> : null}
    </section>
  );
}