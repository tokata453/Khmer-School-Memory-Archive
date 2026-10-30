"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const styles = { button: { display: "grid", width: "44px", minHeight: "44px", placeItems: "center", border: 0, borderRadius: "16px", background: "transparent", color: "var(--carbon)", font: "inherit", cursor: "pointer" }, menu: { display: "inline-flex", width: "100%", gap: "8px", alignItems: "center", justifyContent: "flex-start", padding: "0 18px", fontSize: "0.86rem", fontWeight: 800 } };

export default function ThemeToggle({ variant }) {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const nextTheme = savedTheme || (prefersDark ? "dark" : "light");

    document.documentElement.dataset.theme = nextTheme;
    setTheme(nextTheme);
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";

    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem("theme", nextTheme);
    setTheme(nextTheme);
  }

  const label = theme === "dark" ? "Light mode" : "Dark mode";

  return (
    <button className={`icon-button theme-toggle${variant ? ` theme-toggle-${variant}` : ""}`} style={{ ...styles.button, ...(variant === "menu" ? styles.menu : {}) }} type="button" onClick={toggleTheme} aria-label={label}>
      {theme === "dark" ? (
        <Sun size={20} strokeWidth={2.2} aria-hidden="true" />
      ) : (
        <Moon size={20} strokeWidth={2.2} aria-hidden="true" />
      )}
      {variant === "menu" ? <span>{label}</span> : null}
    </button>
  );
}