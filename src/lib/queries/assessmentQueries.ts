import type { ExamType, GradeScale } from "@/app/generated/prisma/enums";
import db from "@/lib/prisma";

/**
 * ASSIGNMENTS
 */
export async function createAssignment(data: {
  title: string;
  description?: string;
  courseId: string;
}) {
  return await db.assignment.create({
    data: {
      title: data.title,
      description: data.description,
      courseId: data.courseId,
    },
  });
}

export async function getAssignmentById(id: string) {
  try {
    return await db.assignment.findUnique({
      where: { id },
      include: {
        course: true,
        submissions: {
          include: {
            student: {
              select: {
                name: true,
                username: true,
                email: true,
                profilePic: true,
              },
            },
          },
        },
        evaluations: true,
      },
    });
  } catch (error: any) {
    console.error(error);
    return null;
  }
}

export async function getAllAssignments() {
  try {
    return await db.assignment.findMany({
      include: {
        course: true,
        _count: {
          select: { submissions: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error: any) {
    console.error(error);
    return [];
  }
}

export async function submitAssignment(data: {
  assignmentId: string;
  studentId: string;
}) {
  return await db.submission.create({
    data: {
      assignmentId: data.assignmentId,
      studentId: data.studentId,
    },
  });
}

/**
 * EXAMS
 */
export async function createExam(data: {
  courseId: string;
  title: string;
  type: ExamType;
  maxMarks: number;
  passingMarks: number;
  date?: Date;
}) {
  return await db.exam.create({
    data: {
      courseId: data.courseId,
      title: data.title,
      type: data.type,
      maxMarks: data.maxMarks,
      passingMarks: data.passingMarks,
      date: data.date,
    },
  });
}

export async function recordExamResult(data: {
  examId: string;
  enrollmentId: string;
  marks?: number;
  grade?: GradeScale;
  remarks?: string;
}) {
  return await db.examResult.upsert({
    where: {
      examId_enrollmentId: {
        examId: data.examId,
        enrollmentId: data.enrollmentId,
      },
    },
    update: {
      marks: data.marks,
      grade: data.grade,
      remarks: data.remarks,
    },
    create: {
      examId: data.examId,
      enrollmentId: data.enrollmentId,
      marks: data.marks,
      grade: data.grade,
      remarks: data.remarks,
    },
  });
}

export async function getStudentResults(enrollmentId: string) {
  return await db.examResult.findMany({
    where: { enrollmentId },
    include: {
      exam: {
        include: { course: true },
      },
    },
  });
}

export async function gradeAssignment(data: {
  assignmentId: string;
  studentId: string;
  marks: number;
  feedback?: string;
  gradedById?: string;
}) {
  return await db.evaluation.create({
    data,
  });
}

export async function getAllSubmissions() {
  return await db.submission.findMany({
    include: {
      assignment: { include: { course: true } },
      student: { select: { username: true, email: true, profilePic: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getExamById(id: string) {
  return await db.exam.findUnique({
    where: { id },
    include: {
      course: {
        include: {
          program: {
            include: {
              cohorts: {
                include: {
                  enrollments: {
                    include: {
                      user: true,
                      ExamResult: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
      results: true,
    },
  });
}

export async function getAllExams() {
  return await db.exam.findMany({
    include: {
      course: {
        include: {
          program: {
            include: {
              cohorts: true,
            },
          },
        },
      },
    },
    orderBy: { date: "desc" },
  });
}
