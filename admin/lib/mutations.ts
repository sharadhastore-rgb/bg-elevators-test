import bcrypt from "bcryptjs";
import type { AdminSession } from "./auth";
import { Activity, Admin, CareerApplication, Lead } from "./models";
import {
  careerStatuses,
  leadSources,
  leadStatuses,
  teamRoles,
} from "./constants";
import {
  choice,
  field,
  InputError,
  password,
  person,
  text,
  validId,
} from "./validation";
type Kind = "lead" | "career";
export type Actor = Pick<AdminSession, "id" | "name" | "role">;
export function authorize(actor: Actor, roles = ["admin", "staff"]) {
  if (!roles.includes(actor.role))
    throw new InputError(
      "Your account does not have permission for this action.",
    );
}
export async function audit(
  actor: Actor,
  entityType: string,
  record: any,
  action: string,
  description: string,
  changes: any[] = [],
) {
  await Activity.create({
    entityType,
    entityId: record._id,
    entityName: record.name,
    actorId: actor.id,
    actorName: actor.name,
    actorRole: actor.role,
    action,
    description,
    changes,
  });
}
async function record(kind: Kind, id: string) {
  if (!validId(id)) throw new InputError("Invalid record.");
  const doc = await (kind === "lead" ? Lead : CareerApplication).findById(id);
  if (!doc) throw new InputError("This record no longer exists.");
  return doc;
}
const label: Record<string, string> = {
  name: "Name",
  email: "Email",
  phone: "Phone",
  location: "Location",
  message: "Requirement / message",
  source: "Source",
  position: "Position",
  experience: "Experience",
  status: "Status",
  adminNote: "Internal note",
};
async function change(
  actor: Actor,
  kind: Kind,
  id: string,
  values: Record<string, string>,
  action: string,
) {
  authorize(actor);
  const doc = await record(kind, id);
  const changes = Object.entries(values)
    .filter(([key, value]) => String(doc[key] || "") !== value)
    .map(([key, value]) => ({
      field: label[key] || key,
      before: String(doc[key] || ""),
      after: value,
    }));
  if (!changes.length) return;
  Object.assign(doc, values);
  await doc.save();
  await audit(
    actor,
    kind,
    doc,
    action,
    action === "status_changed"
      ? `Status changed from ${changes[0].before} to ${changes[0].after}`
      : action === "note_updated"
        ? "Internal note updated"
        : `Updated ${changes.map((x) => x.field.toLowerCase()).join(", ")}`,
    changes,
  );
}
export async function addLead(actor: Actor, data: FormData) {
  authorize(actor);
  const lead = await Lead.create({
    ...person(data),
    source: choice(text(data, "source"), leadSources),
    status: choice(text(data, "status"), leadStatuses),
    adminNote: field(data, "adminNote", 10000),
  });
  await audit(actor, "lead", lead, "created", "Lead added manually");
  return String(lead._id);
}
export async function editRecord(
  actor: Actor,
  kind: Kind,
  id: string,
  data: FormData,
) {
  const values: Record<string, string> = person(data);
  if (kind === "lead")
    values.source = choice(text(data, "source"), leadSources);
  else {
    values.position = field(data, "position") || "General Application";
    values.experience = field(data, "experience");
  }
  await change(actor, kind, id, values, "details_updated");
}
export async function setStatus(
  actor: Actor,
  kind: Kind,
  id: string,
  data: FormData,
) {
  await change(
    actor,
    kind,
    id,
    {
      status: choice(
        text(data, "status"),
        kind === "lead" ? leadStatuses : careerStatuses,
      ),
    },
    "status_changed",
  );
}
export async function setFavorite(actor: Actor, id: string, favorite: boolean) {
  authorize(actor);
  const lead = await record("lead", id);
  const stored = await Lead.collection.findOne(
    { _id: lead._id },
    { projection: { favorite: 1 } },
  );
  const current = Boolean(stored?.favorite);
  if (current === favorite) return;
  await Lead.collection.updateOne(
    { _id: lead._id },
    { $set: { favorite } },
  );
  lead.set("favorite", favorite, { strict: false });
  await audit(
    actor,
    "lead",
    lead,
    "favorite_changed",
    favorite ? "Lead added to favorites" : "Lead removed from favorites",
    [
      {
        field: "Favorite",
        before: current ? "Yes" : "No",
        after: favorite ? "Yes" : "No",
      },
    ],
  );
}
export async function setNote(
  actor: Actor,
  kind: Kind,
  id: string,
  data: FormData,
) {
  await change(
    actor,
    kind,
    id,
    { adminNote: field(data, "adminNote", 10000) },
    "note_updated",
  );
}
export async function removeRecord(actor: Actor, kind: Kind, id: string) {
  authorize(actor, ["admin"]);
  const doc = await record(kind, id);
  await audit(
    actor,
    kind,
    doc,
    "deleted",
    `${kind === "lead" ? "Lead" : "Career application"} deleted`,
    [
      {
        field: "Record",
        before: `${doc.name} · ${doc.email} · ${doc.status}`,
        after: "Deleted",
      },
    ],
  );
  await doc.deleteOne();
}
export async function addTeamMember(actor: Actor, data: FormData) {
  authorize(actor, ["admin"]);
  const name = field(data, "name"),
    email = field(data, "email").toLowerCase(),
    secret = password(data),
    role = choice(text(data, "role"), teamRoles);
  if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    throw new InputError("Enter a valid name and email.");
  if (await Admin.exists({ email }))
    throw new InputError("An account already uses this email.");
  const member = await Admin.create({
    name,
    email,
    passwordHash: await bcrypt.hash(secret, 12),
    role,
    active: true,
  });
  await audit(
    actor,
    "team",
    member,
    "account_created",
    `${role === "admin" ? "Administrator" : role} account created`,
  );
  return name;
}
export async function changeTeamAccess(
  actor: Actor,
  id: string,
  data: FormData,
) {
  authorize(actor, ["admin"]);
  if (!validId(id) || id === actor.id)
    throw new InputError("You cannot change your own access here.");
  const member = await Admin.findById(id);
  if (!member) throw new InputError("Account not found.");
  const active = text(data, "active") === "true";
  if (member.active === active) return;
  const before = member.active === false ? "Inactive" : "Active";
  member.active = active;
  member.sessionVersion = (member.sessionVersion || 0) + 1;
  await member.save();
  await audit(
    actor,
    "team",
    member,
    "access_changed",
    `Account ${active ? "activated" : "deactivated"}`,
    [{ field: "Access", before, after: active ? "Active" : "Inactive" }],
  );
}
export async function resetPassword(actor: Actor, id: string, data: FormData) {
  authorize(actor, ["admin"]);
  if (!validId(id)) throw new InputError("Invalid account.");
  const secret = password(data);
  const member = await Admin.findByIdAndUpdate(
    id,
    {
      $set: { passwordHash: await bcrypt.hash(secret, 12) },
      $inc: { sessionVersion: 1 },
    },
    { new: true },
  );
  if (!member) throw new InputError("Account not found.");
  await audit(
    actor,
    "team",
    member,
    "password_reset",
    "Password reset; previous sessions revoked",
  );
}
