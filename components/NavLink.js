"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const styles = { link: { position: "relative", borderBottom: "1px solid transparent", padding: "9px 2px", color: "inherit", textDecoration: "none", whiteSpace: "nowrap" } };

export default function NavLink({ href, children, onClick }) {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === href : pathname.startsWith(href);

  return (
    <Link className={isActive ? "is-active" : ""} style={styles.link} href={href} aria-current={isActive ? "page" : undefined} onClick={onClick}>
      {children}
    </Link>
  );
}
