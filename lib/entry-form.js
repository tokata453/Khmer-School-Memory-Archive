export const provinces = ["Banteay Meanchey", "Battambang", "Kampong Cham", "Kampong Chhnang", "Kampong Speu", "Kampong Thom", "Kampot", "Kandal", "Kep", "Koh Kong", "Kratie", "Mondulkiri", "Oddar Meanchey", "Pailin", "Phnom Penh", "Preah Vihear", "Preah Sihanouk", "Prey Veng", "Pursat", "Ratanakiri", "Siem Reap", "Stung Treng", "Svay Rieng", "Takeo", "Tboung Khmum", "Other"];

export const schoolLevels = [
  "primary_school",
  "secondary_school",
  "high_school",
  "university",
  "other",
];

export const entryFields = [
  ["title", 200, "input", true],
  ["image_description", 200, "input", true],
  ["story", 5000, "textarea", true],
  ["province", 0, "select", true],
  ["school_level", 0, "select", true],
  ["memory_year", 4, "number", true],
  ["place_time_details", 200, "textarea", false],
  ["display_name", 120, "input", false],
];

const minimums = { image_description: 10, story: 20 };
const currentYear = new Date().getFullYear();

export function entryValues(entry) {
  entry ||= {};
  return Object.fromEntries(entryFields.map(([name]) => [name, entry[name] ?? ""]));
}

export function validateEntry(values, photo, photoRequired, form) {
  const errors = {};
  for (const [name, max, kind, required] of entryFields) {
    const value = String(values[name] ?? "").trim();
    const label = form.fields[name];
    if (required && !value) errors[name] = form.errors.required.replace("{label}", label);
    else if (value && minimums[name] && value.length < minimums[name]) errors[name] = form.errors.minimum.replace("{label}", label).replace("{count}", minimums[name]);
    else if (max && value.length > max) errors[name] = form.errors.maximum.replace("{label}", label).replace("{count}", max);
    else if (name === "province" && value && !provinces.includes(value)) errors[name] = form.errors.province;
    else if (name === "school_level" && value && !schoolLevels.includes(value)) errors[name] = form.errors.schoolLevel;
    else if (name === "memory_year" && value && (!/^\d{4}$/.test(value) || Number(value) < 1900 || Number(value) > currentYear)) errors[name] = form.errors.memoryYear.replace("{year}", currentYear);
  }
  if (photoRequired && !photo) errors.photo = form.errors.photoRequired;
  if (photo && !["image/jpeg", "image/png", "image/webp"].includes(photo.type)) {
    errors.photo = form.errors.photoType;
  } else if (photo && photo.size > 5 * 1024 * 1024) {
    errors.photo = form.errors.photoSize;
  }
  return errors;
}

export function makeSlug(title) {
  const base = title.toLowerCase().normalize("NFC")
    .replace(/[^\p{L}\p{M}\p{N}]+/gu, "-").replace(/^-|-$/g, "").slice(0, 70);
  return `${base || "entry"}-${crypto.randomUUID().slice(0, 8)}`;
}

export function entryRedirectPath(entry) {
  return entry.status === "pending" ? "/contribute?submitted=1" : `/archive/${entry.slug}`;
}
