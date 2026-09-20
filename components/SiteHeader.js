import Link from "next/link";
import collection from "../collection.config.js";

export default function SiteHeader() {
  const links = [
    ["Home", "/"],
    ["Archive", "/archive"],
    ["About", "/about"],
    ["Interviews", "/interviews"],
  ];

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
      </nav>
    </header>
  );
}