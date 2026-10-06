export function plain<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}
const options = { timeZone: "Asia/Kolkata" };
export function dateTime(value: string | Date) {
  return new Intl.DateTimeFormat("en-IN", {
    ...options,
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
export function shortDate(value: string | Date) {
  return new Intl.DateTimeFormat("en-IN", {
    ...options,
    dateStyle: "medium",
  }).format(new Date(value));
}
export function initials(name = "") {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((x) => x[0])
      .join("")
      .toUpperCase() || "BG"
  );
}
export function safeUrl(value?: string) {
  try {
    const url = new URL(value || "");
    return ["http:", "https:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}
