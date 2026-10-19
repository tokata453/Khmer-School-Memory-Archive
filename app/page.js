import collection from "../collection.config.js";
import EntryCard from "../components/EntryCard.js";
import Link from "next/link";
import { cookies } from "next/headers";
import { getEntries } from "../lib/entries.js";
import { normalizeLanguage } from "../lib/language.js";
import { getTranslation } from "../lib/translations.js";

export default async function Home() {
  const [entries, cookieStore] = await Promise.all([getEntries(), cookies()]);
  const t = getTranslation(normalizeLanguage(cookieStore.get("language")?.value));
  const featuredEntries = entries.slice(0, 3);

  return (
    <main>
      <section className="hero-section page-shell">
        <div className="hero-content">
          <p className="eyebrow">{t.home.eyebrow}</p>
          <h1 className="archive-title">{collection.name}</h1>
          <p className="archive-description">{collection.description}</p>
          <Link className="primary-link" href="/archive">
            {t.home.browse}
          </Link>
        </div>
        <figure className="hero-media">
          <img
            src="/hero-image.jpg"
            alt={t.home.imageAlt}
          />
          <figcaption>{t.home.caption}</figcaption>
        </figure>
      </section>

      <section className="page-shell section-block">
        <div className="section-heading">
          <h2>{t.home.start}</h2>
        </div>
        <div className="record-list">
          {featuredEntries.length > 0 ? (
            featuredEntries.map((entry, index) => (
              <EntryCard key={entry.slug} entry={entry} recordNumber={index + 1} labels={t.entryCard} />
            ))
          ) : (
            <p>{t.home.empty}</p>
          )}
        </div>
      </section>

      <section className="page-shell section-block">
        <div className="archive-panel">
          <h2>{t.home.recordsTitle}</h2>
          <p>{t.home.recordsBody}</p>
        </div>
      </section>
    </main>
  );
}
