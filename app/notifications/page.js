import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import NotificationList from "../../components/NotificationList.js";
import { normalizeLanguage } from "../../lib/language.js";
import { getNotifications } from "../../lib/notifications.js";
import { createClient } from "../../lib/supabase/server.js";
import { getTranslation } from "../../lib/translations.js";

const styles = { hero: { padding: "34px 0 24px", borderBottom: "1px solid var(--rule)" }, title: { margin: 0, fontFamily: "var(--font-primary)", fontSize: "var(--text-display)", fontWeight: 700, lineHeight: .82 }, intro: { margin: "14px 0 0", color: "var(--muted)", fontSize: "var(--text-lead)", lineHeight: 1.75 }, content: { padding: "28px 0 64px" } };

export const metadata = { title: "Notifications" };
export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const [supabase, cookieStore] = await Promise.all([createClient(), cookies()]);
  const { data: { user } } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  if (!user) redirect("/login");
  const language = normalizeLanguage(cookieStore.get("language")?.value);
  const t = getTranslation(language).notifications;
  const notifications = await getNotifications(user.id, supabase);

  return <main className="page-shell"><header className="page-hero compact-hero archive-hero" style={styles.hero}><h1 style={styles.title}>{t.title}</h1><p style={styles.intro}>{t.intro}</p></header><div style={styles.content}><NotificationList notifications={notifications} labels={t} language={language} /></div></main>;
}
