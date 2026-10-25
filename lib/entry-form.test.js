import test from "node:test";
import assert from "node:assert/strict";
import { entryFields, entryRedirectPath, entryValues, makeSlug, provinces, validateEntry } from "./entry-form.js";

const validValues = { title: "My school memory", image_description: "Students read books in a classroom.", story: "I remember sharing one textbook with my friend during class.", province: "Kampong Cham", school_level: "primary_school", memory_year: "2004", place_time_details: "", display_name: "" };
const validPhoto = { type: "image/jpeg", size: 1024 };

test("entry validation enforces content and photo rules", () => {
  assert.deepEqual(validateEntry(validValues, validPhoto, true), {});
  assert.match(validateEntry({ ...validValues, title: " ".repeat(2) }, validPhoto, true).title, /Memory title .* is required/);
  assert.match(validateEntry(validValues, { type: "application/pdf", size: 100 }, true).photo, /JPEG/);
  assert.match(validateEntry(validValues, { type: "image/png", size: 5 * 1024 * 1024 + 1 }, true).photo, /5 MB/);
  assert.match(makeSlug("សាលារៀន Khmer"), /^សាលារៀន-khmer-/);
});

test("entry validation limits approved values", () => {
  assert.equal(provinces.length, 25);
  assert.match(validateEntry({ ...validValues, province: "Outside Cambodia" }, validPhoto, true).province, /Cambodia/);
  assert.match(validateEntry({ ...validValues, school_level: "kindergarten" }, validPhoto, true).school_level, /school level/);
  assert.match(validateEntry({ ...validValues, memory_year: "1899" }, validPhoto, true).memory_year, /1900/);
  assert.match(validateEntry({ ...validValues, place_time_details: "a".repeat(201) }, validPhoto, true).place_time_details, /200/);
});

test("entry form values preserve structured fields from loaded entries", () => {
  const values = entryValues({ image_description: "Classroom", memory_year: 2002 });
  assert.equal(values.image_description, "Classroom");
  assert.equal(values.memory_year, 2002);
});

test("entry form values support an empty create form", () => {
  assert.deepEqual(entryValues(null), Object.fromEntries(entryFields.map(([name]) => [name, ""])));
});

test("pending entries return to contributor confirmation", () => {
  assert.equal(entryRedirectPath({ slug: "my-entry", status: "pending" }), "/contribute?submitted=1");
  assert.equal(entryRedirectPath({ slug: "my-entry", status: "published" }), "/archive/my-entry");
});
