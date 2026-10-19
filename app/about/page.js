import collection from "../../collection.config.js";
import { cookies } from "next/headers";
import { normalizeLanguage } from "../../lib/language.js";
import { getTranslation } from "../../lib/translations.js";

export const metadata = {
  title: "About Project",
};

export default async function AboutPage() {
  const cookieStore = await cookies();
  const t = getTranslation(normalizeLanguage(cookieStore.get("language")?.value));

  return (
    <main className="page-shell">
      <header className="page-hero compact-hero archive-hero">
        <h1>{t.about.title}</h1>
        <p>{collection.description}</p>
      </header>

      <div className="about-stack">
        <section className="archive-panel">
          <h2>{t.about.purpose}</h2>
          <p>{t.about.purposeBody}</p>
        </section>

        <section className="process-grid" aria-label={t.about.processLabel}>
          {t.about.steps.map((step, index) => (
            <div key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{step}</p>
            </div>
          ))}
        </section>

        <section className="archive-panel">
          <h2>{t.about.method}</h2>
          <p>{t.about.methodBody}</p>
        </section>

        <section className="archive-panel">
          <h2>{t.about.credits}</h2>
          <p>
            {t.about.created} {collection.curator} for ICT 340 - Vibe Coding at the
            American University of Phnom Penh.
          </p>
          <p>{t.about.source}: {collection.source}.</p>
        </section>
      </div>
    </main>
  );
}