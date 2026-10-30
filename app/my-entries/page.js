import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getEntriesByOwner } from "../../lib/entries.js";
import { normalizeLanguage } from "../../lib/language.js";
import { createClient } from "../../lib/supabase/server.js";
import { getTranslation } from "../../lib/translations.js";

const styles = {
  hero: { display: "block", padding: "54px 0 36px", borderBottom: "1px solid var(--rule)" }, heroTitle: { maxWidth: "none", margin: 0, fontFamily: "var(--font-display)", fontSize: "var(--text-display)", fontWeight: 800, lineHeight: .82, letterSpacing: ".015em" }, intro: { maxWidth: "720px", margin: "24px 0 0", color: "var(--muted)", fontSize: "var(--text-lead)", lineHeight: 1.75 }, list: { borderTop: "2px solid var(--carbon)" }, card: { display: "grid", gridTemplateColumns: "90px minmax(0, 1fr) 210px", gap: "24px", padding: "22px 0", borderBottom: "1px solid var(--rule)" }, number: { margin: 0, color: "var(--vermilion)", fontFamily: "var(--font-display)", fontSize: "calc(var(--text-section) * 1.15)", lineHeight: .85 }, title: { margin: "8px 0 0", fontSize: "var(--text-section)", fontWeight: 600, lineHeight: 1 }, excerpt: { maxWidth: "690px", margin: "14px 0 0" }, meta: { display: "flex", flexWrap: "wrap", gap: "4px 14px", marginTop: "12px", alignContent: "flex-start", color: "var(--indigo)" },
};

export const metadata = { title: "My entries" };

export default async function MyEntriesPage() {
  const [supabase, cookieStore] = await Promise.all([createClient(), cookies()]);
  const { data: { user } } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  if (!user) redirect("/login");
  const translation = getTranslation(normalizeLanguage(cookieStore.get("language")?.value));

  const [entries, t] = [await getEntriesByOwner(user.id, supabase), translation.contributor];

  return (
    <main className="page-shell">
      <header className="page-hero compact-hero archive-hero" style={styles.hero}>
        <h1 style={styles.heroTitle}>{t.myEntriesTitle}</h1>
        <p style={styles.intro}>{t.myEntriesIntro}</p>
      </header>
      <section className="record-list" style={styles.list} aria-label={t.myEntriesTitle}>
        {entries.length ? entries.map((entry, index) => (
          <article className="my-entry-card" style={styles.card} key={entry.id}>
            <p className="entry-number" style={styles.number}>{String(index + 1).padStart(2, "0")}</p>
            <div>
              <p className="record-kicker">{translation.form.levels[entry.school_level] || entry.school_level?.replace("_", " ")}</p>
              <h2 className="entry-title" style={styles.title}><Link href={`/archive/${entry.slug}`}>{entry.title}</Link></h2>
              <p className="entry-excerpt" style={styles.excerpt}>{entry.image_description}</p>
              <p><strong>{t.status}:</strong> {t[entry.status]}</p>
            </div>
            <div className="entry-meta" style={styles.meta}><span>{entry.province}</span><span>{entry.memory_year}</span></div>
          </article>
        )) : <p>{t.noEntries}</p>}
      </section>
    </main>
  );
}