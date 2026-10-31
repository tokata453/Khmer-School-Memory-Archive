"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Toast({ toast, onClose }) {
  const [paused, setPaused] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    if (!toast || paused) return;
    timer.current = window.setTimeout(onClose, 6000);
    return () => window.clearTimeout(timer.current);
  }, [toast, paused, onClose]);

  if (!toast) return null;
  return (
    <section
      className={`toast toast-${toast.type}`}
      role={toast.type === "error" ? "alert" : "status"}
      aria-live={toast.type === "error" ? "assertive" : "polite"}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}
    >
      <p>{toast.message}</p>
      {toast.action ? <Link className="toast-action" href={toast.action.href}>{toast.action.label}</Link> : null}
      <button className="toast-close" type="button" onClick={onClose} aria-label={toast.closeLabel}>×</button>
    </section>
  );
}