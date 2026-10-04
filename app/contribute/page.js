import Link from "next/link";
import EntryForm from "../../components/EntryForm.js";
import { createClient } from "../../lib/supabase/server.js";

export const metadata = { title: "Contribute" };

export default async function ContributePage() {
  const supabase = await createClient();
  const { data } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  return (
    <main className="page-shell form-shell">
      <p className="eyebrow">Contributor archive</p>
      <h1>Add a school memory</h1>
      {data.user ? <EntryForm /> : (
        <section className="form-notice">
          <p>Log in before adding an entry.</p>
          <Link className="primary-link" href="/login?next=/contribute">Log in</Link>
        </section>
      )}
    </main>
  );
}
