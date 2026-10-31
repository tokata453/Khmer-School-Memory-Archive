import assert from "node:assert/strict";
import test from "node:test";
import { safeNextPath } from "./auth.js";

test("safeNextPath permits internal routes only", () => {
  assert.equal(safeNextPath("/contribute"), "/contribute");
  assert.equal(safeNextPath("/archive?q=school"), "/archive?q=school");
  assert.equal(safeNextPath("https://attacker.example"), "/");
  assert.equal(safeNextPath("//attacker.example"), "/");
  assert.equal(safeNextPath("/\\attacker.example"), "/");
});