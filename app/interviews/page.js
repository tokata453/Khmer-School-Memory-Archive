import Link from "next/link";
import { cookies } from "next/headers";
import { getEntries } from "../../lib/entries.js";
import { normalizeLanguage } from "../../lib/language.js";
import { getTranslation } from "../../lib/translations.js";

export const metadata = {
  title: "Interview Collection",
};

export default async function InterviewsPage() {
  const [entries, cookieStore] = await Promise.all([getEntries(), cookies()]);
  const t = getTranslation(normalizeLanguage(cookieStore.get("language")?.value));

  return (
    <main className="page-shell">
      <header className="page-hero compact-hero archive-hero">
        <h1>{t.interviews.title}</h1>
        <p>{t.interviews.intro}</p>
      </header>

      <div className="interview-grid">
        {entries.map((entry, index) => (
          <article key={entry.slug} className="interview-card">
            <p className="entry-number">{String(index + 1).padStart(2, "0")}</p>
            <p className="record-kicker">{entry.category}</p>
            <h2>{entry.contributor}</h2>
            <p>{entry.excerpt}</p>
            <dl>
              <div>
                <dt>{t.interviews.period}</dt>
                <dd>{entry.period}</dd>
              </div>
              <div>
                <dt>{t.interviews.location}</dt>
                <dd>{entry.place}</dd>
              </div>
            </dl>
            <Link className="text-link" href={`/archive/${entry.slug}`}>
              {t.interviews.read}
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}