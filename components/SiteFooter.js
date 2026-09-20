import collection from "../collection.config.js";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>KM / Oral History Archive</p>
      <p>
        Curated by {collection.curator}. Built in ICT 340 - Vibe Coding,
        American University of Phnom Penh, Fall 2026.
      </p>
    </footer>
  );
}