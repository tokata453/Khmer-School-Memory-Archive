"use client";

import Link from "next/link";
import { LogIn, Menu, Search, User, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import NavLink from "./NavLink.js";
import LanguageToggle from "./LanguageToggle.js";
import LogoutButton from "./LogoutButton.js";
import ThemeToggle from "./ThemeToggle.js";

export default function MobileNav({ links, userEmail, language, labels }) {
  const [isOpen, setIsOpen] = useState(false);
  const drawerId = useId();
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    closeButtonRef.current?.focus();

    function closeOnEscape(event) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  function closeDrawer() {
    setIsOpen(false);
  }

  return (
    <section className="mobile-nav" aria-label={labels.mobileMenu}>
      <button
        className="icon-button mobile-menu-button"
        type="button"
        aria-label={labels.openMenu}
        aria-expanded={isOpen}
        aria-controls={drawerId}
        onClick={() => setIsOpen(true)}
      >
        <Menu size={22} strokeWidth={2.2} aria-hidden="true" />
      </button>

      {isOpen ? (
        <>
          <button className="mobile-drawer-backdrop" type="button" aria-label={labels.closeMenu} onClick={closeDrawer} />
          <aside className="mobile-drawer" id={drawerId} role="dialog" aria-modal="true" aria-label={labels.siteMenu}>
            <button
              className="icon-button mobile-close-button"
              type="button"
              aria-label={labels.closeMenu}
              onClick={closeDrawer}
              ref={closeButtonRef}
            >
              <X size={22} strokeWidth={2.2} aria-hidden="true" />
            </button>

            <nav className="mobile-drawer-links" aria-label={labels.explore}>
              {links.map(([label, href]) => (
                <NavLink key={href} href={href} onClick={closeDrawer}>
                  {label}
                </NavLink>
              ))}
            </nav>

            <div className="mobile-drawer-tools" aria-label={labels.tools}>
              <Link className="account-button" href="/archive#entry-search" onClick={closeDrawer}>
                <Search size={18} strokeWidth={2.2} aria-hidden="true" />
                {labels.search}
              </Link>
              {userEmail ? (
                <span className="auth-status">
                  <span className="account-chip" title={userEmail}>
                    <User size={18} strokeWidth={2.2} aria-hidden="true" />
                    <span>{userEmail}</span>
                  </span>
                  <LogoutButton />
                </span>
              ) : (
                <Link className="account-button" href="/login" onClick={closeDrawer}>
                  <LogIn size={18} strokeWidth={2.2} aria-hidden="true" />
                  {labels.login}
                </Link>
              )}
              <LanguageToggle language={language} />
              <ThemeToggle />
            </div>
          </aside>
        </>
      ) : null}
    </section>
  );
}
