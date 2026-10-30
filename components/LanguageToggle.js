"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTranslation } from "../lib/translations.js";
import { normalizeLanguage } from "../lib/language.js";

const styles = { toggle: { display: "inline-flex", minHeight: "40px", overflow: "hidden", border: "1px solid var(--rule)", borderRadius: 0, background: "var(--paper)", fontFamily: "var(--font-interface)", fontSize: "0.72rem", fontWeight: 800 }, button: { minHeight: "38px", border: 0, padding: "0 10px", background: "transparent", color: "var(--carbon)", font: "inherit", cursor: "pointer" }, secondButton: { borderLeft: "1px solid var(--rule)" }, active: { background: "var(--carbon)", color: "var(--paper)" } };

export default function LanguageToggle({ language = "en" }) {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState(normalizeLanguage(language));
  const t = getTranslation(selectedLanguage);

  useEffect(() => {
    setSelectedLanguage(normalizeLanguage(language));
  }, [language]);

  function selectLanguage(nextLanguage) {
    const normalizedLanguage = normalizeLanguage(nextLanguage);
    if (normalizedLanguage === selectedLanguage) return;

    document.cookie = `language=${normalizedLanguage}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.lang = normalizedLanguage;
    setSelectedLanguage(normalizedLanguage);
    router.refresh();
  }

  return (
    <div className="language-toggle" style={styles.toggle} role="group" aria-label={t.header.language}>
      <button style={{ ...styles.button, ...(selectedLanguage === "en" ? styles.active : {}) }} type="button" aria-pressed={selectedLanguage === "en"} onClick={() => selectLanguage("en")}>
        EN
      </button>
      <button style={{ ...styles.button, ...styles.secondButton, ...(selectedLanguage === "km" ? styles.active : {}) }} type="button" lang="km" aria-pressed={selectedLanguage === "km"} onClick={() => selectLanguage("km")}>
        ខ្មែរ
      </button>
    </div>
  );
}