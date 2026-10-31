import { normalizeLanguage } from "./language.js";

export const profileImageTypes = ["image/jpeg", "image/png", "image/webp"];
export const profileImageMaximum = 2 * 1024 * 1024;

export function profileValues(metadata = {}) {
  return {
    userName: typeof metadata.user_name === "string" ? metadata.user_name : "",
    defaultEntryCredit: metadata.default_entry_credit === "anonymous" ? "anonymous" : "user_name",
    preferredLanguage: normalizeLanguage(metadata.preferred_language),
    avatarUrl: typeof metadata.avatar_url === "string" ? metadata.avatar_url : "",
  };
}

export function validateProfile(values, labels) {
  const userName = String(values.userName || "").trim();
  if (!userName) return { userName: labels.userNameRequired };
  if (userName.length > 120) return { userName: labels.userNameMaximum };
  if (!["user_name", "anonymous"].includes(values.defaultEntryCredit)) return { settings: labels.invalidSettings };
  if (!["en", "km"].includes(values.preferredLanguage)) return { settings: labels.invalidSettings };
  return {};
}

export function defaultDisplayName(metadata) {
  const values = profileValues(metadata);
  return values.defaultEntryCredit === "anonymous" ? "" : values.userName.trim();
}

export function entryCounts(entries) {
  return entries.reduce((counts, entry) => ({
    ...counts,
    total: counts.total + 1,
    [entry.status]: (counts[entry.status] || 0) + 1,
  }), { total: 0, pending: 0, published: 0, returned: 0 });
}

export function validateProfileImage(file, labels) {
  if (!file) return "";
  if (!profileImageTypes.includes(file.type)) return labels.photoType;
  if (file.size > profileImageMaximum) return labels.photoSize;
  return "";
}

export function ownPhotoPath(url, userId) {
  if (typeof url !== "string" || !userId) return "";
  const marker = "/storage/v1/object/public/photos/";
  const index = url.indexOf(marker);
  if (index < 0) return "";
  const path = decodeURIComponent(url.slice(index + marker.length));
  return path.startsWith(`${userId}/`) ? path : "";
}