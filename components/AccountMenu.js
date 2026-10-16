"use client";

import { User } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import LogoutButton from "./LogoutButton.js";

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
    <div className="account-menu" ref={menuRef}>
      <button
        className="icon-button account-menu-toggle"
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
        <div className="account-menu-panel" id={menuId} aria-label="Account options">
          <span className="account-chip" title={userEmail}>
            <User size={18} strokeWidth={2.2} aria-hidden="true" />
            <span>{userEmail}</span>
          </span>
          <LogoutButton />
        </div>
      ) : null}
    </div>
  );
}
