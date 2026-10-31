import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import EntryForm from "../../components/EntryForm.js";
import { normalizeLanguage } from "../../lib/language.js";
import { defaultDisplayName } from "../../lib/profile.js";
import { createClient } from "../../lib/supabase/server.js";
import { getTranslation } from "../../lib/translations.js";

const styles = {
  shell: {
    paddingBottom: "80px",
    paddingTop: "0",
  },
};

export const metadata = { title: "Contribute" };

export default async function ContributePage() {
  const supabase = await createClient();
  const [{ data }, cookieStore] = await Promise.all([
    supabase ? supabase.auth.getUser() : { data: { user: null } },
    cookies(),
  ]);
  if (!data.user) redirect("/login?next=/contribute");
  const language = normalizeLanguage(cookieStore.get("language")?.value);
  const t = getTranslation(language).contributor;
  return <main className="page-shell form-shell" style={styles.shell}><EntryForm defaultDisplayName={defaultDisplayName(data.user.user_metadata)} intro={t.addIntro} language={language} title={t.addTitle} /></main>;
}
