// src/app/actions/course.ts
"use server";

import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/lib/audit";
import {
  createCourse,
  createLesson,
  createSubject,
} from "@/lib/queries/academicQueries";

export async function createCourseAction(formData: FormData) {
  const title = formData.get("title") as string;
  const code = formData.get("code") as string;
  const description = formData.get("description") as string;
  const creditHours = parseInt(formData.get("creditHours") as string, 10) || 0;
  const programId = formData.get("programId") as string;
  const departmentId = formData.get("departmentId") as string;

  if (!title || !code) {
    return { error: "Title and Code are required" };
  }

  try {
    const course = await createCourse({
      title,
      code,
      description,
      creditHours,
      programId: programId || undefined,
      departmentId: departmentId || undefined,
    });

    await createAuditLog({
      action: "CREATE_COURSE",
      resource: "COURSE",
      resourceId: course.id,
      meta: { title, code },
    });

    revalidatePath("/admin/courses");
    revalidatePath("/courses");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to create course" };
  }
}

export async function createSubjectAction(formData: FormData) {
  const title = formData.get("title") as string;
  const courseId = formData.get("courseId") as string;
  const code = formData.get("code") as string;
  const description = formData.get("description") as string;

  if (!title || !courseId) {
    return { error: "Title and Course ID are required" };
  }

  try {
    await createSubject({ title, courseId, code, description });
    revalidatePath(`/admin/courses/${courseId}`);
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to create subject" };
  }
}

export async function createLessonAction(formData: FormData) {
  const title = formData.get("title") as string;
  const subjectId = formData.get("subjectId") as string;
  const content = formData.get("content") as string;
  const order = parseInt(formData.get("order") as string, 10) || 0;

  if (!title || !subjectId) {
    return { error: "Title and Subject ID are required" };
  }

  try {
    await createLesson({ title, subjectId, content, order });
    revalidatePath("/admin/courses");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to create lesson" };
  }
}
