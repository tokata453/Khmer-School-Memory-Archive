"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client.js";
import {
  entryRedirectPath,
  entryHasChanges,
  entryValues,
  makeSlug,
  validateEntry,
} from "../lib/entry-form.js";
import { getTranslation } from "../lib/translations.js";
import EntryFields from "./EntryFields.js";
import PhotoUpload from "./PhotoUpload.js";
import Toast from "./Toast.js";

const styles = {
  heroContent: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto",
    gap: "var(--space-2)",
    alignItems: "end",
  },
  title: {
    margin: 0,
    fontFamily: "var(--font-primary)",
    fontSize: "var(--text-display)",
    fontWeight: 700,
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
    fontFamily: "var(--font-primary)",
    fontSize: "var(--text-label)",
    fontWeight: 700,
    letterSpacing: "0.045em",
    textTransform: "uppercase",
  },
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
  actions: { display: "flex", width: "100%", flexWrap: "wrap", gap: "10px", alignItems: "center", justifyContent: "flex-end" },
  revertButton: { color: "var(--carbon)", background: "var(--paper)" },
};

export default function EntryForm({ defaultDisplayName = "", entry = null, intro, language, title }) {
  const router = useRouter();
  const form = getTranslation(language).form;
  const originalValues = entryValues(entry, defaultDisplayName);
  const [values, setValues] = useState(originalValues);
  const [photo, setPhoto] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [photoVersion, setPhotoVersion] = useState(0);

  function updateValue(event) {
    setErrors((current) => {
      if (!current[event.target.name]) return current;
      const next = { ...current };
      delete next[event.target.name];
      return next;
    });
    setValues((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  function revertChanges() {
    setValues(originalValues);
    setPhoto(null);
    setPhotoVersion((current) => current + 1);
    setErrors({});
  }

  const hasChanges = entryHasChanges(values, originalValues, photo);

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
    if (saving) return;
    const nextErrors = validateEntry(values, photo, !entry?.photo_url, form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      const firstError = Object.keys(nextErrors)[0];
      requestAnimationFrame(() => document.getElementById(firstError === "photo" ? "photo-upload" : firstError)?.focus());
      return;
    }
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
        setToast({ type: "error", message: form.notSaved, closeLabel: form.closeToast });
        return;
      }
      if (entry) {
        router.push(entryRedirectPath(data));
        router.refresh();
      } else {
        setValues(entryValues(null, defaultDisplayName));
        setPhoto(null);
        setPhotoVersion((current) => current + 1);
        setErrors({});
        setToast({
          type: "success",
          message: getTranslation(language).contributor.submitted,
          action: { href: "/my-entries", label: form.viewMyEntries },
          closeLabel: form.closeToast,
        });
      }
    } catch (error) {
      console.error("Could not save entry", error);
      setToast({ type: "error", message: form.saveFailed, closeLabel: form.closeToast });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      className={`entry-form${title ? " entry-form-create" : ""}`}
      onSubmit={handleSubmit}
      noValidate
      aria-busy={saving}
    >
      <Toast toast={toast} onClose={() => setToast(null)} />
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
              key={photoVersion}
              entry={entry}
              error={errors.photo}
              form={form}
              onChange={(file) => {
                setErrors((current) => {
                  if (!current.photo) return current;
                  const next = { ...current };
                  delete next.photo;
                  return next;
                });
                setPhoto(file);
              }}
              disabled={saving}
            />
            <EntryFields
              language={language}
              values={values}
              errors={errors}
              form={form}
              onChange={updateValue}
              names={["image_description"]}
              disabled={saving}
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
              disabled={saving}
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
              disabled={saving}
            />
            {Object.keys(errors).length ? <p className="form-validation-summary" role="alert">{form.validationSummary}</p> : null}
            <div style={styles.actions}>
              {hasChanges ? <button style={{ ...styles.button, ...styles.revertButton }} type="button" disabled={saving} onClick={revertChanges}>{entry ? form.revert : form.clear}</button> : null}
              <button
                className="primary-button"
                style={styles.button}
                type="submit"
                disabled={saving}
              >
                {saving ? form.saving : entry ? form.saveChanges : form.save}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
