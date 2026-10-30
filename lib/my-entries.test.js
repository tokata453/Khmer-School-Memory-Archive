import assert from "node:assert/strict";
import test from "node:test";
import { filterMyEntries } from "./my-entries.js";

const entries = [
  { title: "Morning assembly", image_description: "Students in a courtyard", status: "published", province: "Kampong Cham", school_level: "primary_school", memory_year: 1992 },
  { title: "Library day", image_description: "Textbooks on a desk", status: "pending", province: "Phnom Penh", school_level: "university", memory_year: 2004 },
  { title: "Classroom", image_description: "Returned photograph", status: "returned", province: "Kampong Cham", school_level: "primary_school", memory_year: 1988 },
];

test("filterMyEntries combines search and record filters", () => {
  assert.deepEqual(filterMyEntries(entries, { query: "library", status: "", province: "", schoolLevel: "", decade: "", sort: "newest" }).map((entry) => entry.title), ["Library day"]);
  assert.deepEqual(filterMyEntries(entries, { query: "textbooks", status: "pending", province: "Phnom Penh", schoolLevel: "university", decade: "2000", sort: "newest" }).map((entry) => entry.title), ["Library day"]);
  assert.equal(filterMyEntries(entries, { query: "assembly", status: "pending", province: "", schoolLevel: "", decade: "", sort: "newest" }).length, 0);
});

test("filterMyEntries reverses a copied result for oldest first", () => {
  assert.deepEqual(filterMyEntries(entries, { query: "", status: "", province: "Kampong Cham", schoolLevel: "primary_school", decade: "", sort: "oldest" }).map((entry) => entry.title), ["Classroom", "Morning assembly"]);
  assert.deepEqual(entries.map((entry) => entry.title), ["Morning assembly", "Library day", "Classroom"]);
});