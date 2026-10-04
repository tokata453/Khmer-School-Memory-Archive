export const entryFields = [
  ["title", "Title", 200, "input"],
  ["category", "Topic", 120, "input"],
  ["contributor", "Interviewee", 120, "input"],
  ["place", "Location", 120, "input"],
  ["period", "Period", 120, "input"],
  ["featured_object", "Featured object", 500, "textarea"],
  ["excerpt", "Short summary", 500, "textarea"],
  ["memory", "Story", 5000, "textarea"],
  ["learning_method", "Learning without internet", 5000, "textarea"],
  ["reflection", "Looking back", 5000, "textarea"],
];

const minimums = { excerpt: 20, memory: 20, learning_method: 20, reflection: 20 };

export function validateEntry(values, photo, photoRequired) {
  const errors = {};
  for (const [name, label, max] of entryFields) {
    const value = values[name]?.trim() || "";
    const min = minimums[name] || 1;
    if (!value) errors[name] = `${label} is required.`;
    else if (value.length < min) errors[name] = `${label} must be at least ${min} characters.`;
    else if (value.length > max) errors[name] = `${label} must be ${max} characters or fewer.`;
  }
  if (photoRequired && !photo) errors.photo = "Photo is required.";
  if (photo && !["image/jpeg", "image/png", "image/webp"].includes(photo.type)) {
    errors.photo = "Choose a JPEG, PNG, or WebP photo.";
  } else if (photo && photo.size > 5 * 1024 * 1024) {
    errors.photo = "Choose a photo smaller than 5 MB.";
  }
  return errors;
}

export function makeSlug(title) {
  const base = title.toLowerCase().normalize("NFC")
    .replace(/[^\p{L}\p{M}\p{N}]+/gu, "-").replace(/^-|-$/g, "").slice(0, 70);
  return `${base || "entry"}-${crypto.randomUUID().slice(0, 8)}`;
}
