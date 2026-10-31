import Link from "next/link";

export default function AboutClosing({ labels }) {
  return (
    <section className="about-closing" aria-labelledby="about-closing-heading">
      <div>
        <p className="home-section-kicker">{labels.kicker}</p>
        <h2 id="about-closing-heading">{labels.title}</h2>
        <p>{labels.body}</p>
      </div>
      <div className="about-closing-actions">
        <Link className="primary-link" href="/archive">{labels.browse}</Link>
        <Link className="secondary-link" href="/contribute">{labels.contribute}</Link>
      </div>
    </section>
  );
}
