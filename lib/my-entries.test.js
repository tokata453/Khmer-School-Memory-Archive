import assert from "node:assert/strict";
import test from "node:test";
import { filterMyEntries } from "./my-entries.js";

const entries = [
  { title: "Morning assembly", image_description: "Students in a courtyard", status: "published" },
  { title: "Library day", image_description: "Textbooks on a desk", status: "pending" },
  { title: "Classroom", image_description: "Returned photograph", status: "returned" },
];

test("filterMyEntries matches title, description, and status together", () => {
  assert.deepEqual(filterMyEntries(entries, "library", "").map((entry) => entry.title), ["Library day"]);
  assert.deepEqual(filterMyEntries(entries, "photograph", "").map((entry) => entry.title), ["Classroom"]);
  assert.deepEqual(filterMyEntries(entries, "textbooks", "pending").map((entry) => entry.title), ["Library day"]);
  assert.equal(filterMyEntries(entries, "assembly", "pending").length, 0);
});