"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
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
    <button className="icon-button theme-toggle" type="button" onClick={toggleTheme} aria-label={label}>
      {theme === "dark" ? (
        <Sun size={20} strokeWidth={2.2} aria-hidden="true" />
      ) : (
        <Moon size={20} strokeWidth={2.2} aria-hidden="true" />
      )}
    </button>
  );
}