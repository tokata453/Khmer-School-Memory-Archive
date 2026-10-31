export function safeNextPath(value) {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//") && !value.includes("\\") ? value : "/";
}