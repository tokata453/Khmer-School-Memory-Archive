import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ProfileForm from "../../components/ProfileForm.js";
import { getEntriesByOwner } from "../../lib/entries.js";
import { normalizeLanguage } from "../../lib/language.js";
import { entryCounts } from "../../lib/profile.js";
import { createClient } from "../../lib/supabase/server.js";
import { getTranslation } from "../../lib/translations.js";

const styles = {
  shell: { paddingBottom: "64px" },
  hero: { padding: "34px 0 20px", borderBottom: "1px solid var(--rule)" },
  title: {
    margin: 0,
    fontFamily: "var(--font-display)",
    fontSize: "var(--text-display)",
    lineHeight: 0.9,
  },
  intro: { color: "var(--muted)", lineHeight: 1.7 },
  grid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) 280px",
    gap: "24px",
    paddingTop: "24px",
  },
  panel: {
    display: "grid",
    alignContent: "start",
    gap: "16px",
    padding: "20px",
    border: "1px solid var(--rule)",
    borderLeft: "4px solid var(--gold)",
    background: "var(--paper)",
    boxShadow: "4px 5px 0 rgba(117, 100, 77, .12)",
  },
  total: {
    display: "grid",
    gap: "2px",
    padding: "14px",
    border: "1px solid var(--rule)",
    background: "var(--concrete)",
  },
  totalNumber: {
    fontFamily: "var(--font-display)",
    fontSize: "2.5rem",
    fontWeight: 700,
    lineHeight: 0.9,
  },
  stats: { display: "grid", gap: "8px" },
  stat: { display: "flex", gap: "8px", alignItems: "baseline" },
  count: {
    minWidth: "1.5em",
    fontFamily: "var(--font-display)",
    fontSize: "1.25rem",
    fontWeight: 700,
  },
  since: {
    paddingTop: "14px",
    borderTop: "1px solid var(--rule)",
    color: "var(--muted)",
    lineHeight: 1.5,
  },
  links: { display: "grid", borderTop: "1px solid var(--rule)" },
  link: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
    fontWeight: 700,
    textDecoration: "none",
  },
};

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const [supabase, cookieStore] = await Promise.all([
    createClient(),
    cookies(),
  ]);
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  if (!user) redirect("/login?next=/profile");
  const language = normalizeLanguage(cookieStore.get("language")?.value);
  const t = getTranslation(language).profile;
  const counts = entryCounts(await getEntriesByOwner(user.id, supabase));
  const joined = new Intl.DateTimeFormat(language === "km" ? "km-KH" : "en", {
    month: "long",
    year: "numeric",
  }).format(new Date(user.created_at));
  return (
    <main className="page-shell profile-shell" style={styles.shell}>
      <header style={styles.hero}>
        <h1 style={styles.title}>{t.title}</h1>
        <p style={styles.intro}>{t.intro}</p>
      </header>
      <div className="profile-grid" style={styles.grid}>
        <ProfileForm
          metadata={user.user_metadata}
          email={user.email}
          labels={t}
        />
        <aside className="profile-activity" style={styles.panel}>
          <strong>{t.activity}</strong>
          <div style={styles.total}>
            <span style={styles.totalNumber}>{counts.total}</span>
            <span>{t.total}</span>
          </div>
          <div style={styles.stats}>
            <span style={styles.stat}>
              <b style={styles.count}>{counts.pending}</b>
              {t.pending}
            </span>
            <span style={styles.stat}>
              <b style={styles.count}>{counts.published}</b>
              {t.published}
            </span>
            <span style={styles.stat}>
              <b style={styles.count}>{counts.returned}</b>
              {t.returned}
            </span>
          </div>
          <span style={styles.since}>
            {t.memberSince}
            <br />
            {joined}
          </span>
          <div style={styles.links}>
            <Link style={styles.link} href="/my-entries">
              <span>{t.myEntries}</span>
              <span aria-hidden="true">→</span>
            </Link>
            <Link style={styles.link} href="/contribute">
              <span>{t.addEntry}</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
