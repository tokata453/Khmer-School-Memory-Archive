import { createClient } from "./supabase/server.js";

const entryColumns = `
  slug,
  title,
  category,
  contributor,
  place,
  period,
  featured_object,
  excerpt,
  memory,
  learning_method,
  reflection
`;

function toEntry(row) {
  return {
    slug: row.slug,
    title: row.title,
    category: row.category,
    contributor: row.contributor,
    place: row.place,
    period: row.period,
    featuredObject: row.featured_object,
    excerpt: row.excerpt,
    memory: row.memory,
    learningMethod: row.learning_method,
    reflection: row.reflection,
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
