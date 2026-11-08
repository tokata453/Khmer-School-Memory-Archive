import { createClient } from "./supabase/server.js";

export async function getReviewHistory({ reviewerId, limit = 6, client } = {}) {
  const supabase = client || await createClient();
  if (!supabase) return [];
  let query = supabase.from("entry_review_history").select("id, reviewer_id, decision, entry_slug, entry_title, created_at").order("created_at", { ascending: false }).limit(limit);
  if (reviewerId) query = query.eq("reviewer_id", reviewerId);
  const { data, error } = await query;
  if (error) {
    console.error("Could not load review history", error.message);
    return [];
  }
  return data.map((item) => ({ ...item, entrySlug: item.entry_slug, entryTitle: item.entry_title, createdAt: item.created_at }));
}
