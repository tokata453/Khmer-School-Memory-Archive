import Link from "next/link";
import { cookies } from "next/headers";
import EntryForm from "../../components/EntryForm.js";
import { normalizeLanguage } from "../../lib/language.js";
import { createClient } from "../../lib/supabase/server.js";
import { getTranslation } from "../../lib/translations.js";

const styles = {
  shell: {
    paddingBottom: "80px",
    paddingTop: "0",
  },
  header: { padding: "34px 0 16px" },
  title: {
    margin: 0,
    fontFamily: "var(--font-display)",
    fontSize: "var(--text-display)",
    fontWeight: 800,
    lineHeight: 0.82,
    letterSpacing: ".015em",
  },
  intro: {
    maxWidth: "1000px",
    margin: "14px 0 0",
    color: "var(--muted)",
    fontSize: "var(--text-lead)",
    lineHeight: 1.75,
  },
  notice: { padding: "24px 0", borderTop: "1px solid var(--rule)" },
  link: {
    display: "inline-block",
    marginTop: "28px",
    padding: "12px 0 8px",
    color: "var(--carbon)",
    borderBottom: "3px solid var(--carbon)",
    textDecoration: "none",
  },
};

export const metadata = { title: "Contribute" };

export default async function ContributePage({ searchParams }) {
  const { submitted } = await searchParams;
  const supabase = await createClient();
  const [{ data }, cookieStore] = await Promise.all([
    supabase ? supabase.auth.getUser() : { data: { user: null } },
    cookies(),
  ]);
  const language = normalizeLanguage(cookieStore.get("language")?.value);
  const t = getTranslation(language).contributor;
  return (
    <main className="page-shell form-shell" style={styles.shell}>
      {!data.user ? <header
        className="page-hero compact-hero archive-hero form-hero"
        style={styles.header}
      >
        <h1 style={styles.title}>{t.addTitle}</h1>
        <p style={styles.intro}>{t.addIntro}</p>
      </header> : null}
      {submitted === "1" ? (
        <p className="form-notice" style={styles.notice} role="status">
          {t.submitted}
        </p>
      ) : null}
      {data.user ? (
        <EntryForm intro={t.addIntro} language={language} title={t.addTitle} />
      ) : (
        <section className="form-notice" style={styles.notice}>
          <p>{t.loginFirst}</p>
          <Link
            className="primary-link"
            style={styles.link}
            href="/login?next=/contribute"
          >
            {getTranslation(language).auth.login}
          </Link>
        </section>
      )}
    </main>
  );
}
