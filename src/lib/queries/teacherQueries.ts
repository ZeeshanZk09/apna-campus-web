import { Role } from "@/app/generated/prisma/enums";
import db from "@/lib/prisma";

export async function getAllTeachers() {
  return await db.user.findMany({
    where: {
      role: Role.TEACHER,
      isDeleted: false,
    },
    include: {
      teacherCohorts: {
        include: {
          cohort: true,
        },
      },
    },
    orderBy: {
      username: "asc",
    },
  });
}

export async function getTeacherById(id: string) {
  return await db.user.findFirst({
    where: {
      id,
      role: Role.TEACHER,
      isDeleted: false,
    },
    include: {
      teacherCohorts: {
        include: {
          cohort: true,
        },
      },
    },
  });
}
