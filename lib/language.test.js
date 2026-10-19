import assert from "node:assert/strict";
import test from "node:test";
import { normalizeLanguage } from "./language.js";
import { getTranslation } from "./translations.js";

test("normalizeLanguage permits supported language codes only", () => {
  assert.equal(normalizeLanguage("km"), "km");
  assert.equal(normalizeLanguage("en"), "en");
  assert.equal(normalizeLanguage("fr"), "en");
  assert.equal(normalizeLanguage(undefined), "en");
});

test("getTranslation returns Khmer copy for Khmer", () => {
  assert.equal(getTranslation("km").header.archive, "បណ្ណសារ");
  assert.equal(getTranslation("km").auth.login, "ចូលគណនី");
  assert.equal(getTranslation("km").contributor.editTitle, "កែប្រែអនុស្សាវរីយ៍");
  assert.equal(getTranslation("km").detail.continue, "បន្តអាន");
  assert.equal(getTranslation("unknown").header.archive, "Archive");
});