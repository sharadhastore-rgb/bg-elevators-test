export class InputError extends Error {}
export type FormState = {
  error?: string;
  success?: string;
  values?: Record<string, string>;
};
export const validId = (id: string) => /^[a-f\d]{24}$/i.test(id);
export const text = (data: FormData, key: string) =>
  typeof data.get(key) === "string" ? String(data.get(key)).trim() : "";
export function field(data: FormData, key: string, max = 256) {
  const result = text(data, key);
  if (result.length > max)
    throw new InputError(
      `${key === "adminNote" ? "Note" : key} must be ${max.toLocaleString()} characters or fewer.`,
    );
  return result;
}
export function person(data: FormData) {
  const name = field(data, "name"),
    email = field(data, "email").toLowerCase(),
    phone = field(data, "phone", 25);
  if (name.length < 2)
    throw new InputError("Enter a name with at least two characters.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    throw new InputError("Enter a valid email address.");
  if (!/^[+\d() .-]{7,25}$/.test(phone) || phone.replace(/\D/g, "").length < 7)
    throw new InputError("Enter a valid phone number.");
  return {
    name,
    email,
    phone,
    location: field(data, "location"),
    message: field(data, "message", 5000),
  };
}
export function choice(value: string, options: readonly string[]) {
  if (!options.includes(value)) throw new InputError("Choose a valid option.");
  return value;
}
export function password(data: FormData) {
  const result = String(data.get("password") || "");
  if (result.length < 10 || Buffer.byteLength(result, "utf8") > 72)
    throw new InputError(
      "Use at least 10 characters and at most 72 UTF-8 bytes for the password.",
    );
  return result;
}
