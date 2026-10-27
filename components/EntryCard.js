import Link from "next/link";

export default function EntryCard({ entry, recordNumber, labels = { credit: "Shared by", open: "Open ↗", anonymous: "Anonymous" } }) {
  return (
    <article className={`entry-card${entry.photo_url ? "" : " entry-card-no-image"}`}>
      <p className="entry-number">{String(recordNumber).padStart(2, "0")}</p>
      {entry.photo_url ? (
        <Link className="entry-image-link" href={`/archive/${entry.slug}`}>
          <img className="entry-image" src={entry.photo_url} alt={entry.image_description} />
        </Link>
      ) : null}
      <div className="entry-content">
        <p className="record-kicker">{entry.school_level?.replace("_", " ")} · {entry.memory_year}</p>
        <h2 className="entry-title">
          <Link href={`/archive/${entry.slug}`}>{entry.title}</Link>
        </h2>
        <p className="entry-excerpt">{entry.image_description}</p>
        <div className="entry-meta">
          <span>{entry.province}</span>
          <span>{labels.credit} {entry.display_name || labels.anonymous}</span>
        </div>
      </div>
      <div className="entry-action">
        <Link className="text-link" href={`/archive/${entry.slug}`}>
          {labels.open}
        </Link>
      </div>
    </article>
  );
}
