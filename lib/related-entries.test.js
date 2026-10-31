import assert from "node:assert/strict";
import test from "node:test";
import { getRelatedEntries } from "./related-entries.js";

const current = { slug: "current", status: "published", school_level: "primary_school", province: "Phnom Penh", memory_year: 2002 };

test("related entries rank shared metadata and fill four cards with newest published entries", () => {
  const entries = [
    current,
    { slug: "all", status: "published", school_level: "primary_school", province: "Phnom Penh", memory_year: 2004 },
    { slug: "level", status: "published", school_level: "primary_school", province: "Kampot", memory_year: 1994 },
    { slug: "pending", status: "pending", school_level: "primary_school", province: "Phnom Penh", memory_year: 2003 },
    { slug: "newest-one", status: "published", school_level: "university", province: "Kep", memory_year: 2020 },
    { slug: "newest-two", status: "published", school_level: "university", province: "Kep", memory_year: 2021 },
  ];

  const related = getRelatedEntries(current, entries);

  assert.deepEqual(related.map((entry) => entry.slug), ["all", "level", "newest-two", "newest-one"]);
  assert.equal(new Set(related.map((entry) => entry.slug)).size, related.length);
});

test("related entries return every available published entry when fewer than four exist", () => {
  const entries = [current, { slug: "one", status: "published", school_level: "university", province: "Kep", memory_year: 2021 }];

  assert.deepEqual(getRelatedEntries(current, entries).map((entry) => entry.slug), ["one"]);
});
