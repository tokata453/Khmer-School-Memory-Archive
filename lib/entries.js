import { createClient } from "./supabase/server.js";

const entryColumns = `
  id,
  owner_id,
  photo_url,
  slug,
  title,
  image_description,
  story,
  province,
  school_level,
  memory_year,
  place_time_details,
  display_name
`;

function toEntry(row) {
  return {
    id: row.id,
    owner_id: row.owner_id,
    photo_url: row.photo_url,
    slug: row.slug,
    title: row.title,
    image_description: row.image_description,
    story: row.story,
    province: row.province,
    school_level: row.school_level,
    memory_year: row.memory_year,
    place_time_details: row.place_time_details,
    display_name: row.display_name,
  };
}

export async function getEntries() {
  const supabase = await createClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("entries")
    .select(entryColumns)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Could not load entries", error.message);
    return [];
  }

  return data.map(toEntry);
}

export async function getEntryBySlug(slug) {
  const supabase = await createClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("entries")
    .select(entryColumns)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Could not load entry", error.message);
    return null;
  }

  return data ? toEntry(data) : null;
}
