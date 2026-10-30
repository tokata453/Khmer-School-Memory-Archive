import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import EntryForm from "../../../../components/EntryForm.js";
import { getEntryBySlug } from "../../../../lib/entries.js";
import { normalizeLanguage } from "../../../../lib/language.js";
import { createClient } from "../../../../lib/supabase/server.js";
import { getTranslation } from "../../../../lib/translations.js";

export const metadata = { title: "Edit entry" };

export default async function EditEntryPage({ params }) {
  const { slug } = await params;
  const [entry, supabase, cookieStore] = await Promise.all([getEntryBySlug(slug), createClient(), cookies()]);
  if (!entry) redirect("/archive");
  const language = normalizeLanguage(cookieStore.get("language")?.value);
  const t = getTranslation(language).contributor;
  const { data } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  if (!data.user || data.user.id !== entry.owner_id) {
    return <main className="page-shell form-shell"><h1>{t.entryUnavailable}</h1><p>{t.ownerOnly}</p><Link href={`/archive/${slug}`}>{t.returnToEntry}</Link></main>;
  }
  return <main className="page-shell form-shell"><h1>{t.editTitle}</h1><EntryForm entry={entry} language={language} /></main>;
}
