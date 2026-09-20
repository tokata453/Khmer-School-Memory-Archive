import Link from "next/link";
import collection from "../collection.config.js";
import LogoutButton from "./LogoutButton.js";
import { createClient } from "../lib/supabase/server.js";

export default async function SiteHeader() {
  const links = [
    ["Home", "/"],
    ["Archive", "/archive"],
    ["About", "/about"],
    ["Interviews", "/interviews"],
  ];
  const supabase = await createClient();
  const { data } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  const user = data.user;

  return (
    <header className="site-header">
      <Link className="site-mark" href="/" aria-label="Home">
        <span>KM / Archive</span>
        <strong>{collection.name}</strong>
      </Link>
      <nav className="site-nav" aria-label="Main navigation">
        {links.map(([label, href]) => (
          <Link key={href} href={href}>
            {label}
          </Link>
        ))}
        {user ? (
          <span className="auth-status">
            <span>{user.email}</span>
            <LogoutButton />
          </span>
        ) : (
          <span className="auth-status">
            <Link href="/login">Log in</Link>
            <Link href="/signup">Sign up</Link>
          </span>
        )}
      </nav>
    </header>
  );
}