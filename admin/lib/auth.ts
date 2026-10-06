import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { connectDb } from "./db";
import { Admin } from "./models";
const cookieName = "bg_admin_session";
const maxAge = 60 * 60 * 8;
const secret = () => process.env.SESSION_SECRET || "";
function signature(value: string) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}
export type AdminSession = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "staff" | "viewer";
  expires: number;
  sessionVersion?: number;
};
export function createSessionValue(account: Omit<AdminSession, "expires">) {
  if (secret().length < 32 || secret().includes("replace-with"))
    throw new Error("Set a random SESSION_SECRET of at least 32 characters.");
  const payload = Buffer.from(
    JSON.stringify({ ...account, expires: Date.now() + maxAge * 1000 }),
  ).toString("base64url");
  return `${payload}.${signature(payload)}`;
}
function verify(value?: string): AdminSession | null {
  if (!value || secret().length < 32) return null;
  const parts = value.split(".");
  if (parts.length !== 2) return null;
  const [payload, supplied] = parts,
    expected = signature(payload);
  const a = Buffer.from(supplied),
    b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    return /^[a-f\d]{24}$/i.test(data.id) &&
      Number.isFinite(data.expires) &&
      data.expires > Date.now()
      ? data
      : null;
  } catch {
    return null;
  }
}
export async function setSession(account: Omit<AdminSession, "expires">) {
  (await cookies()).set(cookieName, createSessionValue(account), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
}
export async function clearSession() {
  (await cookies()).delete(cookieName);
}
export const getSession = cache(async (): Promise<AdminSession | null> => {
  const signed = verify((await cookies()).get(cookieName)?.value);
  if (!signed) return null;
  await connectDb();
  const account = (await Admin.findById(signed.id)
    .select("name email role active sessionVersion")
    .lean()) as any;
  if (
    !account ||
    account.active === false ||
    (account.sessionVersion || 0) !== (signed.sessionVersion || 0)
  )
    return null;
  return {
    ...signed,
    name: account.name,
    email: account.email,
    role: account.role || "admin",
  };
});
export async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}
export async function requireRole(roles: AdminSession["role"][]) {
  const session = await requireAdmin();
  if (!roles.includes(session.role)) redirect("/admin?denied=1");
  return session;
}
