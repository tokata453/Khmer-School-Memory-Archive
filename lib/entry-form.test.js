import test from "node:test";
import assert from "node:assert/strict";
import { entryFields, makeSlug, validateEntry } from "./entry-form.js";

const validValues = Object.fromEntries(entryFields.map(([name]) => [name, "ខ្មែរ school memory with enough detail"]));
const validPhoto = { type: "image/jpeg", size: 1024 };

test("entry validation enforces content and photo rules", () => {
  assert.deepEqual(validateEntry(validValues, validPhoto, true), {});
  assert.equal(validateEntry({ ...validValues, title: " ".repeat(2) }, validPhoto, true).title, "Title is required.");
  assert.match(validateEntry(validValues, { type: "application/pdf", size: 100 }, true).photo, /JPEG/);
  assert.match(validateEntry(validValues, { type: "image/png", size: 5 * 1024 * 1024 + 1 }, true).photo, /5 MB/);
  assert.match(makeSlug("សាលារៀន Khmer"), /^សាលារៀន-khmer-/);
});
