import Link from "next/link";
import { cookies } from "next/headers";
import EntryForm from "../../components/EntryForm.js";
import { normalizeLanguage } from "../../lib/language.js";
import { createClient } from "../../lib/supabase/server.js";
import { getTranslation } from "../../lib/translations.js";

export const metadata = { title: "Contribute" };

export default async function ContributePage({ searchParams }) {
  const { submitted } = await searchParams;
  const supabase = await createClient();
  const [{ data }, cookieStore] = await Promise.all([
    supabase ? supabase.auth.getUser() : { data: { user: null } },
    cookies(),
  ]);
  const t = getTranslation(normalizeLanguage(cookieStore.get("language")?.value)).contributor;
  return (
    <main className="page-shell form-shell">
      <p className="eyebrow">{t.eyebrow}</p>
      <h1>{t.addTitle}</h1>
      {submitted === "1" ? <p className="form-notice" role="status">{t.submitted}</p> : null}
      {data.user ? <EntryForm /> : (
        <section className="form-notice">
          <p>{t.loginFirst}</p>
          <Link className="primary-link" href="/login?next=/contribute">{getTranslation(normalizeLanguage(cookieStore.get("language")?.value)).auth.login}</Link>
        </section>
      )}
    </main>
  );
}
