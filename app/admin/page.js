import { redirect } from "next/navigation";
import AdminDirectory from "../../components/AdminDirectory.js";
import { getAdminDirectory } from "../../lib/admin.js";
import { createClient } from "../../lib/supabase/server.js";
import { cookies } from "next/headers";
import { normalizeLanguage } from "../../lib/language.js";
import { getTranslation } from "../../lib/translations.js";

const styles = { hero: { padding: "34px 0 24px", borderBottom: "1px solid var(--rule)" }, title: { margin: 0, fontFamily: "var(--font-primary)", fontSize: "var(--text-display)", lineHeight: .82 }, intro: { margin: "14px 0 0", color: "var(--muted)", fontSize: "var(--text-lead)", lineHeight: 1.75 }, body: { padding: "28px 0 64px" } };

export const metadata = { title: "Archive administration" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [supabase, cookieStore] = await Promise.all([createClient(), cookies()]);
  const { data: { user } } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  if (!user) redirect("/login?next=/admin");
  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) redirect("/archive");
  const language = normalizeLanguage(cookieStore.get("language")?.value);
  const labels = getTranslation(language).admin;
  const profiles = await getAdminDirectory(supabase);
  return <main className="page-shell"><header style={styles.hero}><h1 style={styles.title}>{labels.title}</h1><p style={styles.intro}>{labels.intro}</p></header><div style={styles.body}><h2>{labels.directoryTitle}</h2><AdminDirectory profiles={profiles} labels={labels} /></div></main>;
}
