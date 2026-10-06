"use server";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { clearSession, requireAdmin, requireRole, setSession } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { Admin, Brochure } from "@/lib/models";
import {
  addLead,
  addTeamMember,
  changeTeamAccess,
  editRecord,
  removeRecord,
  resetPassword,
  setNote,
  setFavorite,
  setStatus,
} from "@/lib/mutations";
import { InputError, type FormState, text } from "@/lib/validation";
const attempts = new Map<string, { count: number; until: number }>();
function message(error: unknown) {
  return error instanceof InputError
    ? error.message
    : "Unable to save this change. Please try again.";
}
function refresh() {
  revalidatePath("/admin", "layout");
}
function values(data: FormData) {
  return Object.fromEntries(
    Array.from(data.entries())
      .filter(
        ([key, value]) =>
          typeof value === "string" &&
          key !== "password" &&
          !key.startsWith("$ACTION"),
      )
      .map(([key, value]) => [key, String(value)]),
  );
}
export async function loginAction(
  _: FormState,
  data: FormData,
): Promise<FormState> {
  const email = text(data, "email").toLowerCase(),
    password = String(data.get("password") || "");
  if (
    !email ||
    email.length > 256 ||
    !password ||
    Buffer.byteLength(password) > 72
  )
    return { error: "Incorrect email or password." };
  const now = Date.now();
  for (const [key, attempt] of attempts)
    if (attempt.until < now) attempts.delete(key);
  const attempt = attempts.get(email) || {
    count: 0,
    until: now + 15 * 60 * 1000,
  };
  if (attempt.count >= 8)
    return {
      error: "Too many sign-in attempts. Please try again in 15 minutes.",
    };
  attempt.count++;
  if (attempts.size < 10000 || attempts.has(email))
    attempts.set(email, attempt);
  try {
    await connectDb();
    const admin: any = await Admin.findOne({ email })
      .select("name email role active sessionVersion passwordHash")
      .lean();
    if (
      !admin ||
      admin.active === false ||
      !(await bcrypt.compare(password, admin.passwordHash))
    )
      return { error: "Incorrect email or password." };
    await setSession({
      id: String(admin._id),
      name: admin.name || "Administrator",
      email,
      role: admin.role || "admin",
      sessionVersion: admin.sessionVersion || 0,
    });
    attempts.delete(email);
  } catch {
    return {
      error:
        "Sign-in is unavailable. Check the admin database and session configuration.",
    };
  }
  redirect("/admin");
}
export async function logoutAction() {
  await clearSession();
  redirect("/admin/login");
}
export async function createLead(
  _: FormState,
  data: FormData,
): Promise<FormState> {
  const actor = await requireAdmin();
  let id: string;
  try {
    await connectDb();
    id = await addLead(actor, data);
  } catch (error) {
    return { error: message(error), values: values(data) };
  }
  refresh();
  redirect(`/admin/leads/${id}?created=1`);
}
export async function updateDetails(
  kind: "lead" | "career",
  id: string,
  _: FormState,
  data: FormData,
): Promise<FormState> {
  const actor = await requireAdmin();
  try {
    await connectDb();
    await editRecord(actor, kind, id, data);
  } catch (error) {
    return { error: message(error), values: values(data) };
  }
  refresh();
  redirect(`/admin/${kind === "lead" ? "leads" : "careers"}/${id}?saved=1`);
}
export async function updateStatus(
  kind: "lead" | "career",
  id: string,
  data: FormData,
) {
  const actor = await requireAdmin();
  try {
    await connectDb();
    await setStatus(actor, kind, id, data);
    refresh();
    return { ok: true, status: text(data, "status") };
  } catch (error) {
    return { ok: false, error: message(error) };
  }
}
export async function updateFavorite(id: string, favorite: boolean) {
  const actor = await requireAdmin();
  try {
    await connectDb();
    await setFavorite(actor, id, favorite);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: message(error) };
  }
}
export async function updateNote(
  kind: "lead" | "career",
  id: string,
  _: FormState,
  data: FormData,
): Promise<FormState> {
  const actor = await requireAdmin();
  try {
    await connectDb();
    await setNote(actor, kind, id, data);
    refresh();
    return { success: "Note saved." };
  } catch (error) {
    return { error: message(error), values: values(data) };
  }
}
export async function deleteRecord(
  kind: "lead" | "career",
  id: string,
  _: FormState,
): Promise<FormState> {
  const actor = await requireRole(["admin"]);
  try {
    await connectDb();
    await removeRecord(actor, kind, id);
  } catch (error) {
    return { error: message(error) };
  }
  refresh();
  redirect(`/admin/${kind === "lead" ? "leads" : "careers"}?deleted=1`);
}
export async function createTeamMember(
  _: FormState,
  data: FormData,
): Promise<FormState> {
  const actor = await requireAdmin();
  try {
    await connectDb();
    const name = await addTeamMember(actor, data);
    refresh();
    return {
      success: `Account created for ${name}. Share the credentials securely.`,
    };
  } catch (error: any) {
    return {
      error:
        error.code === 11000
          ? "An account already uses this email."
          : message(error),
      values: values(data),
    };
  }
}
export async function toggleTeamMember(
  id: string,
  _: FormState,
  data: FormData,
): Promise<FormState> {
  const actor = await requireAdmin();
  try {
    await connectDb();
    await changeTeamAccess(actor, id, data);
    refresh();
    return { success: "Account access updated." };
  } catch (error) {
    return { error: message(error) };
  }
}
export async function resetTeamPassword(
  id: string,
  _: FormState,
  data: FormData,
): Promise<FormState> {
  const actor = await requireAdmin();
  try {
    await connectDb();
    await resetPassword(actor, id, data);
  } catch (error) {
    return { error: message(error) };
  }
  if (id === actor.id) {
    await clearSession();
    redirect("/admin/login?reset=1");
  }
  refresh();
  return { success: "Password reset. Previous sessions have been signed out." };
}

export async function uploadBrochure(
  _: FormState,
  data: FormData,
): Promise<FormState> {
  const actor = await requireAdmin();
  if (actor.role !== "admin")
    return { error: "Administrator access is required." };
  const file = data.get("brochure");
  if (!(file instanceof File) || !file.size)
    return { error: "Choose a PDF brochure to upload." };
  if (file.size > 12 * 1024 * 1024)
    return { error: "The brochure must be 12 MB or smaller." };
  if (!file.name.toLowerCase().endsWith(".pdf"))
    return { error: "Only PDF brochures are accepted." };
  const bytes = Buffer.from(await file.arrayBuffer());
  if (bytes.subarray(0, 5).toString() !== "%PDF-")
    return { error: "The uploaded file is not a valid PDF." };
  try {
    await connectDb();
    const brochure = await Brochure.create({
      filename: file.name.replace(/[^\w. -]/g, "_").slice(0, 256),
      contentType: "application/pdf",
      size: file.size,
      data: bytes,
      active: true,
      uploadedById: actor.id,
      uploadedByName: actor.name,
    });
    await Brochure.updateMany(
      { _id: { $ne: brochure._id }, active: true },
      { $set: { active: false } },
    );
    revalidatePath("/admin/brochure");
    return {
      success:
        "New brochure uploaded. The public download link now serves this version.",
    };
  } catch {
    return { error: "Unable to upload the brochure. Please try again." };
  }
}
