export function filterMyEntries(entries, query, status) {
  const normalizedQuery = query.trim().toLowerCase();

  return entries.filter((entry) => {
    const matchesQuery = !normalizedQuery || [entry.title, entry.image_description]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery);

    return matchesQuery && (!status || entry.status === status);
  });
}