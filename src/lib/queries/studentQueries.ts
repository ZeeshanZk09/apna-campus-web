import prisma from "@/lib/prisma";

export async function getStudentDashboardData(userId: string) {
  const [enrollments, assignments, participation] = await Promise.all([
    prisma.enrollment.findMany({
      where: { userId },
      include: {
        cohort: {
          include: {
            program: true,
          },
        },
      },
    }),
    prisma.submission.findMany({
      where: { studentId: userId },
      include: {
        assignment: true,
      },
    }),
    prisma.attendance.findMany({
      where: { enrollment: { userId } },
    }),
  ]);

  // Calculate attendance %
  const totalDays = participation.length;
  const presentDays = participation.filter(
    (a) => a.status === "PRESENT" || a.status === "LATE",
  ).length;
  const attendanceRate = totalDays > 0 ? (presentDays / totalDays) * 100 : 100;

  return {
    activeCoursesCount: enrollments.length,
    submissionsCount: assignments.length,
    attendanceRate: Math.round(attendanceRate),
    enrollments,
    recentSubmissions: assignments.slice(0, 5),
  };
}

export async function getAllStudents() {
  return await prisma.user.findMany({
    where: {
      role: "STUDENT",
      isDeleted: false,
    },
    include: {
      enrollments: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getStudentById(id: string) {
  return await prisma.user.findFirst({
    where: {
      id,
      role: "STUDENT",
      isDeleted: false,
    },
    include: {
      enrollments: {
        include: {
          cohort: {
            include: {
              program: true,
            },
          },
        },
      },
    },
  });
}
