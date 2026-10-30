import Link from "next/link";

const styles = {
  card: { display: "grid", gridTemplateColumns: "70px 220px minmax(0, 1fr) 90px", gap: "24px", padding: "22px 0", borderBottom: "1px solid var(--rule)" },
  cardWithoutImage: { gridTemplateColumns: "70px minmax(0, 1fr) 90px" },
  number: { margin: 0, color: "var(--vermilion)", fontFamily: "var(--font-display)", fontSize: "calc(var(--text-section) * 1.15)", lineHeight: 0.85, letterSpacing: ".02em" },
  imageLink: { display: "block", aspectRatio: "4 / 3", background: "var(--paper)", border: "1px solid var(--rule)", padding: "4px" },
  image: { display: "block", width: "100%", height: "100%", objectFit: "cover" },
  content: { minWidth: 0 }, title: { margin: "8px 0 0", fontSize: "var(--text-section)", fontWeight: 600, lineHeight: 1, letterSpacing: "-0.02em" },
  excerpt: { maxWidth: "690px", margin: "14px 0 0" }, meta: { display: "flex", flexWrap: "wrap", gap: "4px 14px", marginTop: "12px", alignContent: "flex-start", color: "var(--indigo)", fontFamily: "var(--font-interface)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.045em", textTransform: "uppercase" },
  action: { alignSelf: "start", textAlign: "right" }, textLink: { color: "var(--carbon)", borderBottom: "2px solid var(--carbon)", fontFamily: "var(--font-interface)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.045em", textTransform: "uppercase", textDecoration: "none" },
};

export default function EntryCard({ entry, recordNumber, labels = { credit: "Shared by", open: "Open ↗", anonymous: "Anonymous" }, form }) {
  return (
    <article className="entry-card" style={{ ...styles.card, ...(entry.photo_url ? {} : styles.cardWithoutImage) }}>
      <p className="entry-number" style={styles.number}>{String(recordNumber).padStart(2, "0")}</p>
      {entry.photo_url ? (
        <Link className="entry-image-link" style={styles.imageLink} href={`/archive/${entry.slug}`}>
          <img className="entry-image" style={styles.image} src={entry.photo_url} alt={entry.image_description} />
        </Link>
      ) : null}
      <div className="entry-content" style={styles.content}>
        <p className="record-kicker">{form?.levels[entry.school_level] || entry.school_level?.replace("_", " ")} · {entry.memory_year}</p>
        <h2 className="entry-title" style={styles.title}>
          <Link href={`/archive/${entry.slug}`}>{entry.title}</Link>
        </h2>
        <p className="entry-excerpt" style={styles.excerpt}>{entry.image_description}</p>
        <div className="entry-meta" style={styles.meta}>
          <span>{entry.province}</span>
          <span>{labels.credit} {entry.display_name || labels.anonymous}</span>
        </div>
      </div>
      <div className="entry-action" style={styles.action}>
        <Link className="text-link" style={styles.textLink} href={`/archive/${entry.slug}`}>
          {labels.open}
        </Link>
      </div>
    </article>
  );
}
