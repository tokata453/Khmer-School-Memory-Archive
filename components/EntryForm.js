"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client.js";
import { entryRedirectPath, entryValues, makeSlug, validateEntry } from "../lib/entry-form.js";
import EntryFields from "./EntryFields.js";

export default function EntryForm({ entry = null }) {
  const router = useRouter();
  const [values, setValues] = useState(() => entryValues(entry));
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
    const nextErrors = validateEntry(values, photo, !entry?.photo_url);
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
        image_description: values.image_description.trim(),
        story: values.story.trim(),
        province: values.province,
        school_level: values.school_level,
        memory_year: Number(values.memory_year),
        place_time_details: values.place_time_details.trim() || null,
        display_name: values.display_name.trim() || null,
      };
      const photoUrl = await uploadPhoto(supabase, user.id);
      const { data: reviewer, error: reviewerError } = entry ? await supabase.rpc("is_reviewer") : { data: false };
      if (reviewerError) throw reviewerError;
      const query = entry
        ? supabase.from("entries").update({ ...entryData, photo_url: photoUrl, ...(reviewer ? {} : { status: "pending" }) }).eq("id", entry.id).select("slug, status")
        : supabase.from("entries").insert({
            owner_id: user.id,
            slug: makeSlug(entryData.title),
            ...entryData,
            photo_url: photoUrl,
          }).select("slug, status");
      const { data, error } = await query.maybeSingle();
      if (error) throw error;
      if (!data) {
        console.error("Entry change returned no row; RLS may have refused it.");
        setMessage("That change wasn't saved. / ការកែប្រែមិនត្រូវបានរក្សាទុកទេ។");
        return;
      }
      router.push(entryRedirectPath(data));
      router.refresh();
    } catch (error) {
      console.error("Could not save entry", error);
      setMessage("We could not save this entry. Check your connection and try again. / មិនអាចរក្សាទុកបានទេ។ សូមពិនិត្យការតភ្ជាប់ ហើយព្យាយាមម្តងទៀត។");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="entry-form" onSubmit={handleSubmit} noValidate>
      <EntryFields values={values} errors={errors} onChange={updateValue} />
      <div className="form-field">
        <label htmlFor="photo">Image connected to your school memory / រូបភាពដែលទាក់ទងនឹងអនុស្សាវរីយ៍សាលារៀនរបស់អ្នក * {entry?.photo_url ? "(replace optional / ប្តូររូបភាពស្រេចចិត្ត)" : ""}</label>
        <input id="photo" type="file" accept="image/jpeg,image/png,image/webp" required={!entry?.photo_url}
          aria-invalid={Boolean(errors.photo)} aria-describedby={errors.photo ? "photo-error" : "photo-help"}
          onChange={(event) => setPhoto(event.target.files?.[0] || null)} />
        <p className="field-help" id="photo-help">Use an image you own or have permission to share. Do not share private student information without permission. JPEG, PNG, or WebP. Maximum 5 MB. / ប្រើរូបភាពដែលអ្នកជាម្ចាស់ ឬមានសិទ្ធិចែករំលែក។ កុំចែករំលែកព័ត៌មានឯកជនរបស់សិស្សដោយគ្មានការអនុញ្ញាត។ អតិបរមា 5 MB។</p>
        {errors.photo ? <p className="field-error" id="photo-error">{errors.photo}</p> : null}
      </div>
      {message ? <p className="form-message" role="alert">{message}</p> : null}
      <button className="primary-button" type="submit" disabled={saving}>{saving ? "Saving… / កំពុងរក្សាទុក…" : entry ? "Save changes / រក្សាទុកការកែប្រែ" : "Add entry / បន្ថែមឯកសារ"}</button>
    </form>
  );
}
