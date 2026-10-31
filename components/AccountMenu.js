"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import AccountAvatar from "./AccountAvatar.js";
import LogoutButton from "./LogoutButton.js";

const styles = { menu: { position: "relative" }, toggle: { display: "grid", width: "40px", minHeight: "40px", placeItems: "center", border: "1px solid transparent", borderRadius: 0, background: "transparent", color: "var(--carbon)", font: "inherit", cursor: "pointer" }, panel: { position: "absolute", top: "calc(100% + 8px)", right: 0, zIndex: 20, display: "grid", minWidth: "260px", gap: "8px", padding: "12px", border: "1px solid var(--carbon)", borderRadius: 0, background: "var(--paper)", boxShadow: "8px 8px 0 rgba(41, 37, 33, .14)" }, chip: { display: "inline-flex", width: "100%", minWidth: 0, minHeight: "40px", gap: "8px", alignItems: "center", padding: "0 12px", borderRadius: 0, color: "inherit", fontSize: "0.86rem", fontWeight: 800, textDecoration: "none" }, email: { maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } };

export default function AccountMenu({ userEmail, userName, avatarUrl, labels }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();
  const menuRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    function closeOnOutsidePointer(event) {
      if (!menuRef.current?.contains(event.target)) setIsOpen(false);
    }

    function closeOnEscape(event) {
      if (event.key !== "Escape") return;
      setIsOpen(false);
      toggleRef.current?.focus();
    }

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  return (
    <div className="account-menu" style={styles.menu} ref={menuRef}>
      <button
        className="icon-button account-menu-toggle"
        style={styles.toggle}
        type="button"
        aria-label={isOpen ? labels.closeAccountMenu : labels.openAccountMenu}
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => setIsOpen((open) => !open)}
        ref={toggleRef}
      >
        <AccountAvatar url={avatarUrl} name={userName} size={28} />
      </button>

      {isOpen ? (
        <div className="account-menu-panel" style={styles.panel} id={menuId} aria-label={labels.accountOptions}>
          <Link className="account-chip" style={styles.chip} href="/profile" title={userEmail} onClick={() => setIsOpen(false)}>
            <AccountAvatar url={avatarUrl} name={userName} size={28} />
            <span style={styles.email}>{userName || userEmail}</span>
          </Link>
          <LogoutButton labels={labels} />
        </div>
      ) : null}
    </div>
  );
}
