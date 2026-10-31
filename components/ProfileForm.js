"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client.js";
import { ownPhotoPath, profileValues, validateProfile, validateProfileImage } from "../lib/profile.js";
import ProfilePhotoUpload from "./ProfilePhotoUpload.js";

const styles = { form: { display: "grid", gap: "20px" }, section: { display: "grid", gap: "10px", paddingTop: "20px", borderTop: "1px solid var(--rule)" }, input: { width: "100%", minHeight: "44px", padding: "10px", border: "1px solid var(--rule)", background: "var(--paper)" }, choices: { display: "grid", gap: "8px" }, message: { margin: 0, fontWeight: 700 }, button: { width: "fit-content", minHeight: "44px", padding: "10px 16px", border: 0, background: "var(--carbon)", color: "var(--paper)", font: "inherit", fontWeight: 700 } };

function extensionFor(file) {
  return { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" }[file.type];
}

export default function ProfileForm({ metadata, email, labels }) {
  const router = useRouter();
  const [values, setValues] = useState(() => profileValues(metadata));
  const [photo, setPhoto] = useState(null);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  function update(name, value) { setValues((current) => ({ ...current, [name]: value })); }
  async function save(event) {
    event.preventDefault();
    const nextErrors = { ...validateProfile(values, labels) };
    const photoError = validateProfileImage(photo, labels);
    if (photoError) nextErrors.photo = photoError;
    setErrors(nextErrors); setMessage("");
    if (Object.keys(nextErrors).length) return;
    setSaving(true);
    let uploadedPath = "";
    try {
      const supabase = createClient();
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw userError || new Error("No authenticated user");
      let avatarUrl = values.avatarUrl;
      if (photo) {
        uploadedPath = `${user.id}/profile-${crypto.randomUUID()}.${extensionFor(photo)}`;
        const { error } = await supabase.storage.from("photos").upload(uploadedPath, photo, { contentType: photo.type });
        if (error) throw error;
        avatarUrl = supabase.storage.from("photos").getPublicUrl(uploadedPath).data.publicUrl;
      }
      const { error } = await supabase.auth.updateUser({ data: { ...user.user_metadata, user_name: values.userName.trim(), default_entry_credit: values.defaultEntryCredit, preferred_language: values.preferredLanguage, avatar_url: avatarUrl || null } });
      if (error) throw error;
      const oldPath = ownPhotoPath(values.avatarUrl, user.id);
      if (photo && oldPath) {
        const { error: removeError } = await supabase.storage.from("photos").remove([oldPath]);
        if (removeError) console.error("Could not remove old profile photo", removeError);
      }
      document.cookie = `language=${values.preferredLanguage}; path=/; max-age=31536000; samesite=lax`;
      document.documentElement.lang = values.preferredLanguage;
      setValues((current) => ({ ...current, avatarUrl })); setPhoto(null); setMessage(labels.saved); router.refresh();
    } catch (error) {
      if (uploadedPath) { try { await createClient().storage.from("photos").remove([uploadedPath]); } catch {} }
      console.error("Could not save profile", error); setMessage(labels.saveFailed);
    } finally { setSaving(false); }
  }
  async function removePhoto() {
    setSaving(true); setMessage("");
    try {
      const supabase = createClient(); const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");
      const path = ownPhotoPath(values.avatarUrl, user.id);
      const { error } = await supabase.auth.updateUser({ data: { ...user.user_metadata, avatar_url: null } });
      if (error) throw error;
      if (path) {
        const { error: removeError } = await supabase.storage.from("photos").remove([path]);
        if (removeError) console.error("Could not remove old profile photo", removeError);
      }
      setValues((current) => ({ ...current, avatarUrl: "" })); setMessage(labels.photoRemoved); router.refresh();
    } catch (error) { console.error("Could not remove profile photo", error); setMessage(labels.saveFailed); } finally { setSaving(false); }
  }
  return <form style={styles.form} onSubmit={save}>
    <ProfilePhotoUpload avatarUrl={values.avatarUrl} name={values.userName} labels={labels} error={errors.photo} disabled={saving} onChange={setPhoto} onRemove={removePhoto} />
    <section style={styles.section}><strong>{labels.details}</strong><label>{labels.userName}<input style={styles.input} value={values.userName} maxLength={120} required disabled={saving} onChange={(event) => update("userName", event.target.value)} /></label>{errors.userName ? <p style={styles.message}>{errors.userName}</p> : null}<label>{labels.email}<input style={styles.input} value={email || ""} readOnly /></label></section>
    <fieldset style={styles.section}><legend>{labels.entryDefaults}</legend><div style={styles.choices}><label><input type="radio" checked={values.defaultEntryCredit === "user_name"} disabled={saving} onChange={() => update("defaultEntryCredit", "user_name")} /> {labels.creditName}</label><label><input type="radio" checked={values.defaultEntryCredit === "anonymous"} disabled={saving} onChange={() => update("defaultEntryCredit", "anonymous")} /> {labels.creditAnonymous}</label></div></fieldset>
    <fieldset style={styles.section}><legend>{labels.language}</legend><div style={styles.choices}><label><input type="radio" checked={values.preferredLanguage === "en"} disabled={saving} onChange={() => update("preferredLanguage", "en")} /> {labels.english}</label><label><input type="radio" checked={values.preferredLanguage === "km"} disabled={saving} onChange={() => update("preferredLanguage", "km")} /> {labels.khmer}</label></div></fieldset>
    {message ? <p style={{ ...styles.message, color: message === labels.saved || message === labels.photoRemoved ? "var(--carbon)" : "var(--vermilion)" }} role="status">{message}</p> : null}
    <button style={styles.button} type="submit" disabled={saving}>{saving ? labels.saving : labels.save}</button>
  </form>;
}