import Link from "next/link";

export default function HomeInvitation({ labels }) {
  return (
    <section className="page-shell home-invitation" aria-labelledby="invitation-heading">
      <div>
        <p className="home-section-kicker">{labels.kicker}</p>
        <h2 id="invitation-heading">{labels.title}</h2>
        <p>{labels.body}</p>
      </div>
      <div className="home-invitation-actions">
        <Link className="primary-link" href="/contribute">{labels.contribute}</Link>
        <Link className="secondary-link" href="/about">{labels.about}</Link>
      </div>
    </section>
  );
}
