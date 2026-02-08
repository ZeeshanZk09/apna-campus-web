"use server";

import { revalidatePath } from "next/cache";
import type { EnrollmentStatus } from "@/app/generated/prisma/enums";
import { createAuditLog } from "@/lib/audit";
import db from "@/lib/prisma";
import { enrollStudent } from "@/lib/queries/enrollmentQueries";

export async function enrollStudentAction(userId: string, cohortId: string) {
  try {
    const enrollment = await enrollStudent({ userId, cohortId });

    await createAuditLog({
      action: "ENROLL",
      resource: "Student",
      resourceId: userId,
      meta: { cohortId },
    });

    revalidatePath("/courses");
    revalidatePath(`/admin/academics/cohorts/${cohortId}`);
    return { success: true, enrollment };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateEnrollmentStatusAction(
  id: string,
  status: EnrollmentStatus,
) {
  try {
    await db.enrollment.update({
      where: { id },
      data: { status, updatedAt: new Date() },
    });

    await createAuditLog({
      action: "UPDATE_STATUS",
      resource: "Enrollment",
      resourceId: id,
      meta: { status },
    });

    revalidatePath("/admin/academics/enrollments");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function bulkMarkAttendanceAction(date: Date, records: any[]) {
  try {
    const formattedRecords = records.map((r) => ({
      ...r,
      date: new Date(date),
    }));

    await db.$transaction(async (tx) => {
      const enrollmentIds = formattedRecords.map((r) => r.enrollmentId);
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      await tx.attendance.deleteMany({
        where: {
          enrollmentId: { in: enrollmentIds },
          date: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      });

      return await tx.attendance.createMany({
        data: formattedRecords,
      });
    });

    await createAuditLog({
      action: "BULK_ATTENDANCE",
      resource: "Attendance",
      meta: { count: records.length, date: date.toISOString() },
    });

    revalidatePath("/admin/academics/attendance");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
