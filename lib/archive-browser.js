export function sortArchiveEntries(entries, sort) {
  return sort === "newest" ? [...entries].reverse() : entries;
}