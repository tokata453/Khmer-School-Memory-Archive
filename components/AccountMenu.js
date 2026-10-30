"use client";

import { User } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import LogoutButton from "./LogoutButton.js";
import ThemeToggle from "./ThemeToggle.js";

const styles = { menu: { position: "relative" }, toggle: { display: "grid", width: "44px", minHeight: "44px", placeItems: "center", border: 0, borderRadius: "16px", background: "transparent", color: "var(--carbon)", font: "inherit", cursor: "pointer" }, panel: { position: "absolute", top: "calc(100% + 10px)", right: 0, zIndex: 20, display: "grid", minWidth: "260px", gap: "8px", padding: "12px", border: "1px solid var(--rule)", borderRadius: "18px", background: "var(--paper)", boxShadow: "0 18px 45px rgba(23, 24, 21, 0.18)" }, chip: { display: "inline-flex", width: "100%", minWidth: 0, minHeight: "44px", gap: "8px", alignItems: "center", padding: "0 18px", borderRadius: "16px", fontSize: "0.86rem", fontWeight: 800 }, email: { maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } };

export default function AccountMenu({ userEmail }) {
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
        aria-label={isOpen ? "Close account menu" : "Open account menu"}
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => setIsOpen((open) => !open)}
        ref={toggleRef}
      >
        <User size={20} strokeWidth={2.2} aria-hidden="true" />
      </button>

      {isOpen ? (
        <div className="account-menu-panel" style={styles.panel} id={menuId} aria-label="Account options">
          <span className="account-chip" style={styles.chip} title={userEmail}>
            <User size={18} strokeWidth={2.2} aria-hidden="true" />
            <span style={styles.email}>{userEmail}</span>
          </span>
          <ThemeToggle variant="menu" />
          <LogoutButton />
        </div>
      ) : null}
    </div>
  );
}
