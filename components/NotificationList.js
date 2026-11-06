"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client.js";

const styles = {
  actions: { display: "flex", justifyContent: "flex-end", margin: "24px 0 16px" },
  button: { minHeight: "40px", padding: "8px 12px", border: "1px solid var(--carbon)", background: "transparent", color: "var(--carbon)", font: "inherit", fontWeight: 700, cursor: "pointer" },
  list: { display: "grid", borderTop: "2px solid var(--carbon)" },
  item: { display: "grid", gap: "5px", padding: "18px 0", borderBottom: "1px solid var(--rule)", color: "inherit", textDecoration: "none" },
  unread: { borderLeft: "4px solid var(--vermilion)", paddingLeft: "14px" },
  meta: { color: "var(--muted)", fontSize: "0.86rem" },
  empty: { padding: "28px 0", borderTop: "2px solid var(--carbon)", color: "var(--muted)" },
};

export default function NotificationList({ notifications, labels, language }) {
  const router = useRouter();
  const unreadNotifications = notifications.filter((notification) => !notification.readAt);

  async function markRead(id) {
    await createClient().from("notifications").update({ read_at: new Date().toISOString() }).eq("id", id);
  }

  async function markAllRead() {
    if (!unreadNotifications.length) return;
    await createClient().from("notifications").update({ read_at: new Date().toISOString() }).is("read_at", null);
    router.refresh();
  }

  if (!notifications.length) return <p style={styles.empty}>{labels.empty}</p>;

  return <section aria-label={labels.title}>
    {unreadNotifications.length ? <div style={styles.actions}><button type="button" style={styles.button} onClick={markAllRead}>{labels.markAllRead}</button></div> : null}
    <div style={styles.list}>{notifications.map((notification) => <Link key={notification.id} href={`/archive/${notification.entrySlug}`} style={{ ...styles.item, ...(!notification.readAt ? styles.unread : {}) }} onClick={() => !notification.readAt && markRead(notification.id)}>
      <strong>{labels[notification.eventType]}</strong><span>{notification.entryTitle}</span><span style={styles.meta}>{new Intl.DateTimeFormat(language === "km" ? "km-KH" : "en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(notification.createdAt))}</span>
    </Link>)}</div>
  </section>;
}
