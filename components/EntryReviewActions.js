"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client.js";

const styles = {
  shell: { display: "grid", gap: "12px", marginTop: "24px", padding: "16px", border: "1px solid var(--rule)", background: "var(--paper)" },
  actions: { display: "flex", flexWrap: "wrap", gap: "12px" },
  button: { minHeight: "var(--control-height)", padding: "10px 14px", border: "1px solid var(--carbon)", background: "var(--carbon)", color: "var(--paper)", font: "inherit", fontWeight: 700 },
  secondary: { background: "transparent", color: "var(--carbon)" },
  textarea: { width: "100%", minHeight: "112px", padding: "10px", border: "1px solid var(--rule)", borderRadius: 0, background: "var(--paper)", color: "var(--carbon)", font: "inherit", resize: "vertical" },
  message: { margin: 0, color: "var(--vermilion)" },
};

export default function EntryReviewActions({ entryId, labels }) {
  const router = useRouter();
  const [feedback, setFeedback] = useState("");
  const [returning, setReturning] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function decide(decision) {
    const note = feedback.trim();
    // The interface gives fast feedback, while the database repeats this rule
    // so callers cannot return an entry without an explanation.
    if (decision === "returned" && note.length < 5) {
      setMessage(labels.feedbackRequired);
      return;
    }
    setSaving(true);
    setMessage("");
    // This RPC is the only database operation that can publish or return an
    // entry. It verifies reviewer access and that the entry is still pending.
    const { data, error } = await createClient().rpc("review_entry", {
      entry_id: entryId,
      decision,
      return_feedback: decision === "returned" ? note : null,
    });
    setSaving(false);
    if (error || !data) {
      setMessage(labels.decisionFailed);
      return;
    }
    // A successful decision removes the entry from the pending queue.
    router.push("/review");
    router.refresh();
  }

  return <section className="review-actions" style={styles.shell} aria-label={labels.actions}>
    <strong>{labels.actions}</strong>
    {returning ? <><label htmlFor="review-feedback">{labels.feedbackLabel}</label><textarea id="review-feedback" style={styles.textarea} value={feedback} maxLength="1000" onChange={(event) => setFeedback(event.target.value)} /><div style={styles.actions}><button style={styles.button} type="button" disabled={saving} onClick={() => decide("returned")}>{saving ? labels.saving : labels.return}</button><button style={{ ...styles.button, ...styles.secondary }} type="button" disabled={saving} onClick={() => setReturning(false)}>{labels.cancel}</button></div></> : <div style={styles.actions}><button style={styles.button} type="button" disabled={saving} onClick={() => decide("published")}>{saving ? labels.saving : labels.approve}</button><button style={{ ...styles.button, ...styles.secondary }} type="button" disabled={saving} onClick={() => setReturning(true)}>{labels.return}</button></div>}
    {message ? <p style={styles.message} role="alert">{message}</p> : null}
  </section>;
}
