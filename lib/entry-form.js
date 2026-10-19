export const entryFields = [
  ["title", "Title / ចំណងជើង", 200, "input"],
  ["category", "Topic / ប្រធានបទ", 120, "input"],
  ["contributor", "Interviewee / អ្នកផ្តល់បទសម្ភាសន៍", 120, "input"],
  ["place", "Location / ទីតាំង", 120, "input"],
  ["period", "Period / អំឡុងពេល", 120, "input"],
  ["featured_object", "Featured object / វត្ថុសំខាន់", 500, "textarea"],
  ["excerpt", "Short summary / សេចក្តីសង្ខេបខ្លី", 500, "textarea"],
  ["memory", "Story / រឿងរ៉ាវ", 5000, "textarea"],
  ["learning_method", "Learning without internet / ការសិក្សាដោយគ្មានអ៊ីនធឺណិត", 5000, "textarea"],
  ["reflection", "Looking back / ការរំលឹកឡើងវិញ", 5000, "textarea"],
];

const minimums = { excerpt: 20, memory: 20, learning_method: 20, reflection: 20 };

export function entryValues(entry = {}) {
  return Object.fromEntries(entryFields.map(([name]) => [name,
    entry[name] || (name === "featured_object" ? entry.featuredObject : name === "learning_method" ? entry.learningMethod : ""),
  ]));
}

export function validateEntry(values, photo, photoRequired) {
  const errors = {};
  for (const [name, label, max] of entryFields) {
    const value = values[name]?.trim() || "";
    const min = minimums[name] || 1;
    if (!value) errors[name] = `${label} is required. / ត្រូវតែបំពេញ។`;
    else if (value.length < min) errors[name] = `${label} must be at least ${min} characters. / ត្រូវមានយ៉ាងតិច ${min} តួអក្សរ។`;
    else if (value.length > max) errors[name] = `${label} must be ${max} characters or fewer. / ត្រូវមានមិនលើសពី ${max} តួអក្សរ។`;
  }
  if (photoRequired && !photo) errors.photo = "Photo is required. / ត្រូវតែមានរូបថត។";
  if (photo && !["image/jpeg", "image/png", "image/webp"].includes(photo.type)) {
    errors.photo = "Choose a JPEG, PNG, or WebP photo. / សូមជ្រើសរើសរូបថត JPEG, PNG ឬ WebP។";
  } else if (photo && photo.size > 5 * 1024 * 1024) {
    errors.photo = "Choose a photo smaller than 5 MB. / សូមជ្រើសរើសរូបថតតូចជាង 5 MB។";
  }
  return errors;
}

export function makeSlug(title) {
  const base = title.toLowerCase().normalize("NFC")
    .replace(/[^\p{L}\p{M}\p{N}]+/gu, "-").replace(/^-|-$/g, "").slice(0, 70);
  return `${base || "entry"}-${crypto.randomUUID().slice(0, 8)}`;
}
