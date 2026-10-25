import Link from "next/link";
import { LogIn, Search } from "lucide-react";
import collection from "../collection.config.js";
import AccountMenu from "./AccountMenu.js";
import LanguageToggle from "./LanguageToggle.js";
import MobileNav from "./MobileNav.js";
import NavLink from "./NavLink.js";
import { createClient } from "../lib/supabase/server.js";
import { getTranslation } from "../lib/translations.js";

export default async function SiteHeader({ language }) {
  const t = getTranslation(language);
  const supabase = await createClient();
  const { data } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  const user = data.user;
  const links = [
    [t.header.archive, "/archive"],
    [t.header.contribute, "/contribute"],
    ...(user ? [[t.header.myEntries, "/my-entries"]] : []),
    [t.header.interviews, "/interviews"],
    [t.header.about, "/about"],
  ];

  return (
    <header className="site-header">
      <Link className="site-mark" href="/" aria-label={`${collection.name} ${t.header.home}`}>
        <img className="site-logo-image" src="/logo.png" alt="" width="48" height="48" />
        <strong>{t.header.home}</strong>
      </Link>

      <nav className="site-nav" aria-label={t.header.explore}>
        {links.map(([label, href]) => (
          <NavLink key={href} href={href}>
            {label}
          </NavLink>
        ))}
      </nav>

      <section className="header-tools" aria-label={t.header.tools}>
        <Link className="icon-button" href="/archive#entry-search" aria-label={t.header.search}>
          <Search size={20} strokeWidth={2.2} aria-hidden="true" />
        </Link>
        {user ? (
          <AccountMenu userEmail={user.email} />
        ) : (
          <Link className="account-button" href="/login">
            <LogIn size={18} strokeWidth={2.2} aria-hidden="true" />
            {t.header.login}
          </Link>
        )}
        <LanguageToggle language={language} />
      </section>

      <MobileNav links={links} userEmail={user?.email || ""} language={language} labels={t.header} />
    </header>
  );
}