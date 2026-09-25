"use client";

import Link from "next/link";
import { LogIn, Menu, Search, User, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import LogoutButton from "./LogoutButton.js";
import ThemeToggle from "./ThemeToggle.js";

export default function MobileNav({ links, userEmail }) {
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
    <section className="mobile-nav" aria-label="Mobile menu">
      <button
        className="icon-button mobile-menu-button"
        type="button"
        aria-label="Open menu"
        aria-expanded={isOpen}
        aria-controls={drawerId}
        onClick={() => setIsOpen(true)}
      >
        <Menu size={22} strokeWidth={2.2} aria-hidden="true" />
      </button>

      {isOpen ? (
        <>
          <button className="mobile-drawer-backdrop" type="button" aria-label="Close menu" onClick={closeDrawer} />
          <aside className="mobile-drawer" id={drawerId} role="dialog" aria-modal="true" aria-label="Site menu">
            <button
              className="icon-button mobile-close-button"
              type="button"
              aria-label="Close menu"
              onClick={closeDrawer}
              ref={closeButtonRef}
            >
              <X size={22} strokeWidth={2.2} aria-hidden="true" />
            </button>

            <nav className="mobile-drawer-links" aria-label="Explore archive">
              {links.map(([label, href]) => (
                <Link key={href} href={href} onClick={closeDrawer}>
                  {label}
                </Link>
              ))}
            </nav>

            <div className="mobile-drawer-tools" aria-label="Archive tools and account">
              <Link className="account-button" href="/archive#entry-search" onClick={closeDrawer}>
                <Search size={18} strokeWidth={2.2} aria-hidden="true" />
                Search archive
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
                  Log in
                </Link>
              )}
              <ThemeToggle />
            </div>
          </aside>
        </>
      ) : null}
    </section>
  );
}
