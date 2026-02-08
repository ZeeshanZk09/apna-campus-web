// src/app/actions/userManagement.ts
"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import type { Role } from "@/app/generated/prisma/enums";
import { createAuditLog } from "@/lib/audit";
import db from "@/lib/prisma";
import {
  createUser,
  linkParentToChild,
  setBlockStatus,
  updateUserAdmin,
} from "@/lib/queries/userManagement";

export async function createUserAction(formData: FormData) {
  const name = formData.get("name") as string;
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = (formData.get("role") as Role) || "STUDENT";

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createUser({
      name,
      username,
      email,
      passwordHash,
      role,
    });
    await createAuditLog({
      action: "CREATE",
      resource: "User",
      resourceId: user.id,
      meta: { username, role },
    });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateUserAction(userId: string, data: any) {
  try {
    await updateUserAdmin(userId, data);
    await createAuditLog({
      action: "UPDATE",
      resource: "User",
      resourceId: userId,
      meta: data,
    });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function toggleBlockUserAction(
  userId: string,
  isBlocked: boolean,
) {
  try {
    await setBlockStatus(userId, isBlocked);

    await createAuditLog({
      action: isBlocked ? "BLOCK" : "UNBLOCK",
      resource: "User",
      resourceId: userId,
    });

    revalidatePath("/admin/users");
    revalidatePath("/admin/monitoring/audit-logs");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function linkParentAction(
  parentId: string,
  childId: string,
  relation: string,
) {
  try {
    await linkParentToChild(parentId, childId, relation);
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteUserPermanently(userId: string) {
  try {
    await db.user.update({
      where: { id: userId },
      data: { isDeleted: true },
    });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function exportUsersToCsv() {
  try {
    const users = await db.user.findMany({ where: { isDeleted: false } });
    const header = "ID,Username,Email,Role,CreatedAt\n";
    const rows = users
      .map(
        (u) =>
          `${u.id},${u.username},${u.email},${u.role},${u.createdAt.toISOString()}`,
      )
      .join("\n");

    await createAuditLog({
      action: "EXPORT",
      resource: "User",
      resourceId: "all",
    });

    return { success: true, data: header + rows };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
