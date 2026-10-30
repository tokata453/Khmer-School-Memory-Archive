"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client.js";
import { getTranslation } from "../lib/translations.js";

const styles = {
  actions: { display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center", marginTop: "24px" }, button: { width: "fit-content", minHeight: "var(--control-height)", padding: "11px 18px", border: "var(--border-thin) solid var(--carbon)", borderRadius: 0, font: "inherit", fontWeight: 700, cursor: "pointer", textDecoration: "none" }, secondary: { color: "var(--carbon)", background: "transparent" }, danger: { color: "var(--paper)", background: "var(--vermilion)", borderColor: "var(--vermilion)" }, message: { flexBasis: "100%", margin: 0, fontSize: "0.9rem", color: "var(--vermilion)" },
};

export default function EntryActions({ id, slug, language }) {
  const router = useRouter();
  const form = getTranslation(language).form;
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");

  async function handleDelete() {
    if (!window.confirm(form.deleteConfirm)) return;
    setDeleting(true);
    setMessage("");
    try {
      const { data, error } = await createClient().from("entries").delete().eq("id", id).select("id").maybeSingle();
      if (error) throw error;
      if (!data) {
        console.error("Entry delete returned no row; RLS may have refused it.");
        setMessage(form.notSaved);
        return;
      }
      router.push("/archive");
      router.refresh();
    } catch (error) {
      console.error("Could not delete entry", error);
      setMessage(form.deleteFailed);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="entry-actions" style={styles.actions}>
      <Link className="secondary-button" style={{ ...styles.button, ...styles.secondary }} href={`/archive/${slug}/edit`}>{form.edit}</Link>
      <button className="danger-button" style={{ ...styles.button, ...styles.danger }} type="button" onClick={handleDelete} disabled={deleting}>{deleting ? form.deleting : form.delete}</button>
      {message ? <p className="form-message" style={styles.message} role="alert">{message}</p> : null}
    </div>
  );
}
