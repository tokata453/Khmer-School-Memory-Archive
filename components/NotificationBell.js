import Link from "next/link";
import { Bell } from "lucide-react";

const styles = {
  link: { position: "relative", display: "grid", width: "40px", minHeight: "40px", placeItems: "center", color: "var(--carbon)" },
  badge: { position: "absolute", top: "1px", right: "-2px", minWidth: "18px", padding: "1px 4px", borderRadius: "10px", background: "var(--vermilion)", color: "var(--paper)", fontSize: "0.68rem", fontWeight: 700, lineHeight: 1.3, textAlign: "center" },
};

export default function NotificationBell({ unreadCount, labels }) {
  const countLabel = unreadCount > 99 ? "99+" : unreadCount;
  const accessibleLabel = unreadCount ? `${labels.notifications} (${unreadCount} ${labels.unread})` : labels.notifications;

  return <Link href="/notifications" style={styles.link} aria-label={accessibleLabel} title={labels.notifications}>
    <Bell size={21} strokeWidth={2.2} aria-hidden="true" />
    {unreadCount ? <span style={styles.badge} aria-hidden="true">{countLabel}</span> : null}
  </Link>;
}
