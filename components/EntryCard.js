import Link from "next/link";

const styles = {
  card: { display: "flex", flexDirection: "column", minWidth: 0 },
  imageLink: { display: "grid", height: "260px" },
  background: { position: "absolute", inset: 0, backgroundImage: "var(--entry-image)", backgroundPosition: "center", backgroundSize: "cover" },
  image: { position: "absolute", inset: 0, zIndex: 1, display: "block", width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%", objectFit: "contain", objectPosition: "center" },
  content: { display: "flex", flex: 1, flexDirection: "column", minWidth: 0 },
  catalog: { display: "flex", justifyContent: "space-between", gap: "12px" },
  title: { margin: "10px 0 0" },
  excerpt: { margin: "12px 0 0" },
  meta: { display: "flex", justifyContent: "space-between", gap: "12px", marginTop: "auto" },
};

export default function EntryCard({
  entry,
  labels = { credit: "Shared by", anonymous: "Anonymous" },
  form,
  statusLabel,
}) {
  const schoolLevel =
    form?.levels[entry.school_level] || entry.school_level?.replace("_", " ");
  const credit = statusLabel || `${labels.credit} ${entry.display_name || labels.anonymous}`;

  return (
    <article className="entry-card" style={styles.card}>
      {entry.photo_url ? (
        <Link
          className="entry-image-link"
          style={styles.imageLink}
          href={`/archive/${entry.slug}`}
        >
          <span className="entry-image-background" style={{ ...styles.background, "--entry-image": `url("${entry.photo_url}")` }} aria-hidden="true" />
          <img
            className="entry-image"
            style={styles.image}
            src={entry.photo_url}
            alt={entry.image_description || ""}
          />
        </Link>
      ) : null}
      <div className="entry-content" style={styles.content}>
        <div className="entry-catalog" style={styles.catalog}>
          <span>{schoolLevel}</span>
          <span>{entry.memory_year}</span>
        </div>
        <h2 className="entry-title" style={styles.title}>
          <Link href={`/archive/${entry.slug}`}>{entry.title}</Link>
        </h2>
        {entry.image_description ? (
          <p className="entry-excerpt" style={styles.excerpt}>
            {entry.image_description}
          </p>
        ) : null}
        <div className="entry-meta" style={styles.meta}>
          <span>{entry.province}</span>
          <span>{credit}</span>
        </div>
      </div>
    </article>
  );
}