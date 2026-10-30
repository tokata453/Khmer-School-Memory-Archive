export function filterComboBoxOptions(options, query) {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  return normalizedQuery ? options.filter((option) => option.label.toLocaleLowerCase().includes(normalizedQuery)) : options;
}