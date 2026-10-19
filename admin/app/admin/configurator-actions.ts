"use server";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { ConfiguratorSetting, ConfiguratorRequest } from "@/lib/configurator";
import {
  statuses,
  validateConfiguratorSettings,
} from "../../../shared/configurator.js";
export async function saveConfigurator(
  _state: { error?: string; success?: string; revision?: number },
  form: FormData,
): Promise<{ error?: string; success?: string; revision?: number }> {
  const actor = await requireRole(["admin"]);
  try {
    const settings = validateConfiguratorSettings(
      JSON.parse(String(form.get("settings"))),
    );
    const revision = Number(form.get("revision"));
    if (!Number.isInteger(revision) || revision < 0)
      throw new Error("Invalid settings version.");
    await connectDb();
    const update = { settings, revision: revision + 1, updatedBy: actor.name };
    if (revision === 0) {
      await ConfiguratorSetting.init();
      try {
        await ConfiguratorSetting.create({ key: "main", ...update });
      } catch (e: any) {
        if (e.code === 11000)
          throw new Error(
            "Settings changed in another session. Reload before saving.",
          );
        throw e;
      }
    } else {
      const result = await ConfiguratorSetting.updateOne(
        { key: "main", revision },
        { $set: update },
      );
      if (!result.modifiedCount)
        throw new Error(
          "Settings changed in another session. Reload before saving.",
        );
    }
    revalidatePath("/admin/configurator");
    return {
      success: "Published. The website loads these settings immediately.",
      revision: revision + 1,
    };
  } catch (e: any) {
    return { error: e.message || "Unable to publish settings." };
  }
}
export async function updateConfiguratorRequest(
  _state: { error?: string; success?: string },
  form: FormData,
): Promise<{ error?: string; success?: string }> {
  try {
    await requireRole(["admin", "staff"]);
    const id = String(form.get("id")),
      status = String(form.get("status"));
    if (!/^[a-f0-9]{24}$/i.test(id) || !statuses.includes(status))
      throw new Error("Invalid request update.");
    await connectDb();
    const result = await ConfiguratorRequest.updateOne(
      { _id: id },
      { $set: { status } },
    );
    if (!result.matchedCount) throw new Error("Request not found.");
    revalidatePath("/admin/configurator");
    return { success: `Status updated to ${status}.` };
  } catch (error: any) {
    return { error: error.message || "Unable to update the request status." };
  }
}

export async function deleteConfiguratorRequest(
  id: string,
  _state: { error?: string },
): Promise<{ error?: string }> {
  try {
    await requireRole(["admin"]);
    if (!/^[a-f0-9]{24}$/i.test(id)) throw new Error("Invalid request.");
    await connectDb();
    const result = await ConfiguratorRequest.deleteOne({ _id: id });
    if (!result.deletedCount) throw new Error("Request not found.");
    revalidatePath("/admin/configurator");
    return {};
  } catch (error: any) {
    return { error: error.message || "Unable to delete the request." };
  }
}
