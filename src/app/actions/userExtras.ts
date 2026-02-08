// src/app/actions/userExtras.ts
"use server";

import crypto from "node:crypto";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/lib/audit";
import db from "@/lib/prisma";
import { followUser, unfollowUser } from "@/lib/queries/userManagement";

export async function toggleFollowAction(
  followerId: string,
  followingId: string,
  currentlyFollowing: boolean,
) {
  try {
    if (currentlyFollowing) {
      await unfollowUser(followerId, followingId);
    } else {
      await followUser(followerId, followingId);
    }

    await createAuditLog({
      action: currentlyFollowing ? "UNFOLLOW" : "FOLLOW",
      resource: "User",
      resourceId: followingId,
    });

    revalidatePath(`/user/${followingId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createApiKeyAction(userId: string, name: string) {
  try {
    const key = `ak_${crypto.randomBytes(24).toString("hex")}`;
    const apiKey = await db.apiKey.create({
      data: {
        userId,
        name,
        key: key, // In production, hash this before storing
      },
    });

    await createAuditLog({
      action: "CREATE",
      resource: "ApiKey",
      resourceId: apiKey.id,
      meta: { name },
    });

    revalidatePath("/admin/settings");
    return { success: true, key }; // Return key once for the user to save
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function revokeApiKeyAction(id: string) {
  try {
    await db.apiKey.update({
      where: { id },
      data: { revoked: true },
    });

    await createAuditLog({
      action: "REVOKE",
      resource: "ApiKey",
      resourceId: id,
    });

    revalidatePath("/admin/settings");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
