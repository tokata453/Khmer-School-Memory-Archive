import Link from "next/link";

export default function EntryCard({ entry, recordNumber }) {
  return (
    <article className="entry-card">
      <p className="entry-number">{String(recordNumber).padStart(2, "0")}</p>
      <div>
        <p className="record-kicker">{entry.category}</p>
        <h2 className="entry-title">
          <Link href={`/archive/${entry.slug}`}>{entry.title}</Link>
        </h2>
        <p className="entry-excerpt">{entry.excerpt}</p>
      </div>
      <div className="entry-meta">
        <span>{entry.place}</span>
        <span>{entry.period}</span>
      </div>
      <div className="entry-action">
        <Link className="text-link" href={`/archive/${entry.slug}`}>
          Open ↗
        </Link>
      </div>
    </article>
  );
}
