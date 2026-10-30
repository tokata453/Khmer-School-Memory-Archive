"use client";

import Link from "next/link";
import { LogIn, Menu, Search, User, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import NavLink from "./NavLink.js";
import LanguageToggle from "./LanguageToggle.js";
import LogoutButton from "./LogoutButton.js";
import ThemeToggle from "./ThemeToggle.js";

const styles = { nav: { display: "none" }, iconButton: { display: "grid", width: "44px", minHeight: "44px", placeItems: "center", border: 0, borderRadius: "16px", background: "transparent", color: "var(--carbon)", font: "inherit", cursor: "pointer" }, endButton: { justifySelf: "end" }, backdrop: { position: "fixed", inset: 0, zIndex: 30, border: 0, background: "rgba(23, 24, 21, 0.46)", cursor: "pointer" }, drawer: { position: "fixed", inset: "0 0 0 auto", zIndex: 31, display: "flex", width: "min(340px, 88vw)", flexDirection: "column", gap: "26px", padding: "18px", borderLeft: "1px solid var(--rule)", background: "var(--paper)", boxShadow: "-20px 0 60px rgba(23, 24, 21, 0.24)" }, links: { display: "grid", gap: "12px" }, tools: { display: "grid", gap: "12px", marginTop: "auto" }, account: { display: "inline-flex", width: "100%", minWidth: 0, minHeight: "44px", gap: "8px", alignItems: "center", padding: "0 18px", borderRadius: "16px", background: "var(--carbon)", color: "var(--paper)", fontSize: "0.86rem", fontWeight: 800, textDecoration: "none" }, status: { display: "flex", width: "100%", minWidth: 0, flexWrap: "nowrap", gap: "8px", alignItems: "center" }, chip: { display: "inline-flex", width: "100%", minWidth: 0, minHeight: "44px", gap: "8px", alignItems: "center", padding: "0 18px", borderRadius: "16px", fontSize: "0.86rem", fontWeight: 800 }, email: { maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } };

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
    <section className="mobile-nav" style={styles.nav} aria-label={labels.mobileMenu}>
      <button
        className="icon-button mobile-menu-button"
        style={{ ...styles.iconButton, ...styles.endButton }}
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
          <button className="mobile-drawer-backdrop" style={styles.backdrop} type="button" aria-label={labels.closeMenu} onClick={closeDrawer} />
          <aside className="mobile-drawer" style={styles.drawer} id={drawerId} role="dialog" aria-modal="true" aria-label={labels.siteMenu}>
            <button
              className="icon-button mobile-close-button"
              style={{ ...styles.iconButton, ...styles.endButton }}
              type="button"
              aria-label={labels.closeMenu}
              onClick={closeDrawer}
              ref={closeButtonRef}
            >
              <X size={22} strokeWidth={2.2} aria-hidden="true" />
            </button>

            <nav className="mobile-drawer-links" style={styles.links} aria-label={labels.explore}>
              {links.map(([label, href]) => (
                <NavLink key={href} href={href} onClick={closeDrawer}>
                  {label}
                </NavLink>
              ))}
            </nav>

            <div className="mobile-drawer-tools" style={styles.tools} aria-label={labels.tools}>
              <Link className="account-button" style={styles.account} href="/archive#entry-search" onClick={closeDrawer}>
                <Search size={18} strokeWidth={2.2} aria-hidden="true" />
                {labels.search}
              </Link>
              {userEmail ? (
                <>
                  <span className="auth-status" style={styles.status}>
                    <span className="account-chip" style={styles.chip} title={userEmail}>
                      <User size={18} strokeWidth={2.2} aria-hidden="true" />
                      <span style={styles.email}>{userEmail}</span>
                    </span>
                    <LogoutButton />
                  </span>
                  <ThemeToggle variant="menu" />
                </>
              ) : (
                <Link className="account-button" style={styles.account} href="/login" onClick={closeDrawer}>
                  <LogIn size={18} strokeWidth={2.2} aria-hidden="true" />
                  {labels.login}
                </Link>
              )}
              <LanguageToggle language={language} />
            </div>
          </aside>
        </>
      ) : null}
    </section>
  );
}
