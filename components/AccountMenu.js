"use client";

import { User } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import LogoutButton from "./LogoutButton.js";

const styles = { menu: { position: "relative" }, toggle: { display: "grid", width: "40px", minHeight: "40px", placeItems: "center", border: "1px solid transparent", borderRadius: 0, background: "transparent", color: "var(--carbon)", font: "inherit", cursor: "pointer" }, panel: { position: "absolute", top: "calc(100% + 8px)", right: 0, zIndex: 20, display: "grid", minWidth: "260px", gap: "8px", padding: "12px", border: "1px solid var(--carbon)", borderRadius: 0, background: "var(--paper)", boxShadow: "8px 8px 0 rgba(41, 37, 33, .14)" }, chip: { display: "inline-flex", width: "100%", minWidth: 0, minHeight: "40px", gap: "8px", alignItems: "center", padding: "0 12px", borderRadius: 0, fontSize: "0.86rem", fontWeight: 800 }, email: { maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } };

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
          <LogoutButton />
        </div>
      ) : null}
    </div>
  );
}
