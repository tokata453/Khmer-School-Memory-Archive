import assert from "node:assert/strict";
import test from "node:test";
import { sortArchiveEntries } from "./archive-browser.js";

test("archive sort reverses a copied oldest-first result for newest first", () => {
  const entries = [{ title: "Oldest" }, { title: "Newest" }];
  const sorted = sortArchiveEntries(entries, "newest");

  assert.deepEqual(sorted.map((entry) => entry.title), ["Newest", "Oldest"]);
  assert.deepEqual(entries.map((entry) => entry.title), ["Oldest", "Newest"]);
  assert.equal(sortArchiveEntries(entries, "oldest"), entries);
});