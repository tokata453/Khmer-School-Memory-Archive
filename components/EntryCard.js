import Link from "next/link";

const styles = {
  card: { display: "flex", flexDirection: "column", minWidth: 0, background: "var(--paper)", border: "1px solid var(--rule)" },
  imageLink: { display: "block", aspectRatio: "16 / 10", background: "var(--concrete)", borderBottom: "1px solid var(--rule)" },
  image: { display: "block", width: "100%", height: "100%", objectFit: "cover" },
  content: { display: "flex", flex: 1, flexDirection: "column", minWidth: 0, padding: "20px" },
  title: { margin: "8px 0 0", fontFamily: "var(--font-display)", fontSize: "var(--text-section)", fontWeight: 800, lineHeight: .9, letterSpacing: ".01em" },
  excerpt: { margin: "14px 0 0", color: "var(--muted)", lineHeight: 1.55 },
  meta: { display: "flex", flexWrap: "wrap", gap: "4px 14px", marginTop: "auto", paddingTop: "18px", color: "var(--indigo)", fontFamily: "var(--font-interface)", fontSize: "var(--text-label)", fontWeight: 700, letterSpacing: "0.045em", textTransform: "uppercase" },
};

export default function EntryCard({ entry, labels = { credit: "Shared by", anonymous: "Anonymous" }, form, statusLabel }) {
  return (
    <article className="entry-card" style={styles.card}>
      {entry.photo_url ? (
        <Link className="entry-image-link" style={styles.imageLink} href={`/archive/${entry.slug}`}>
          <img className="entry-image" style={styles.image} src={entry.photo_url} alt={entry.image_description || ""} />
        </Link>
      ) : null}
      <div className="entry-content" style={styles.content}>
        <p className="record-kicker">{form?.levels[entry.school_level] || entry.school_level?.replace("_", " ")} · {entry.memory_year}</p>
        <h2 className="entry-title" style={styles.title}>
          <Link href={`/archive/${entry.slug}`}>{entry.title}</Link>
        </h2>
        {entry.image_description ? <p className="entry-excerpt" style={styles.excerpt}>{entry.image_description}</p> : null}
        <div className="entry-meta" style={styles.meta}>
          <span>{entry.province}</span>
          <span>{statusLabel || `${labels.credit} ${entry.display_name || labels.anonymous}`}</span>
        </div>
      </div>
    </article>
  );
}