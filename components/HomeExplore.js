import Link from "next/link";

export default function HomeExplore({ levels, labels }) {
  if (!levels.length) return null;

  return (
    <section className="page-shell home-section home-explore" aria-labelledby="explore-heading">
      <div className="home-section-intro">
        <p className="home-section-kicker">{labels.kicker}</p>
        <h2 id="explore-heading">{labels.title}</h2>
        <p>{labels.body}</p>
      </div>
      <div className="home-explore-grid">
        {levels.map((level) => (
          <Link className="home-explore-link" href={`/archive?schoolLevel=${level.value}`} key={level.value}>
            <span>{level.label}</span>
            <strong>{labels.count.replace("{count}", level.count)}</strong>
          </Link>
        ))}
      </div>
    </section>
  );
}
