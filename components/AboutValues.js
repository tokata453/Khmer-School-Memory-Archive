export default function AboutValues({ labels }) {
  return (
    <section className="about-section about-values" aria-labelledby="values-heading">
      <div className="about-section-intro">
        <p className="home-section-kicker">{labels.kicker}</p>
        <h2 id="values-heading">{labels.title}</h2>
        <p>{labels.body}</p>
      </div>
      <div className="about-values-grid">
        {labels.items.map((item) => (
          <article key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
