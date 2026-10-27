import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getEntriesByOwner } from "../../lib/entries.js";
import { normalizeLanguage } from "../../lib/language.js";
import { createClient } from "../../lib/supabase/server.js";
import { getTranslation } from "../../lib/translations.js";

export const metadata = { title: "My entries" };

export default async function MyEntriesPage() {
  const [supabase, cookieStore] = await Promise.all([createClient(), cookies()]);
  const { data: { user } } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  if (!user) redirect("/login");

  const [entries, t] = await Promise.all([
    getEntriesByOwner(user.id, supabase),
    Promise.resolve(getTranslation(normalizeLanguage(cookieStore.get("language")?.value)).contributor),
  ]);

  return (
    <main className="page-shell">
      <header className="page-hero compact-hero archive-hero">
        <h1>{t.myEntriesTitle}</h1>
        <p>{t.myEntriesIntro}</p>
      </header>
      <section className="record-list" aria-label={t.myEntriesTitle}>
        {entries.length ? entries.map((entry, index) => (
          <article className="my-entry-card" key={entry.id}>
            <p className="entry-number">{String(index + 1).padStart(2, "0")}</p>
            <div>
              <p className="record-kicker">{entry.school_level?.replace("_", " ")}</p>
              <h2 className="entry-title"><Link href={`/archive/${entry.slug}`}>{entry.title}</Link></h2>
              <p className="entry-excerpt">{entry.image_description}</p>
              <p><strong>{t.status}:</strong> {t[entry.status]}</p>
            </div>
            <div className="entry-meta"><span>{entry.province}</span><span>{entry.memory_year}</span></div>
          </article>
        )) : <p>{t.noEntries}</p>}
      </section>
    </main>
  );
}