import { createClient } from "./supabase/server.js";

const notificationColumns = "id, entry_id, event_type, entry_slug, entry_title, created_at, read_at";

function toNotification(row) {
  return {
    id: row.id,
    entryId: row.entry_id,
    eventType: row.event_type,
    entrySlug: row.entry_slug,
    entryTitle: row.entry_title,
    createdAt: row.created_at,
    readAt: row.read_at,
  };
}

export async function getNotifications(userId, client) {
  const supabase = client || await createClient();
  if (!supabase || !userId) return [];

  const { data, error } = await supabase
    .from("notifications")
    .select(notificationColumns)
    .eq("recipient_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) {
    console.error("Could not load notifications", error.message);
    return [];
  }
  return data.map(toNotification);
}

export async function getUnreadNotificationCount(userId, client) {
  const supabase = client || await createClient();
  if (!supabase || !userId) return 0;

  const { count, error } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("recipient_id", userId)
    .is("read_at", null);
  if (error) {
    console.error("Could not count unread notifications", error.message);
    return 0;
  }
  return count || 0;
}
