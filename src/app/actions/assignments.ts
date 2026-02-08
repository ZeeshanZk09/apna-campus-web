// src/app/actions/assignments.ts
"use server";

import { revalidatePath } from "next/cache";
import type { ExamType, GradeScale } from "@/app/generated/prisma/enums";
import { createAuditLog } from "@/lib/audit";
import {
  createAssignment,
  createExam,
  gradeAssignment,
  recordExamResult,
} from "@/lib/queries/assessmentQueries";

export async function createAssignmentAction(
  formData: FormData,
  courseId: string,
) {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    const assignment = await createAssignment({ title, description, courseId });

    await createAuditLog({
      action: "CREATE",
      resource: "Assignment",
      resourceId: assignment.id,
      meta: { title, courseId },
    });

    revalidatePath(`/admin/academics/courses/${courseId}`);
    return { success: true, message: "Assignment created successfully" };
  } catch (_error) {
    return { success: false, message: "Failed to create assignment" };
  }
}

export async function gradeSubmissionAction(
  assignmentId: string,
  studentId: string,
  marks: number,
  feedback?: string,
  gradedById?: string,
) {
  try {
    await gradeAssignment({
      assignmentId,
      studentId,
      marks,
      feedback,
      gradedById,
    });

    await createAuditLog({
      action: "UPDATE",
      resource: "SubmissionGrade",
      resourceId: assignmentId,
      meta: { studentId, marks, feedback },
    });
    revalidatePath("/admin/academics/assignments");
    return { success: true, message: "Grade submitted successfully" };
  } catch (_error) {
    return { success: false, message: "Failed to submit grade" };
  }
}

export async function createExamAction(data: {
  title: string;
  date: Date;
  type: ExamType;
  maxMarks: number;
  passingMarks: number;
  courseId: string;
}) {
  try {
    await createExam(data);
    revalidatePath(`/admin/academics/courses/${data.courseId}`);
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Failed to create exam" };
  }
}

export async function recordExamResultAction(data: {
  enrollmentId: string;
  examId: string;
  marks?: number;
  grade?: GradeScale;
  remarks?: string;
}) {
  try {
    await recordExamResult(data);
    revalidatePath("/admin/academics/exams");
    return { success: true, message: "Exam result recorded successfully" };
  } catch (_error) {
    return { success: false, error: "Failed to record exam result" };
  }
}
// gradeSubmissionAction and createGradingScaleAction removed as they are not supported by the current schema.
