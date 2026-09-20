import collection from "../../collection.config.js";

export const metadata = {
  title: "About Project",
};

export default function AboutPage() {
  return (
    <main className="page-shell">
      <header className="page-hero compact-hero">
        <p className="eyebrow">About project</p>
        <h1>Why preserve school memories before digital learning?</h1>
        <p>{collection.description}</p>
      </header>

      <div className="about-stack">
        <section className="archive-panel">
          <h2>Purpose</h2>
          <p>
            Before smartphones and online learning, Cambodian students relied on
            teachers, textbooks, handwritten notes, classmates, family members,
            and memory. This archive preserves those learning experiences as
            part of Khmer educational history.
          </p>
        </section>

        <section className="process-grid" aria-label="How data is collected">
          {[
            "Interview people",
            "Record school memories",
            "Organize archive records",
            "Publish reviewed entries",
          ].map((step, index) => (
            <div key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{step}</p>
            </div>
          ))}
        </section>

        <section className="archive-panel">
          <h2>Research method</h2>
          <p>
            This is an interview-based oral history project. Records are written
            from memories shared by students, families, teachers, and community
            members, then organized for browsing and future review.
          </p>
        </section>

        <section className="archive-panel">
          <h2>Credits</h2>
          <p>
            Created by {collection.curator} for ICT 340 - Vibe Coding at the
            American University of Phnom Penh.
          </p>
          <p>Knowledge source: {collection.source}.</p>
        </section>
      </div>
    </main>
  );
}