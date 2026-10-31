function decade(year) {
  const value = Number(year);
  return Number.isInteger(value) ? Math.floor(value / 10) * 10 : null;
}

function relevance(entry, candidate) {
  let score = 0;
  if (entry.school_level && entry.school_level === candidate.school_level) score += 4;
  if (entry.province && entry.province === candidate.province) score += 2;
  if (decade(entry.memory_year) !== null && decade(entry.memory_year) === decade(candidate.memory_year)) score += 1;
  return score;
}

export function getRelatedEntries(entry, entries, limit = 4) {
  const published = entries.filter((candidate) => candidate.status === "published" && candidate.slug !== entry.slug);
  const ranked = published
    .map((candidate, index) => ({ candidate, index, score: relevance(entry, candidate) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || b.index - a.index)
    .map(({ candidate }) => candidate);
  const selected = ranked.slice(0, limit);
  const selectedSlugs = new Set(selected.map((candidate) => candidate.slug));

  for (const candidate of [...published].reverse()) {
    if (selected.length === limit) break;
    if (!selectedSlugs.has(candidate.slug)) selected.push(candidate);
  }

  return selected;
}
