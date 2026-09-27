"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({ href, children, onClick }) {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === href : pathname.startsWith(href);

  return (
    <Link className={isActive ? "is-active" : ""} href={href} aria-current={isActive ? "page" : undefined} onClick={onClick}>
      {children}
    </Link>
  );
}
