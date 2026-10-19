import collection from "../collection.config.js";
import { getTranslation } from "../lib/translations.js";

export default function SiteFooter({ language }) {
  const t = getTranslation(language);

  return (
    <footer className="site-footer">
      <p>{t.footer.archive}</p>
      <p>
        {t.footer.curated} {collection.curator}. {t.footer.built}
      </p>
    </footer>
  );
}