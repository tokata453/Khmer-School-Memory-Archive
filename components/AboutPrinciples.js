export default function AboutPrinciples({ labels }) {
  return (
    <section className="about-section about-principles" aria-labelledby="principles-heading">
      <div className="about-section-intro">
        <p className="home-section-kicker">{labels.kicker}</p>
        <h2 id="principles-heading">{labels.title}</h2>
        <p>{labels.body}</p>
      </div>
      <ul>
        {labels.items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </section>
  );
}
