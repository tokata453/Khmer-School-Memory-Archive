import collection from "../../collection.config.js";
import Link from "next/link";
import { cookies } from "next/headers";
import AboutClosing from "../../components/AboutClosing.js";
import AboutPrinciples from "../../components/AboutPrinciples.js";
import AboutValues from "../../components/AboutValues.js";
import { normalizeLanguage } from "../../lib/language.js";
import { getTranslation } from "../../lib/translations.js";

export const metadata = { title: "About Project" };

export default async function AboutPage() {
  const cookieStore = await cookies();
  const language = normalizeLanguage(cookieStore.get("language")?.value);
  const t = getTranslation(language).about;
  const source = language === "km" ? collection.sourceKhmer : collection.source;
  const details = [
    [t.created, collection.curator],
    [t.source, source],
    [t.method, t.methodBody],
    [t.language, t.bilingual],
  ];

  return (
    <main className="page-shell about-page">
      <header className="page-hero compact-hero archive-hero about-hero">
        <p className="home-section-kicker">{t.eyebrow}</p>
        <h1>{t.title}</h1>
        <p>{language === "km" ? collection.descriptionKhmer : collection.description}</p>
        <div className="about-hero-actions">
          <Link className="primary-link" href="/archive">{t.browse}</Link>
          <Link className="section-link" href="/contribute">{t.contribute}</Link>
        </div>
      </header>

      <section className="archive-panel about-statement">
        <div>
          <p className="home-section-kicker">{t.statementKicker}</p>
          <h2>{t.purpose}</h2>
          <p>{t.purposeBody}</p>
        </div>
        <blockquote>{t.statement}</blockquote>
      </section>

      <AboutValues labels={t.values} />

      <section className="about-section about-process" aria-labelledby="process-heading">
        <div className="about-section-intro">
          <p className="home-section-kicker">{t.processKicker}</p>
          <h2 id="process-heading">{t.processTitle}</h2>
          <p>{t.processBody}</p>
        </div>
        <ol>
          {t.steps.map((step, index) => (
            <li key={step.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <AboutPrinciples labels={t.principles} />

      <section className="archive-panel about-method">
        <div>
          <p className="home-section-kicker">{t.methodKicker}</p>
          <h2>{t.method}</h2>
          <p>{t.methodBody}</p>
        </div>
        <div className="about-source">
          <span>{t.source}</span>
          <p>{source}</p>
        </div>
      </section>

      <section className="about-section about-details" aria-labelledby="details-heading">
        <div className="about-section-intro">
          <p className="home-section-kicker">{t.detailsKicker}</p>
          <h2 id="details-heading">{t.credits}</h2>
        </div>
        <div>
          {details.map(([label, value]) => <dl key={label}><dt>{label}</dt><dd>{value}</dd></dl>)}
        </div>
      </section>

      <AboutClosing labels={t.closing} />
    </main>
  );
}
