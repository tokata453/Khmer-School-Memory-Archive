import collection from "../collection.config.js";
import EntryCard from "../components/EntryCard.js";

// Research-informed fictional demo entries. Replace both profiles with
// approved notes from two real interviews before the final submission.
const entries = [
  {
    title: "Learning From One Shared Textbook",
    category: "Learning Materials",
    contributor: "Sokha - fictional demo profile",
    place: "Kampong Cham Province",
    period: "1984-1988",
    featuredObject:
      "A Khmer-language textbook shared among several students and a handwritten exercise notebook.",
    memory:
      "During lessons, students followed the teacher's writing on the chalkboard and copied everything carefully into their notebooks. When there were not enough books, classmates sat together and took turns reading from the same textbook. Missing a lesson was difficult because the notebook was often the only complete record a student could use at home.",
    learningMethod:
      "Information came mainly from teachers, textbooks, older relatives, and classmates. Examination preparation involved rereading handwritten notes, copying exercises again, memorizing important passages, and reciting answers with friends.",
    reflection:
      "Digital tools make information easier to find today, but students should remember the patience, cooperation, and respect for learning materials that earlier students needed.",
    isDemo: true,
  },
  {
    title: "The Journey to Secondary School",
    category: "Student Stories",
    contributor: "Srey Mom - fictional demo profile",
    place: "Siem Reap Province",
    period: "2001-2006",
    featuredObject:
      "A collection of handwritten lesson notes and an old examination paper kept after leaving school.",
    memory:
      "Reaching secondary school required traveling from the village each morning. In class, the teacher explained lessons orally and used chalkboard diagrams while students copied the information. After school, classmates sometimes reviewed difficult exercises together because books and other sources of information were limited.",
    learningMethod:
      "Students depended on classroom explanations, printed textbooks, borrowed study books, and help from classmates. They prepared for examinations by reviewing notebooks, practicing previous exercises, and asking teachers to explain topics they did not understand.",
    reflection:
      "Students now have quick access to videos, search engines, and AI, but technology should support careful study rather than replace discussion, practice, and help from teachers.",
    isDemo: true,
  },
];

export default function Home() {
  return (
    <main className="page-shell">
      <header className="archive-hero">
        <p className="eyebrow">Khmer Living Archive / Field Notebook</p>
        <h1 className="archive-title">{collection.name}</h1>
        <p className="archive-description">{collection.description}</p>

        <div className="archive-meta" aria-label="Archive details">
          <div className="meta-card">
            <p className="meta-label">Curated by</p>
            <p className="meta-value">{collection.curator}</p>
          </div>
          <div className="meta-card">
            <p className="meta-label">Source</p>
            <p className="meta-value">{collection.source}</p>
          </div>
          <div className="meta-card">
            <p className="meta-label">Records</p>
            <p className="meta-value">{entries.length} prototype entries</p>
          </div>
        </div>
      </header>

      <aside className="fieldwork-notice">
        <p className="notice-label">Fieldwork status</p>
        <p className="notice-text">
          These two cards are temporary research-informed fictional demo profiles.
          They show the archive format and will be replaced with two real
          interview entries after fieldwork.
        </p>
      </aside>

      <section className="entries-list" aria-label="Archive entries">
        {entries.map((entry, index) => (
          <EntryCard key={entry.title} entry={entry} recordNumber={index + 1} />
        ))}
      </section>

      <footer className="archive-footer">
        <p className="footer-note">
          Built in ICT 340 - Vibe Coding, American University of Phnom Penh,
          Fall 2026. This archive is under construction all semester.
        </p>
      </footer>
    </main>
  );
}
