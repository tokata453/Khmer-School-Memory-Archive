"use client";

import Link from "next/link";
import { LogIn, Menu, Search, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import NavLink from "./NavLink.js";
import LogoutButton from "./LogoutButton.js";
import AccountAvatar from "./AccountAvatar.js";

const styles = { nav: { display: "none" }, iconButton: { display: "grid", width: "40px", minHeight: "40px", placeItems: "center", border: "1px solid transparent", borderRadius: 0, background: "transparent", color: "var(--carbon)", font: "inherit", cursor: "pointer" }, endButton: { justifySelf: "end" }, backdrop: { position: "fixed", inset: 0, zIndex: 30, border: 0, background: "rgba(41, 37, 33, .48)", cursor: "pointer" }, drawer: { position: "fixed", inset: "0 0 0 auto", zIndex: 31, display: "flex", width: "min(340px, 88vw)", flexDirection: "column", gap: "26px", padding: "18px", borderLeft: "2px solid var(--carbon)", background: "var(--paper)", boxShadow: "-10px 0 0 rgba(41, 37, 33, .14)" }, links: { display: "grid", gap: "12px" }, search: { display: "inline-flex", width: "100%", minWidth: 0, minHeight: "40px", gap: "8px", alignItems: "center", padding: "0 13px", borderRadius: 0, background: "var(--carbon)", color: "var(--paper)", fontSize: "0.86rem", fontWeight: 800, textDecoration: "none" }, tools: { display: "grid", gap: "12px", marginTop: "auto" }, status: { display: "grid", width: "100%", minWidth: 0, gap: "8px" }, chip: { display: "inline-flex", width: "100%", minWidth: 0, minHeight: "40px", gap: "8px", alignItems: "center", padding: "0 13px", borderRadius: 0, color: "var(--carbon)", fontSize: "0.86rem", fontWeight: 800, textDecoration: "none" }, email: { maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } };

export default function MobileNav({ links, userEmail, userName, avatarUrl, labels }) {
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

            <Link className="account-button" style={styles.search} href="/archive#entry-search" onClick={closeDrawer}>
              <Search size={18} strokeWidth={2.2} aria-hidden="true" />
              {labels.search}
            </Link>

            <nav className="mobile-drawer-links" style={styles.links} aria-label={labels.explore}>
              {links.map(([label, href]) => (
                <NavLink key={href} href={href} onClick={closeDrawer}>
                  {label}
                </NavLink>
              ))}
            </nav>

            <div className="mobile-drawer-tools" style={styles.tools} aria-label={labels.tools}>
              {userEmail ? (
                  <span className="auth-status" style={styles.status}>
                    <Link className="account-chip" style={styles.chip} href="/profile" title={userEmail} onClick={closeDrawer}>
                      <AccountAvatar url={avatarUrl} name={userName} size={28} />
                      <span style={styles.email}>{userName || userEmail}</span>
                    </Link>
                    <LogoutButton labels={labels} />
                  </span>
              ) : (
                <Link className="account-button" style={styles.search} href="/login" onClick={closeDrawer}>
                  <LogIn size={18} strokeWidth={2.2} aria-hidden="true" />
                  {labels.login}
                </Link>
              )}
            </div>
          </aside>
        </>
      ) : null}
    </section>
  );
}
