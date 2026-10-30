import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import EntryForm from "../../../../components/EntryForm.js";
import { getEntryBySlug } from "../../../../lib/entries.js";
import { normalizeLanguage } from "../../../../lib/language.js";
import { createClient } from "../../../../lib/supabase/server.js";
import { getTranslation } from "../../../../lib/translations.js";

const styles = {
  shell: { paddingBottom: "80px" },
  header: { padding: "54px 0 36px" },
  title: { margin: 0, fontFamily: "var(--font-display)", fontSize: "var(--text-display)", fontWeight: 800, lineHeight: .82, letterSpacing: ".015em" },
};

export const metadata = { title: "Edit entry" };

export default async function EditEntryPage({ params }) {
  const { slug } = await params;
  const [entry, supabase, cookieStore] = await Promise.all([getEntryBySlug(slug), createClient(), cookies()]);
  if (!entry) redirect("/archive");
  const language = normalizeLanguage(cookieStore.get("language")?.value);
  const t = getTranslation(language).contributor;
  const { data } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  if (!data.user || data.user.id !== entry.owner_id) {
    return <main className="page-shell form-shell" style={styles.shell}><header className="page-hero compact-hero archive-hero form-hero" style={styles.header}><h1 style={styles.title}>{t.entryUnavailable}</h1></header><p>{t.ownerOnly}</p><Link href={`/archive/${slug}`}>{t.returnToEntry}</Link></main>;
  }
  return <main className="page-shell form-shell" style={styles.shell}><header className="page-hero compact-hero archive-hero form-hero" style={styles.header}><h1 style={styles.title}>{t.editTitle}</h1></header><EntryForm entry={entry} language={language} /></main>;
}
