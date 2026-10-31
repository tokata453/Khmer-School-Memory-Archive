import test from "node:test";
import assert from "node:assert/strict";
import { entryFields, entryHasChanges, entryRedirectPath, entryValues, makeSlug, provinces, validateEntry } from "./entry-form.js";
import { getTranslation } from "./translations.js";

const validValues = { title: "My school memory", image_description: "Students read books in a classroom.", story: "I remember sharing one textbook with my friend during class.", province: "Kampong Cham", school_level: "primary_school", memory_year: "2004", place_time_details: "", display_name: "" };
const validPhoto = { type: "image/jpeg", size: 1024 };
const englishForm = getTranslation("en").form;
const khmerForm = getTranslation("km").form;

test("entry validation enforces content and photo rules", () => {
  assert.deepEqual(validateEntry(validValues, validPhoto, true, englishForm), {});
  assert.match(validateEntry({ ...validValues, title: " ".repeat(2) }, validPhoto, true, englishForm).title, /Memory title is required/);
  assert.match(validateEntry(validValues, { type: "application/pdf", size: 100 }, true, englishForm).photo, /JPEG/);
  assert.match(validateEntry(validValues, { type: "image/png", size: 5 * 1024 * 1024 + 1 }, true, englishForm).photo, /5 MB/);
  assert.match(makeSlug("សាលារៀន Khmer"), /^សាលារៀន-khmer-/);
});

test("entry validation limits approved values", () => {
  assert.equal(provinces.length, 26);
  assert.match(validateEntry({ ...validValues, province: "Outside Cambodia" }, validPhoto, true, englishForm).province, /Cambodia/);
  assert.match(validateEntry({ ...validValues, school_level: "kindergarten" }, validPhoto, true, englishForm).school_level, /school level/);
  assert.match(validateEntry({ ...validValues, memory_year: "1899" }, validPhoto, true, englishForm).memory_year, /1900/);
  assert.match(validateEntry({ ...validValues, image_description: "a".repeat(201) }, validPhoto, true, englishForm).image_description, /200/);
  assert.match(validateEntry({ ...validValues, place_time_details: "a".repeat(201) }, validPhoto, true, englishForm).place_time_details, /200/);
});

test("entry validation uses selected Khmer copy", () => {
  assert.equal(validateEntry({ ...validValues, title: "" }, validPhoto, true, khmerForm).title, "ត្រូវតែបំពេញ ចំណងជើងអនុស្សាវរីយ៍។");
});

test("entry form values preserve structured fields from loaded entries", () => {
  const values = entryValues({ image_description: "Classroom", memory_year: 2002 });
  assert.equal(values.image_description, "Classroom");
  assert.equal(values.memory_year, 2002);
});

test("entry form values support an empty create form", () => {
  assert.deepEqual(entryValues(null), Object.fromEntries(entryFields.map(([name]) => [name, ""])));
});

test("entry form values prefill a new entry display name without replacing saved names", () => {
  assert.equal(entryValues(null, "Sokha").display_name, "Sokha");
  assert.equal(entryValues({ display_name: "Dara" }, "Sokha").display_name, "Dara");
});

test("entry changes compare form values and selected photos", () => {
  const originalValues = entryValues({ ...validValues, memory_year: 2004 });
  assert.equal(entryHasChanges({ ...originalValues, memory_year: "2004" }, originalValues, null), false);
  assert.equal(entryHasChanges({ ...originalValues, title: "Changed memory" }, originalValues, null), true);
  assert.equal(entryHasChanges(originalValues, originalValues, validPhoto), true);
  const createValues = entryValues(null, "Sokha");
  assert.equal(entryHasChanges(createValues, createValues, null), false);
  assert.equal(entryHasChanges({ ...createValues, story: "A new memory" }, createValues, null), true);
});

test("pending entries return to contributor confirmation", () => {
  assert.equal(entryRedirectPath({ slug: "my-entry", status: "pending" }), "/contribute?submitted=1");
  assert.equal(entryRedirectPath({ slug: "my-entry", status: "published" }), "/archive/my-entry");
});
