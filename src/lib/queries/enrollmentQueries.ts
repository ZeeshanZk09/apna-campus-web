// src/lib/queries/enrollmentQueries.ts
import type {
  AttendanceStatus,
  EnrollmentStatus,
} from "@/app/generated/prisma/enums";
import db from "@/lib/prisma";

// --- Cohort Queries ---

export async function getAllCohorts() {
  return await db.cohort.findMany({
    include: {
      program: true,
      enrollments: {
        include: {
          user: true,
        },
      },
    },
  });
}

export async function createCohort(data: {
  name: string;
  startDate: Date;
  endDate?: Date;
  programId?: string;
}) {
  return await db.cohort.create({
    data,
  });
}

// --- Enrollment Queries ---

export async function enrollStudent(data: {
  userId: string;
  cohortId: string;
  status?: EnrollmentStatus;
}) {
  return await db.enrollment.create({
    data,
  });
}

export async function getStudentEnrollments(userId: string) {
  return await db.enrollment.findMany({
    where: { userId },
    include: {
      cohort: {
        include: {
          program: {
            include: {
              courses: true,
            },
          },
        },
      },
    },
  });
}

export async function getAllActiveEnrollments() {
  return await db.enrollment.findMany({
    where: { status: "ACTIVE" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      cohort: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}

// --- Attendance Queries ---

export async function markAttendance(data: {
  enrollmentId: string;
  date: Date;
  status: AttendanceStatus;
  note?: string;
}) {
  return await db.attendance.create({
    data,
  });
}

export async function getAttendanceByEnrollment(enrollmentId: string) {
  return await db.attendance.findMany({
    where: { enrollmentId },
    orderBy: { date: "desc" },
  });
}

export async function getAttendanceByCohort(cohortId: string, date: Date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return await db.attendance.findMany({
    where: {
      enrollment: { cohortId },
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    include: {
      enrollment: { include: { user: true } },
    },
  });
}

export async function bulkMarkAttendance(
  records: {
    enrollmentId: string;
    date: Date;
    status: AttendanceStatus;
    note?: string;
  }[],
) {
  // Since Prisma doesn't support bulk upsert easily for relational keys without a unique constraint on (enrollmentId, date),
  // we do a simple loop or use createMany if we are sure they don't exist.
  // Proper way: delete existing for that day and re-insert or use a transaction.

  const date = records[0].date;
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const enrollmentIds = records.map((r) => r.enrollmentId);

  return await db.$transaction(async (tx) => {
    // Delete existing for these students on this specific day
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
      data: records,
    });
  });
}
