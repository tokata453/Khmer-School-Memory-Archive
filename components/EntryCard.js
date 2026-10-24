import Link from "next/link";

export default function EntryCard({ entry, recordNumber, labels = { credit: "Shared by", open: "Open ↗", anonymous: "Anonymous" } }) {
  return (
    <article className="entry-card">
      <p className="entry-number">{String(recordNumber).padStart(2, "0")}</p>
      <div>
        <p className="record-kicker">{entry.school_level?.replace("_", " ")}</p>
        <h2 className="entry-title">
          <Link href={`/archive/${entry.slug}`}>{entry.title}</Link>
        </h2>
        <p className="entry-excerpt">{entry.image_description}</p>
        <p className="record-credit">{labels.credit} {entry.display_name || labels.anonymous}</p>
      </div>
      <div className="entry-meta">
        <span>{entry.province}</span>
        <span>{entry.memory_year}</span>
      </div>
      <div className="entry-action">
        <Link className="text-link" href={`/archive/${entry.slug}`}>
          {labels.open}
        </Link>
      </div>
    </article>
  );
}
