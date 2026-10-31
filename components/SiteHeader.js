import Link from "next/link";
import { LogIn } from "lucide-react";
import collection from "../collection.config.js";
import AccountMenu from "./AccountMenu.js";
import MobileNav from "./MobileNav.js";
import NavLink from "./NavLink.js";
import { createClient } from "../lib/supabase/server.js";
import { getTranslation } from "../lib/translations.js";

const styles = {
  header: { width: "var(--layout-wide)", margin: "0 auto", display: "grid", gridTemplateColumns: "auto minmax(0, 1fr) auto", gap: "28px", alignItems: "center", minHeight: "76px", padding: "12px 0", borderBottom: "2px solid var(--carbon)" }, mark: { display: "inline-flex", minWidth: 0, gap: "10px", alignItems: "center", textDecoration: "none", fontFamily: "var(--font-interface)" }, logo: { display: "block", width: "40px", height: "40px", objectFit: "contain" }, name: { fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 800, lineHeight: 1, letterSpacing: ".015em", whiteSpace: "nowrap" }, nav: { display: "flex", minWidth: 0, flexWrap: "nowrap", gap: "24px", alignItems: "center", justifyContent: "center", color: "var(--muted)", fontFamily: "var(--font-interface)", fontSize: "var(--text-nav)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.025em" }, tools: { display: "flex", minWidth: 0, flexWrap: "nowrap", gap: "6px", alignItems: "center", justifyContent: "flex-end" }, account: { display: "inline-flex", minWidth: 0, minHeight: "40px", gap: "8px", alignItems: "center", padding: "0 13px", borderRadius: 0, background: "var(--carbon)", color: "var(--paper)", fontSize: "0.8rem", fontWeight: 800, textDecoration: "none" },
};

export default async function SiteHeader({ language }) {
  const t = getTranslation(language);
  const supabase = await createClient();
  const { data } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  const user = data.user;
  const links = [
    [t.header.archive, "/archive"],
    [t.header.contribute, "/contribute"],
    ...(user ? [[t.header.myEntries, "/my-entries"]] : []),
    [t.header.about, "/about"],
  ];

  return (
    <header className="site-header" style={styles.header}>
      <Link className="site-mark" style={styles.mark} href="/" aria-label={`${collection.name} ${t.header.home}`}>
        <img className="site-logo-image" style={styles.logo} src="/logo.png" alt="" width="48" height="48" />
        <strong style={styles.name}>{t.header.home}</strong>
      </Link>

      <nav className="site-nav" style={styles.nav} aria-label={t.header.explore}>
        {links.map(([label, href]) => (
          <NavLink key={href} href={href}>
            {label}
          </NavLink>
        ))}
      </nav>

      <section className="header-tools" style={styles.tools} aria-label={t.header.tools}>
        {user ? (
          <AccountMenu userEmail={user.email} userName={user.user_metadata?.user_name || ""} avatarUrl={user.user_metadata?.avatar_url || ""} labels={t.header} />
        ) : (
          <Link className="account-button" style={styles.account} href="/login">
            <LogIn size={18} strokeWidth={2.2} aria-hidden="true" />
            {t.header.login}
          </Link>
        )}
      </section>

      <MobileNav links={links} userEmail={user?.email || ""} userName={user?.user_metadata?.user_name || ""} avatarUrl={user?.user_metadata?.avatar_url || ""} labels={t.header} />
    </header>
  );
}