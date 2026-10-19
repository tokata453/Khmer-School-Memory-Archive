"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTranslation } from "../lib/translations.js";
import { normalizeLanguage } from "../lib/language.js";

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
    <div className="language-toggle" role="group" aria-label={t.header.language}>
      <button type="button" aria-pressed={selectedLanguage === "en"} onClick={() => selectLanguage("en")}>
        EN
      </button>
      <button type="button" lang="km" aria-pressed={selectedLanguage === "km"} onClick={() => selectLanguage("km")}>
        ខ្មែរ
      </button>
    </div>
  );
}