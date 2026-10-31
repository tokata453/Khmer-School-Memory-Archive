"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client.js";
import {
  entryRedirectPath,
  entryValues,
  makeSlug,
  validateEntry,
} from "../lib/entry-form.js";
import { getTranslation } from "../lib/translations.js";
import EntryFields from "./EntryFields.js";
import PhotoUpload from "./PhotoUpload.js";

const styles = {
  heroContent: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto",
    gap: "var(--space-2)",
    alignItems: "end",
  },
  title: {
    margin: 0,
    fontFamily: "var(--font-display)",
    fontSize: "var(--text-display)",
    fontWeight: 800,
    lineHeight: 0.82,
    letterSpacing: ".015em",
  },
  intro: {
    maxWidth: "1000px",
    margin: "14px 0 0",
    color: "var(--muted)",
    fontSize: "var(--text-lead)",
    lineHeight: 1.75,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "minmax(320px, 7fr) minmax(0, 13fr)",
    gap: "var(--space-8)",
    borderTop: "var(--border-thin) solid var(--rule)",
    paddingTop: "28px",
  },
  column: { display: "grid", alignContent: "start", gap: "var(--space-5)" },
  leftColumn: {
    gap: "var(--space-4)",
    padding: "var(--space-5)",
    border: "1px solid var(--rule)",
    background: "var(--paper)",
  },
  label: {
    margin: 0,
    fontFamily: "var(--font-interface)",
    fontSize: "var(--text-label)",
    fontWeight: 700,
    letterSpacing: "0.045em",
    textTransform: "uppercase",
  },
  message: { margin: 0, fontSize: "0.9rem", color: "var(--vermilion)" },
  button: {
    width: "fit-content",
    minHeight: "var(--control-height)",
    padding: "11px 18px",
    border: "var(--border-thin) solid var(--carbon)",
    borderRadius: 0,
    color: "var(--paper)",
    background: "var(--carbon)",
    font: "inherit",
    fontWeight: 700,
    cursor: "pointer",
    textDecoration: "none",
  },
};

export default function EntryForm({ entry = null, intro, language, title }) {
  const router = useRouter();
  const form = getTranslation(language).form;
  const [values, setValues] = useState(() => entryValues(entry));
  const [photo, setPhoto] = useState(null);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  function updateValue(event) {
    setValues((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  async function uploadPhoto(supabase, userId) {
    if (!photo) return entry?.photo_url || null;
    const extension = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
    }[photo.type];
    const path = `${userId}/${crypto.randomUUID()}.${extension}`;
    const { error } = await supabase.storage
      .from("photos")
      .upload(path, photo, { contentType: photo.type });
    if (error) throw error;
    return supabase.storage.from("photos").getPublicUrl(path).data.publicUrl;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateEntry(values, photo, !entry?.photo_url, form);
    setErrors(nextErrors);
    setMessage("");
    if (Object.keys(nextErrors).length) return;
    setSaving(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user)
        throw authError || new Error("No authenticated user");
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
      const { data: reviewer, error: reviewerError } = entry
        ? await supabase.rpc("is_reviewer")
        : { data: false };
      if (reviewerError) throw reviewerError;
      const query = entry
        ? supabase
            .from("entries")
            .update({
              ...entryData,
              photo_url: photoUrl,
              ...(reviewer ? {} : { status: "pending" }),
            })
            .eq("id", entry.id)
            .select("slug, status")
        : supabase
            .from("entries")
            .insert({
              owner_id: user.id,
              slug: makeSlug(entryData.title),
              ...entryData,
              photo_url: photoUrl,
            })
            .select("slug, status");
      const { data, error } = await query.maybeSingle();
      if (error) throw error;
      if (!data) {
        console.error("Entry change returned no row; RLS may have refused it.");
        setMessage(form.notSaved);
        return;
      }
      router.push(entryRedirectPath(data));
      router.refresh();
    } catch (error) {
      console.error("Could not save entry", error);
      setMessage(form.saveFailed);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      className={`entry-form${title ? " entry-form-create" : ""}`}
      onSubmit={handleSubmit}
      noValidate
    >
      {title ? (
        <header className="page-hero compact-hero archive-hero form-hero form-action-hero">
          <div className="form-action-hero-content" style={styles.heroContent}>
            <h1 className="form-action-title" style={styles.title}>
              {title}
            </h1>
            {intro ? (
              <p className="form-action-intro" style={styles.intro}>
                {intro}
              </p>
            ) : null}
            <button
              className="primary-button"
              style={styles.button}
              type="submit"
              disabled={saving}
            >
              {saving ? form.saving : entry ? form.saveChanges : form.addEntry}
            </button>
          </div>
        </header>
      ) : null}
      <div className="entry-form-body">
        <div className="contribute-grid" style={styles.grid}>
          <aside
            className="contribute-column contribute-left-column"
            style={{ ...styles.column, ...styles.leftColumn }}
          >
            <PhotoUpload
              entry={entry}
              error={errors.photo}
              form={form}
              onChange={setPhoto}
            />
            <EntryFields
              language={language}
              values={values}
              errors={errors}
              form={form}
              onChange={updateValue}
              names={["image_description"]}
            />
            <p className="form-section-label" style={styles.label}>
              {form.archiveDetails}
            </p>
            <EntryFields
              className="archive-details"
              language={language}
              values={values}
              errors={errors}
              form={form}
              onChange={updateValue}
              names={[
                "province",
                "school_level",
                "memory_year",
                "place_time_details",
                "display_name",
              ]}
            />
          </aside>
          <div
            className="contribute-column contribute-story"
            style={styles.column}
          >
            <EntryFields
              language={language}
              values={values}
              errors={errors}
              form={form}
              onChange={updateValue}
              names={["title", "story"]}
            />
            {message ? (
              <p className="form-message" style={styles.message} role="alert">
                {message}
              </p>
            ) : null}
            {title ? null : (
              <button
                className="primary-button"
                style={styles.button}
                type="submit"
                disabled={saving}
              >
                {saving
                  ? form.saving
                  : entry
                    ? form.saveChanges
                    : form.addEntry}
              </button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
