import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import MyEntriesBrowser from "../../components/MyEntriesBrowser.js";
import { getEntriesByOwner } from "../../lib/entries.js";
import { normalizeLanguage } from "../../lib/language.js";
import { createClient } from "../../lib/supabase/server.js";
import { getTranslation } from "../../lib/translations.js";

const styles = {
  hero: {
    display: "block",
    padding: "34px 0 16px",
    borderBottom: "1px solid var(--rule)",
  },
  heroTitle: {
    maxWidth: "none",
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
};

export const metadata = { title: "My entries" };

export default async function MyEntriesPage() {
  const [supabase, cookieStore] = await Promise.all([
    createClient(),
    cookies(),
  ]);
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  if (!user) redirect("/login");
  const translation = getTranslation(
    normalizeLanguage(cookieStore.get("language")?.value),
  );
  const entries = await getEntriesByOwner(user.id, supabase);

  return (
    <main className="page-shell">
      <header
        className="page-hero compact-hero archive-hero"
        style={styles.hero}
      >
        <h1 style={styles.heroTitle}>
          {translation.contributor.myEntriesTitle}
        </h1>
        <p style={styles.intro}>{translation.contributor.myEntriesIntro}</p>
      </header>
      <MyEntriesBrowser
        entries={entries}
        labels={translation.contributor}
        form={translation.form}
        cardLabels={translation.entryCard}
        comboBox={translation.comboBox}
      />
    </main>
  );
}
