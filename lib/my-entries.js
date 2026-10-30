export function filterMyEntries(entries, { query, status, province, schoolLevel, decade, sort }) {
  const normalizedQuery = query.trim().toLowerCase();

  const filteredEntries = entries.filter((entry) => {
    const matchesQuery = !normalizedQuery || [entry.title, entry.image_description]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery);

    return matchesQuery
      && (!status || entry.status === status)
      && (!province || entry.province === province)
      && (!schoolLevel || entry.school_level === schoolLevel)
      && (!decade || Math.floor(entry.memory_year / 10) * 10 === Number(decade));
  });

  return sort === "oldest" ? filteredEntries.reverse() : filteredEntries;
}