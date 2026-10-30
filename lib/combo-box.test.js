import test from "node:test";
import assert from "node:assert/strict";
import { filterComboBoxOptions } from "./combo-box.js";

const options = [{ value: "phnom-penh", label: "Phnom Penh" }, { value: "siem-reap", label: "សៀមរាប" }];

test("combo box filters English and Khmer option labels", () => {
  assert.deepEqual(filterComboBoxOptions(options, "PENH"), [options[0]]);
  assert.deepEqual(filterComboBoxOptions(options, "រាប"), [options[1]]);
  assert.deepEqual(filterComboBoxOptions(options, "  "), options);
});