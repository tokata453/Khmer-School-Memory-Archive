"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client.js";
import { entryFields, makeSlug, validateEntry } from "../lib/entry-form.js";
import EntryFields from "./EntryFields.js";

export default function EntryForm({ entry = null }) {
  const router = useRouter();
  const [values, setValues] = useState(() => Object.fromEntries(entryFields.map(([name]) => [name, entry?.[name] || ""])));
  const [photo, setPhoto] = useState(null);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  function updateValue(event) {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function uploadPhoto(supabase, userId) {
    if (!photo) return entry?.photo_url || null;
    const extension = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" }[photo.type];
    const path = `${userId}/${crypto.randomUUID()}.${extension}`;
    const { error } = await supabase.storage.from("photos").upload(path, photo, { contentType: photo.type });
    if (error) throw error;
    return supabase.storage.from("photos").getPublicUrl(path).data.publicUrl;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateEntry(values, photo, !entry);
    setErrors(nextErrors);
    setMessage("");
    if (Object.keys(nextErrors).length) return;
    setSaving(true);
    try {
      const supabase = createClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw authError || new Error("No authenticated user");
      const entryData = {
        title: values.title.trim(),
        category: values.category.trim(),
        contributor: values.contributor.trim(),
        place: values.place.trim(),
        period: values.period.trim(),
        featured_object: values.featured_object.trim(),
        excerpt: values.excerpt.trim(),
        memory: values.memory.trim(),
        learning_method: values.learning_method.trim(),
        reflection: values.reflection.trim(),
      };
      const photoUrl = await uploadPhoto(supabase, user.id);
      const query = entry
        ? supabase.from("entries").update({ ...entryData, photo_url: photoUrl }).eq("id", entry.id).select("slug")
        : supabase.from("entries").insert({
            owner_id: user.id,
            slug: makeSlug(entryData.title),
            ...entryData,
            photo_url: photoUrl,
          }).select("slug");
      const { data, error } = await query.maybeSingle();
      if (error) throw error;
      if (!data) {
        console.error("Entry change returned no row; RLS may have refused it.");
        setMessage("That change wasn't saved");
        return;
      }
      router.push(`/archive/${data.slug}`);
      router.refresh();
    } catch (error) {
      console.error("Could not save entry", error);
      setMessage("We could not save this entry. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="entry-form" onSubmit={handleSubmit} noValidate>
      <EntryFields values={values} errors={errors} onChange={updateValue} />
      <div className="form-field">
        <label htmlFor="photo">Photo {entry ? "(optional)" : ""}</label>
        <input id="photo" type="file" accept="image/jpeg,image/png,image/webp" required={!entry}
          aria-invalid={Boolean(errors.photo)} aria-describedby={errors.photo ? "photo-error" : "photo-help"}
          onChange={(event) => setPhoto(event.target.files?.[0] || null)} />
        <p className="field-help" id="photo-help">JPEG, PNG, or WebP. Maximum 5 MB.</p>
        {errors.photo ? <p className="field-error" id="photo-error">{errors.photo}</p> : null}
      </div>
      {message ? <p className="form-message" role="alert">{message}</p> : null}
      <button className="primary-button" type="submit" disabled={saving}>{saving ? "Saving…" : entry ? "Save changes" : "Add entry"}</button>
    </form>
  );
}
