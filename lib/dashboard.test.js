import assert from "node:assert/strict";
import test from "node:test";
import { dashboardCounts, filterDashboardEntries } from "./dashboard-utils.js";

const entries = [
  { title: "Khmer school memory", display_name: "Sokha", image_description: "Notebook", status: "pending", province: "Takeo", school_level: "primary_school" },
  { title: "Classroom story", display_name: "Dara", image_description: "Chalkboard", status: "published", province: "Kampot", school_level: "high_school" },
];

test("dashboard counts group entry statuses", () => {
  assert.deepEqual(dashboardCounts(entries), { pending: 1, published: 1, returned: 0 });
});

test("dashboard filters search and archive metadata", () => {
  assert.deepEqual(filterDashboardEntries(entries, { query: "sokha", province: "Takeo" }), [entries[0]]);
  assert.deepEqual(filterDashboardEntries(entries, { status: "published", schoolLevel: "high_school" }), [entries[1]]);
});
