"use server";

import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/lib/audit";
import db from "@/lib/prisma";

export async function createAssetAction(data: {
  url: string;
  key?: string;
  mimeType?: string;
  size?: number;
  createdById?: string;
}) {
  try {
    const asset = await db.asset.create({
      data: {
        url: data.url,
        key: data.key,
        mimeType: data.mimeType,
        size: data.size,
        createdById: data.createdById,
      },
    });

    await createAuditLog({
      action: "UPLOAD",
      resource: "Asset",
      resourceId: asset.id,
      meta: { mimeType: data.mimeType },
    });

    revalidatePath("/admin/inventory"); // or media library path
    return { success: true, asset };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteAssetAction(id: string) {
  try {
    await db.asset.delete({ where: { id } });
    revalidatePath("/admin/inventory");
    return { success: true };
  } catch (_error) {
    return { success: false };
  }
}
