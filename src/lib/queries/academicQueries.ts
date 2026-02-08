// src/lib/queries/academicQueries.ts
import db from "@/lib/prisma";
// --- Department Queries ---

export async function getAllDepartments() {
  return await db.department.findMany({
    include: {
      programs: true,
      courses: true,
    },
  });
}

export async function createDepartment(data: {
  name: string;
  code?: string;
  description?: string;
}) {
  return await db.department.create({
    data,
  });
}

export async function getDepartmentById(id: string) {
  return await db.department.findUnique({
    where: { id },
    include: {
      programs: true,
      courses: true,
    },
  });
}

export async function updateDepartment(
  id: string,
  data: Partial<{
    name: string;
    code: string;
    description: string;
  }>,
) {
  return await db.department.update({
    where: { id },
    data,
  });
}

export async function deleteDepartment(id: string) {
  return await db.department.delete({
    where: { id },
  });
}

// --- Program Queries ---

export async function getAllPrograms() {
  return await db.program.findMany({
    include: {
      department: true,
      courses: true,
      cohorts: true,
    },
  });
}

export async function createProgram(data: {
  name: string;
  code?: string;
  durationMonths?: number;
  description?: string;
  departmentId?: string;
}) {
  return await db.program.create({
    data,
  });
}

export async function getProgramById(id: string) {
  return await db.program.findUnique({
    where: { id },
    include: {
      department: true,
      courses: true,
      cohorts: {
        include: {
          enrollments: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  });
}

export async function updateProgram(
  id: string,
  data: Partial<{
    name: string;
    code: string;
    durationMonths: number;
    description: string;
    departmentId: string;
  }>,
) {
  return await db.program.update({
    where: { id },
    data,
  });
}

export async function deleteProgram(id: string) {
  return await db.program.delete({
    where: { id },
  });
}

// --- Course Queries ---

export async function getAllCourses() {
  return await db.course.findMany({
    include: {
      program: true,
      department: true,
      subjects: {
        include: {
          lessons: true,
        },
      },
    },
  });
}

export async function getCourseByCode(code: string) {
  return await db.course.findUnique({
    where: { code },
    include: {
      program: true,
      department: true,
      subjects: {
        include: {
          lessons: true,
        },
      },
      assignments: true,
      exams: true,
    },
  });
}

export async function createCourse(data: {
  title: string;
  code: string;
  description?: string;
  creditHours?: number;
  programId?: string;
  departmentId?: string;
  prerequisites?: string[];
}) {
  return await db.course.create({
    data,
  });
}

export async function updateCourse(
  id: string,
  data: Partial<{
    title: string;
    code: string;
    description: string;
    creditHours: number;
    programId: string;
    departmentId: string;
    prerequisites: string[];
  }>,
) {
  return await db.course.update({
    where: { id },
    data,
  });
}

export async function deleteCourse(id: string) {
  return await db.course.delete({
    where: { id },
  });
}

// --- Subject & Lesson Queries ---

export async function createSubject(data: {
  title: string;
  courseId: string;
  code?: string;
  description?: string;
}) {
  return await db.subject.create({
    data,
  });
}

export async function getSubjectById(id: string) {
  return await db.subject.findUnique({
    where: { id },
    include: {
      course: true,
      lessons: true,
    },
  });
}

export async function updateSubject(
  id: string,
  data: Partial<{
    title: string;
    code: string;
    description: string;
  }>,
) {
  return await db.subject.update({
    where: { id },
    data,
  });
}

export async function deleteSubject(id: string) {
  return await db.subject.delete({
    where: { id },
  });
}

export async function createLesson(data: {
  title: string;
  subjectId: string;
  content?: string;
  order?: number;
}) {
  return await db.lesson.create({
    data,
  });
}

export async function getLessonById(id: string) {
  return await db.lesson.findUnique({
    where: { id },
    include: {
      subject: true,
    },
  });
}

export async function updateLesson(
  id: string,
  data: Partial<{
    title: string;
    content: string;
    order: number;
  }>,
) {
  return await db.lesson.update({
    where: { id },
    data,
  });
}

export async function deleteLesson(id: string) {
  return await db.lesson.delete({
    where: { id },
  });
}

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

export async function updateCohort(
  id: string,
  data: Partial<{
    name: string;
    startDate: Date;
    endDate: Date;
    programId: string;
  }>,
) {
  return await db.cohort.update({
    where: { id },
    data,
  });
}

export async function getCohortById(id: string) {
  return await db.cohort.findUnique({
    where: { id },
    include: {
      program: true,
      teacherCohorts: {
        include: {
          teacher: true,
        },
      },
      enrollments: {
        include: {
          user: true,
        },
      },
    },
  });
}

export async function deleteCohort(id: string) {
  return await db.cohort.delete({
    where: { id },
  });
}

export async function getCourseById(id: string) {
  return await db.course.findUnique({
    where: { id },
    include: {
      program: true,
      department: true,
      subjects: {
        include: {
          lessons: true,
        },
      },
      assignments: true,
      exams: true,
    },
  });
}
