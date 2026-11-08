export function dashboardCounts(entries) {
  return entries.reduce((counts, entry) => ({
    ...counts,
    [entry.status]: (counts[entry.status] || 0) + 1,
  }), { pending: 0, published: 0, returned: 0 });
}

export function filterDashboardEntries(entries, { query = "", status = "", province = "", schoolLevel = "", sort = "oldest" }) {
  const text = query.trim().toLowerCase();
  const filtered = entries.filter((entry) => (!text || [entry.title, entry.display_name, entry.image_description].join(" ").toLowerCase().includes(text))
    && (!status || entry.status === status)
    && (!province || entry.province === province)
    && (!schoolLevel || entry.school_level === schoolLevel));
  return sort === "newest" ? [...filtered].reverse() : filtered;
}
