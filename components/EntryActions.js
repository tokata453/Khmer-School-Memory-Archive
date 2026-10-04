"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client.js";

export default function EntryActions({ id, slug }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");

  async function handleDelete() {
    if (!window.confirm("Delete this entry? This cannot be undone.")) return;
    setDeleting(true);
    setMessage("");
    try {
      const { data, error } = await createClient().from("entries").delete().eq("id", id).select("id").maybeSingle();
      if (error) throw error;
      if (!data) {
        console.error("Entry delete returned no row; RLS may have refused it.");
        setMessage("That change wasn't saved");
        return;
      }
      router.push("/archive");
      router.refresh();
    } catch (error) {
      console.error("Could not delete entry", error);
      setMessage("We could not delete this entry. Check your connection and try again.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="entry-actions">
      <Link className="secondary-button" href={`/archive/${slug}/edit`}>Edit</Link>
      <button className="danger-button" type="button" onClick={handleDelete} disabled={deleting}>{deleting ? "Deleting…" : "Delete"}</button>
      {message ? <p className="form-message" role="alert">{message}</p> : null}
    </div>
  );
}
