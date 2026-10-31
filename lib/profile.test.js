import assert from "node:assert/strict";
import test from "node:test";
import { defaultDisplayName, entryCounts, ownPhotoPath, profileHasChanges, profileValues, validateProfile, validateProfileImage } from "./profile.js";

const labels = { userNameRequired: "required", userNameMaximum: "maximum", invalidSettings: "invalid", photoType: "type", photoSize: "size" };

test("profile defaults preserve Khmer names and anonymous credit", () => {
  assert.equal(defaultDisplayName({ user_name: "សុខា" }), "សុខា");
  assert.equal(defaultDisplayName({ user_name: "Sokha", default_entry_credit: "anonymous" }), "");
  assert.deepEqual(profileValues({ preferred_language: "km" }).preferredLanguage, "km");
});

test("profile validation rejects invalid values and images", () => {
  assert.deepEqual(validateProfile({ userName: " ", defaultEntryCredit: "user_name", preferredLanguage: "en" }, labels), { userName: "required" });
  assert.deepEqual(validateProfile({ userName: "Sokha", defaultEntryCredit: "other", preferredLanguage: "en" }, labels), { settings: "invalid" });
  assert.equal(validateProfileImage({ type: "application/pdf", size: 1 }, labels), "type");
  assert.equal(validateProfileImage({ type: "image/jpeg", size: 2 * 1024 * 1024 + 1 }, labels), "size");
});

test("profile changes compare values, selected photos, and photo removal", () => {
  const originalValues = profileValues({ user_name: "Sokha" });
  assert.equal(profileHasChanges(originalValues, originalValues, null, false), false);
  assert.equal(profileHasChanges({ ...originalValues, userName: "Dara" }, originalValues, null, false), true);
  assert.equal(profileHasChanges(originalValues, originalValues, { type: "image/jpeg" }, false), true);
  assert.equal(profileHasChanges(originalValues, originalValues, null, true), true);
});

test("profile counts entries and only accepts owned photo paths", () => {
  assert.deepEqual(entryCounts([{ status: "pending" }, { status: "published" }, { status: "published" }, { status: "returned" }]), { total: 4, pending: 1, published: 2, returned: 1 });
  assert.equal(ownPhotoPath("https://x.supabase.co/storage/v1/object/public/photos/user-1/profile-a.webp", "user-1"), "user-1/profile-a.webp");
  assert.equal(ownPhotoPath("https://x.supabase.co/storage/v1/object/public/photos/user-2/profile-a.webp", "user-1"), "");
});