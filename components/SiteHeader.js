import Link from "next/link";
import { LogIn, Search, User } from "lucide-react";
import collection from "../collection.config.js";
import LogoutButton from "./LogoutButton.js";
import MobileNav from "./MobileNav.js";
import ThemeToggle from "./ThemeToggle.js";
import { createClient } from "../lib/supabase/server.js";

export default async function SiteHeader() {
  const links = [
    ["Archive", "/archive"],
    ["Interviews", "/interviews"],
    ["About", "/about"],
  ];
  const supabase = await createClient();
  const { data } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  const user = data.user;

  return (
    <header className="site-header">
      <Link className="site-mark" href="/" aria-label={`${collection.name} home`}>
        <img className="site-logo-image" src="/logo.png" alt="" width="48" height="48" />
        <strong>School Memories</strong>
      </Link>

      <nav className="site-nav" aria-label="Explore archive">
        {links.map(([label, href]) => (
          <Link key={href} href={href}>
            {label}
          </Link>
        ))}
      </nav>

      <section className="header-tools" aria-label="Archive tools and account">
        <Link className="icon-button" href="/archive#entry-search" aria-label="Search archive">
          <Search size={20} strokeWidth={2.2} aria-hidden="true" />
        </Link>
        {user ? (
          <span className="auth-status">
            <span className="account-chip" title={user.email}>
              <User size={18} strokeWidth={2.2} aria-hidden="true" />
              <span>{user.email}</span>
            </span>
            <LogoutButton />
          </span>
        ) : (
          <Link className="account-button" href="/login">
            <LogIn size={18} strokeWidth={2.2} aria-hidden="true" />
            Log in
          </Link>
        )}
        <ThemeToggle />
      </section>

      <MobileNav links={links} userEmail={user?.email || ""} />
    </header>
  );
}