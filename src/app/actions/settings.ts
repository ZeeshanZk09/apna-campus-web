// src/app/actions/settings.ts
"use server";

import { revalidatePath } from "next/cache";
import { bulkUpdateSettings } from "@/lib/queries/settingsQueries";

export async function updateSettingsAction(formData: Record<string, string>) {
  try {
    await bulkUpdateSettings(formData);
    revalidatePath("/admin/settings");
    return { success: true, message: "Settings updated successfully" };
  } catch (error) {
    console.error("Settings update error:", error);
    return { success: false, message: "Failed to update settings" };
  }
}
