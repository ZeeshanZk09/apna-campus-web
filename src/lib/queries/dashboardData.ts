// src/lib/queries/dashboardData.ts
import prisma from "@/lib/prisma";
import { getStudentDashboardData } from "./studentQueries";

export async function getTeacherDashboardData(userId: string) {
  const [cohorts, assignments] = await Promise.all([
    prisma.teacherCohort.findMany({
      where: { teacherId: userId },
      include: {
        cohort: {
          include: {
            program: true,
            enrollments: {
              select: { id: true },
            },
          },
        },
      },
    }),
    prisma.assignment.findMany({
      where: {
        course: {
          program: {
            cohorts: {
              some: {
                teacherCohorts: {
                  some: { teacherId: userId },
                },
              },
            },
          },
        },
      },
      include: {
        submissions: {
          take: 5,
          orderBy: { createdAt: "desc" },
          include: {
            student: { select: { username: true } },
          },
        },
      },
    }),
  ]);

  const totalStudents = cohorts.reduce(
    (acc, c) => acc + c.cohort.enrollments.length,
    0,
  );

  return {
    activeClassesCount: cohorts.length,
    totalStudents,
    assignmentsCount: assignments.length,
    classes: cohorts.map((c) => c.cohort),
    recentSubmissions: assignments
      .flatMap((a) => a.submissions)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 5),
  };
}

export async function getParentDashboardData(userId: string) {
  const children = await prisma.parentChild.findMany({
    where: { parentId: userId },
    include: {
      child: {
        include: {
          enrollments: {
            include: {
              cohort: { include: { program: true } },
              Attendance: { take: 5, orderBy: { date: "desc" } },
            },
          },
        },
      },
    },
  });

  return {
    children: children.map((c) => c.child),
    totalChildren: children.length,
  };
}

export { getStudentDashboardData };
