import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ProfileForm from "../../components/ProfileForm.js";
import { getEntriesByOwner } from "../../lib/entries.js";
import { normalizeLanguage } from "../../lib/language.js";
import { entryCounts } from "../../lib/profile.js";
import { createClient } from "../../lib/supabase/server.js";
import { getTranslation } from "../../lib/translations.js";

const styles = { shell: { paddingBottom: "80px" }, hero: { padding: "34px 0 20px", borderBottom: "1px solid var(--rule)" }, title: { margin: 0, fontFamily: "var(--font-display)", fontSize: "var(--text-display)", lineHeight: .9 }, intro: { color: "var(--muted)", lineHeight: 1.7 }, grid: { display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(240px, .45fr)", gap: "32px", paddingTop: "28px" }, panel: { display: "grid", alignContent: "start", gap: "14px", padding: "20px", border: "1px solid var(--rule)", background: "var(--paper)" }, stats: { display: "grid", gap: "10px" }, link: { padding: "10px 0", fontWeight: 700 } };

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const [supabase, cookieStore] = await Promise.all([createClient(), cookies()]);
  const { data: { user } } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  if (!user) redirect("/login?next=/profile");
  const language = normalizeLanguage(cookieStore.get("language")?.value);
  const t = getTranslation(language).profile;
  const counts = entryCounts(await getEntriesByOwner(user.id, supabase));
  const joined = new Intl.DateTimeFormat(language === "km" ? "km-KH" : "en", { month: "long", year: "numeric" }).format(new Date(user.created_at));
  return <main className="page-shell" style={styles.shell}><header style={styles.hero}><h1 style={styles.title}>{t.title}</h1><p style={styles.intro}>{t.intro}</p></header><div className="profile-grid" style={styles.grid}><ProfileForm metadata={user.user_metadata} email={user.email} labels={t} /><aside style={styles.panel}><strong>{t.activity}</strong><div style={styles.stats}><span>{counts.total} — {t.total}</span><span>{counts.pending} — {t.pending}</span><span>{counts.published} — {t.published}</span><span>{counts.returned} — {t.returned}</span></div><span>{t.memberSince}: {joined}</span><Link style={styles.link} href="/my-entries">{t.myEntries}</Link><Link style={styles.link} href="/contribute">{t.addEntry}</Link></aside></div></main>;
}