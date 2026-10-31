"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client.js";
import {
  ownPhotoPath,
  profileHasChanges,
  profileValues,
  validateProfile,
  validateProfileImage,
} from "../lib/profile.js";
import ProfilePhotoUpload from "./ProfilePhotoUpload.js";

const styles = {
  form: { display: "grid", gap: "24px" },
  identity: {
    display: "grid",
    gridTemplateColumns: "240px minmax(0, 1fr)",
    gap: "48px",
    alignItems: "start",
  },
  section: {
    display: "grid",
    gap: "10px",
    paddingTop: "20px",
    borderTop: "1px solid var(--rule)",
  },
  details: { paddingTop: 0, borderTop: 0 },
  settings: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "24px",
  },
  field: { display: "grid", width: "min(100%, 560px)", gap: "6px" },
  input: {
    width: "100%",
    minHeight: "44px",
    padding: "10px",
    border: "1px solid var(--rule)",
    background: "var(--paper)",
  },
  choices: { display: "grid", gap: "8px" },
  message: { margin: 0, fontWeight: 700 },
  actions: { display: "flex", width: "100%", flexWrap: "wrap", gap: "10px", justifyContent: "flex-end" },
  button: {
    width: "fit-content",
    minHeight: "44px",
    padding: "10px 16px",
    border: 0,
    background: "var(--carbon)",
    color: "var(--paper)",
    font: "inherit",
    fontWeight: 700,
  },
  revertButton: { border: "1px solid var(--carbon)", background: "var(--paper)", color: "var(--carbon)" },
};

function extensionFor(file) {
  return { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" }[
    file.type
  ];
}

export default function ProfileForm({ metadata, email, labels }) {
  const router = useRouter();
  const [originalValues, setOriginalValues] = useState(() => profileValues(metadata));
  const [values, setValues] = useState(originalValues);
  const [photo, setPhoto] = useState(null);
  const [photoRemoved, setPhotoRemoved] = useState(false);
  const [photoVersion, setPhotoVersion] = useState(0);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  function update(name, value) {
    setValues((current) => ({ ...current, [name]: value }));
  }
  function revertChanges() {
    setValues(originalValues);
    setPhoto(null);
    setPhotoRemoved(false);
    setPhotoVersion((current) => current + 1);
    setErrors({});
    setMessage("");
  }
  const hasChanges = profileHasChanges(values, originalValues, photo, photoRemoved);
  async function save(event) {
    event.preventDefault();
    const nextErrors = { ...validateProfile(values, labels) };
    const photoError = validateProfileImage(photo, labels);
    if (photoError) nextErrors.photo = photoError;
    setErrors(nextErrors);
    setMessage("");
    if (Object.keys(nextErrors).length) return;
    setSaving(true);
    let uploadedPath = "";
    try {
      const supabase = createClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user)
        throw userError || new Error("No authenticated user");
      let avatarUrl = photoRemoved ? "" : values.avatarUrl;
      if (photo) {
        uploadedPath = `${user.id}/profile-${crypto.randomUUID()}.${extensionFor(photo)}`;
        const { error } = await supabase.storage
          .from("photos")
          .upload(uploadedPath, photo, { contentType: photo.type });
        if (error) throw error;
        avatarUrl = supabase.storage.from("photos").getPublicUrl(uploadedPath)
          .data.publicUrl;
      }
      const { error } = await supabase.auth.updateUser({
        data: {
          ...user.user_metadata,
          user_name: values.userName.trim(),
          default_entry_credit: values.defaultEntryCredit,
          preferred_language: values.preferredLanguage,
          avatar_url: avatarUrl || null,
        },
      });
      if (error) throw error;
      const oldPath = ownPhotoPath(values.avatarUrl, user.id);
      if ((photo || photoRemoved) && oldPath) {
        const { error: removeError } = await supabase.storage
          .from("photos")
          .remove([oldPath]);
        if (removeError)
          console.error("Could not remove old profile photo", removeError);
      }
      document.cookie = `language=${values.preferredLanguage}; path=/; max-age=31536000; samesite=lax`;
      document.documentElement.lang = values.preferredLanguage;
      const savedValues = { ...values, userName: values.userName.trim(), avatarUrl };
      setValues(savedValues);
      setOriginalValues(savedValues);
      setPhoto(null);
      setPhotoRemoved(false);
      setMessage(labels.saved);
      router.refresh();
    } catch (error) {
      if (uploadedPath) {
        try {
          await createClient().storage.from("photos").remove([uploadedPath]);
        } catch {}
      }
      console.error("Could not save profile", error);
      setMessage(labels.saveFailed);
    } finally {
      setSaving(false);
    }
  }
  function removePhoto() {
    setMessage("");
    setPhoto(null);
    setPhotoRemoved(true);
    setPhotoVersion((current) => current + 1);
  }
  return (
    <form className="profile-form" style={styles.form} onSubmit={save}>
      <div className="profile-identity" style={styles.identity}>
        <ProfilePhotoUpload
          key={photoVersion}
          avatarUrl={photoRemoved ? "" : values.avatarUrl}
          name={values.userName}
          labels={labels}
          error={errors.photo}
          disabled={saving}
          onChange={(file) => { setPhoto(file); setPhotoRemoved(false); }}
          onRemove={removePhoto}
        />
        <section style={{ ...styles.section, ...styles.details }}>
          <strong>{labels.details}</strong>
          <label style={styles.field}>
            {labels.userName}
            <input
              style={styles.input}
              value={values.userName}
              maxLength={120}
              required
              disabled={saving}
              onChange={(event) => update("userName", event.target.value)}
            />
          </label>
          {errors.userName ? (
            <p style={styles.message}>{errors.userName}</p>
          ) : null}
          <label style={styles.field}>
            {labels.email}
            <input style={styles.input} value={email || ""} readOnly />
          </label>
        </section>
      </div>
      <div className="profile-settings" style={styles.settings}>
        <fieldset style={styles.section}>
          <legend>{labels.entryDefaults}</legend>
          <div style={styles.choices}>
            <label>
              <input
                type="radio"
                checked={values.defaultEntryCredit === "user_name"}
                disabled={saving}
                onChange={() => update("defaultEntryCredit", "user_name")}
              />{" "}
              {labels.creditName}
            </label>
            <label>
              <input
                type="radio"
                checked={values.defaultEntryCredit === "anonymous"}
                disabled={saving}
                onChange={() => update("defaultEntryCredit", "anonymous")}
              />{" "}
              {labels.creditAnonymous}
            </label>
          </div>
        </fieldset>
        <fieldset style={styles.section}>
          <legend>{labels.language}</legend>
          <div style={styles.choices}>
            <label>
              <input
                type="radio"
                checked={values.preferredLanguage === "en"}
                disabled={saving}
                onChange={() => update("preferredLanguage", "en")}
              />{" "}
              {labels.english}
            </label>
            <label>
              <input
                type="radio"
                checked={values.preferredLanguage === "km"}
                disabled={saving}
                onChange={() => update("preferredLanguage", "km")}
              />{" "}
              {labels.khmer}
            </label>
          </div>
        </fieldset>
      </div>
      {message ? (
        <p
          style={{
            ...styles.message,
            color:
              message === labels.saved || message === labels.photoRemoved
                ? "var(--carbon)"
                : "var(--vermilion)",
          }}
          role="status"
        >
          {message}
        </p>
      ) : null}
      <div style={styles.actions}>
        {hasChanges ? <button style={{ ...styles.button, ...styles.revertButton }} type="button" disabled={saving} onClick={revertChanges}>{labels.revert}</button> : null}
        <button style={styles.button} type="submit" disabled={saving}>
          {saving ? labels.saving : labels.save}
        </button>
      </div>
    </form>
  );
}
