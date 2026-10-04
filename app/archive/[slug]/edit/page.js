import Link from "next/link";
import { notFound } from "next/navigation";
import EntryForm from "../../../../components/EntryForm.js";
import { getEntryBySlug } from "../../../../lib/entries.js";
import { createClient } from "../../../../lib/supabase/server.js";

export const metadata = { title: "Edit entry" };

export default async function EditEntryPage({ params }) {
  const { slug } = await params;
  const [entry, supabase] = await Promise.all([getEntryBySlug(slug), createClient()]);
  if (!entry) notFound();
  const { data } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  if (!data.user || data.user.id !== entry.owner_id) {
    return <main className="page-shell form-shell"><h1>Entry unavailable</h1><p>Only its owner can edit this entry.</p><Link href={`/archive/${slug}`}>Return to entry</Link></main>;
  }
  return <main className="page-shell form-shell"><p className="eyebrow">Your entry</p><h1>Edit memory</h1><EntryForm entry={entry} /></main>;
}
