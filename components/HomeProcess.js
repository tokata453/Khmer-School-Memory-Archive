import Link from "next/link";

export default function HomeProcess({ labels }) {
  return (
    <section className="page-shell home-section home-process" aria-labelledby="process-heading">
      <div className="home-section-intro">
        <p className="home-section-kicker">{labels.kicker}</p>
        <h2 id="process-heading">{labels.title}</h2>
        <p>{labels.body}</p>
      </div>
      <ol className="home-process-list">
        {labels.steps.map((step, index) => (
          <li key={step.title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </li>
        ))}
      </ol>
      <Link className="primary-link home-action-link" href="/contribute">{labels.action}</Link>
    </section>
  );
}
