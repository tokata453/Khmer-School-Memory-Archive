export const provinces = ["Banteay Meanchey", "Battambang", "Kampong Cham", "Kampong Chhnang", "Kampong Speu", "Kampong Thom", "Kampot", "Kandal", "Kep", "Koh Kong", "Kratie", "Mondulkiri", "Oddar Meanchey", "Pailin", "Phnom Penh", "Preah Vihear", "Preah Sihanouk", "Prey Veng", "Pursat", "Ratanakiri", "Siem Reap", "Stung Treng", "Svay Rieng", "Takeo", "Tboung Khmum"];

export const schoolLevels = [
  ["primary_school", "Primary school / បឋមសិក្សា"],
  ["secondary_school", "Secondary school / អនុវិទ្យាល័យ"],
  ["high_school", "High school / វិទ្យាល័យ"],
  ["university", "University / សាកលវិទ្យាល័យ"],
  ["other", "Other / ផ្សេងៗ"],
];

export const entryFields = [
  ["title", "Memory title / ចំណងជើងអនុស្សាវរីយ៍", 200, "input", true],
  ["image_description", "What does this image show? / តើរូបភាពនេះបង្ហាញអ្វី?", 500, "textarea", true, "Briefly describe people, place, object, or moment shown. / ពិពណ៌នាខ្លីអំពីមនុស្ស ទីកន្លែង វត្ថុ ឬព្រឹត្តិការណ៍ក្នុងរូបភាព។"],
  ["story", "What do you remember? / តើអ្នកចងចាំអ្វី?", 5000, "textarea", true, "Tell the story this image brings back. / សរសេររឿងរ៉ាវដែលរូបភាពនេះរំលឹកអ្នក។"],
  ["province", "Province / ខេត្ត ឬ រាជធានី", 0, "select", true],
  ["school_level", "School level / កម្រិតសិក្សា", 0, "select", true],
  ["memory_year", "Memory year / ឆ្នាំនៃអនុស្សាវរីយ៍", 4, "number", true, "Enter a whole year from 1900 through this year. / បញ្ចូលឆ្នាំជាលេខគត់ពី 1900 ដល់ឆ្នាំបច្ចុប្បន្ន។"],
  ["place_time_details", "More about when or where / ព័ត៌មានបន្ថែមអំពីពេលវេលា ឬទីកន្លែង", 200, "textarea", false, "Optional: school name, district, village, grade, season, or other detail. / ស្រេចចិត្ត៖ ឈ្មោះសាលា ស្រុក ភូមិ ថ្នាក់ រដូវ ឬព័ត៌មានផ្សេងទៀត។"],
  ["display_name", "Name to display / ឈ្មោះដែលបង្ហាញ", 120, "input", false, "Optional. Leave blank to appear as Anonymous. / ស្រេចចិត្ត។ ទុកទទេដើម្បីបង្ហាញជា អនាមិក។"],
];

const minimums = { image_description: 10, story: 20 };
const currentYear = new Date().getFullYear();

export function entryValues(entry) {
  entry ||= {};
  return Object.fromEntries(entryFields.map(([name]) => [name, entry[name] ?? ""]));
}

export function validateEntry(values, photo, photoRequired) {
  const errors = {};
  for (const [name, label, max, kind, required] of entryFields) {
    const value = String(values[name] ?? "").trim();
    if (required && !value) errors[name] = `${label} is required. / ត្រូវតែបំពេញ។`;
    else if (value && minimums[name] && value.length < minimums[name]) errors[name] = `${label} must be at least ${minimums[name]} characters. / ត្រូវមានយ៉ាងតិច ${minimums[name]} តួអក្សរ។`;
    else if (max && value.length > max) errors[name] = `${label} must be ${max} characters or fewer. / ត្រូវមានមិនលើសពី ${max} តួអក្សរ។`;
    else if (name === "province" && value && !provinces.includes(value)) errors[name] = "Choose a province in Cambodia. / សូមជ្រើសរើសខេត្ត ឬរាជធានីនៅកម្ពុជា។";
    else if (name === "school_level" && value && !schoolLevels.some(([key]) => key === value)) errors[name] = "Choose a school level. / សូមជ្រើសរើសកម្រិតសិក្សា។";
    else if (name === "memory_year" && value && (!/^\d{4}$/.test(value) || Number(value) < 1900 || Number(value) > currentYear)) errors[name] = `Enter a whole year from 1900 through ${currentYear}. / បញ្ចូលឆ្នាំជាលេខគត់ពី 1900 ដល់ ${currentYear}។`;
  }
  if (photoRequired && !photo) errors.photo = "An image is required for every memory. / ត្រូវតែមានរូបភាពសម្រាប់អនុស្សាវរីយ៍នីមួយៗ។";
  if (photo && !["image/jpeg", "image/png", "image/webp"].includes(photo.type)) {
    errors.photo = "Choose a JPEG, PNG, or WebP image. / សូមជ្រើសរើសរូបភាព JPEG, PNG ឬ WebP។";
  } else if (photo && photo.size > 5 * 1024 * 1024) {
    errors.photo = "Choose an image smaller than 5 MB. / សូមជ្រើសរើសរូបភាពតូចជាង 5 MB។";
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
