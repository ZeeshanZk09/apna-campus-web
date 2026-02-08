// src/app/actions/attendance.ts
"use server";

import { revalidatePath } from "next/cache";
import type { AttendanceStatus } from "@/app/generated/prisma/enums";
import { bulkMarkAttendance } from "@/lib/queries/enrollmentQueries";

export async function saveAttendanceAction(
  records: {
    enrollmentId: string;
    date: string; // ISO string
    status: AttendanceStatus;
    note?: string;
  }[],
) {
  try {
    const data = records.map((r) => ({
      ...r,
      date: new Date(r.date),
    }));

    await bulkMarkAttendance(data);
    revalidatePath("/admin/academics");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
