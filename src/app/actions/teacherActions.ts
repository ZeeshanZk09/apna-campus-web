"use server";

import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/lib/audit";
import db from "@/lib/prisma";

export async function assignTeacherToCohortAction(
  teacherId: string,
  cohortId: string,
  role?: string,
) {
  try {
    const assignment = await db.teacherCohort.create({
      data: {
        teacherId,
        cohortId,
        role: role || "Primary",
      },
    });

    await createAuditLog({
      action: "ASSIGN_TEACHER",
      resource: "TeacherCohort",
      resourceId: assignment.id,
      meta: {
        teacherId,
        cohortId,
        role,
      },
    });

    revalidatePath("/admin/users/teachers");
    revalidatePath(`/admin/academics/cohorts/${cohortId}`);
    return { success: true };
  } catch (error: any) {
    console.error("Failed to assign teacher:", error);
    return { success: false, error: "Failed to assign teacher to cohort." };
  }
}

export async function removeTeacherFromCohortAction(assignmentId: string) {
  try {
    const deleted = await db.teacherCohort.delete({
      where: { id: assignmentId },
    });

    await createAuditLog({
      action: "REMOVE_TEACHER",
      resource: "TeacherCohort",
      resourceId: assignmentId,
      meta: {
        teacherId: deleted.teacherId,
        cohortId: deleted.cohortId,
      },
    });

    revalidatePath("/admin/users/teachers");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to remove teacher:", error);
    return { success: false, error: "Failed to remove teacher from cohort." };
  }
}
