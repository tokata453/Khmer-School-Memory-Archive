import collection from "../collection.config.js";
import { getTranslation } from "../lib/translations.js";

const styles = { footer: { width: "var(--layout-wide)", margin: "80px auto 0", display: "grid", gridTemplateColumns: "0.35fr 1fr", gap: "40px", padding: "20px 0 36px", borderTop: "2px solid var(--carbon)", color: "var(--muted)", fontFamily: "var(--font-interface)", fontSize: "0.82rem" }, text: { margin: 0 }, lastText: { textAlign: "right" } };

export default function SiteFooter({ language }) {
  const t = getTranslation(language);

  return (
    <footer className="site-footer" style={styles.footer}>
      <p style={styles.text}>{t.footer.archive}</p>
      <p style={{ ...styles.text, ...styles.lastText }}>
        {t.footer.curated} {collection.curator}. {t.footer.built}
      </p>
    </footer>
  );
}