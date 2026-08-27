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

const styles = {
  wrap: {
    maxWidth: 720,
    margin: "0 auto",
    padding: "80px 24px",
  },
  kicker: {
    fontFamily: "'Courier New', monospace",
    color: "#2EE6A8",
    fontSize: 14,
    letterSpacing: 1,
  },
  title: {
    fontSize: 48,
    fontWeight: 700,
    margin: "16px 0 12px",
    lineHeight: 1.1,
  },
  description: {
    fontSize: 18,
    color: "#97A1B3",
    lineHeight: 1.6,
    margin: 0,
  },
  card: {
    marginTop: 48,
    padding: 24,
    backgroundColor: "#1C222C",
    border: "1px solid #2E3644",
    borderRadius: 10,
  },
  cardLabel: {
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    color: "#97A1B3",
    margin: 0,
  },
  cardValue: {
    fontSize: 16,
    margin: "6px 0 0",
  },
  notice: {
    marginTop: 32,
    padding: 16,
    backgroundColor: "#26311F",
    border: "1px solid #526B34",
    borderRadius: 10,
    color: "#D7E8BE",
    fontSize: 14,
    lineHeight: 1.6,
  },
  count: {
    fontFamily: "'Courier New', monospace",
    fontSize: 14,
    color: "#2EE6A8",
    marginTop: 48,
  },
  footer: {
    marginTop: 64,
    paddingTop: 24,
    borderTop: "1px solid #2E3644",
    fontSize: 13,
    color: "#5A6373",
  },
};

export default function Home() {
  return (
    <main style={styles.wrap}>
      <p style={styles.kicker}>KHMER LIVING ARCHIVE</p>
      <h1 style={styles.title}>{collection.name}</h1>
      <p style={styles.description}>{collection.description}</p>

      <div style={styles.card}>
        <p style={styles.cardLabel}>CURATED BY</p>
        <p style={styles.cardValue}>{collection.curator}</p>
      </div>
      <div style={styles.card}>
        <p style={styles.cardLabel}>SOURCE</p>
        <p style={styles.cardValue}>{collection.source}</p>
      </div>

      <p style={styles.notice}>
        These two cards are temporary research-informed fictional demo profiles.
        They show the archive format and will be replaced with two real interview
        entries after fieldwork.
      </p>

      {entries.map((entry) => (
        <EntryCard key={entry.title} entry={entry} />
      ))}

      <p style={styles.count}>
        entries in the archive: {entries.length} (for now)
      </p>

      <footer style={styles.footer}>
        Built in ICT 340 — Vibe Coding, American University of Phnom Penh, Fall
        2026. This archive is under construction all semester. Come back in
        December.
      </footer>
    </main>
  );
}
