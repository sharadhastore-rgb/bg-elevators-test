import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDb } from "../lib/db";
import { Activity, Admin } from "../lib/models";
async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase(),
    password = process.env.ADMIN_PASSWORD;
  if (
    !email ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !password ||
    password.length < 10 ||
    Buffer.byteLength(password) > 72 ||
    password.startsWith("replace-")
  )
    throw new Error(
      "Set a valid ADMIN_EMAIL and a unique ADMIN_PASSWORD with at least 10 characters (maximum 72 UTF-8 bytes).",
    );
  const secret = process.env.SESSION_SECRET || "";
  if (secret.length < 32 || secret.includes("replace-with"))
    throw new Error(
      "Set a random SESSION_SECRET of at least 32 characters before creating an administrator.",
    );
  await connectDb();
  const current = await Admin.findOne({ email });
  const admin = await Admin.findOneAndUpdate(
    { email },
    {
      $set: {
        name:
          process.env.ADMIN_NAME?.trim() ||
          current?.name ||
          "Primary Administrator",
        email,
        passwordHash: await bcrypt.hash(password, 12),
        role: "admin",
        active: true,
      },
      $inc: { sessionVersion: 1 },
    },
    { upsert: true, new: true, runValidators: true },
  );
  await Activity.create({
    entityType: "team",
    entityId: admin._id,
    entityName: admin.name,
    actorName: "Setup script",
    actorRole: "system",
    action: current ? "password_reset" : "account_created",
    description: current
      ? "Administrator credentials reset through setup; previous sessions revoked"
      : "Primary administrator created through setup",
  });
  console.log(
    `Admin account ready for ${email}. Remove ADMIN_PASSWORD from the environment after setup.`,
  );
}
main()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
