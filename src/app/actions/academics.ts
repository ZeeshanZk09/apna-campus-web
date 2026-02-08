// src/app/actions/academics.ts
"use server";

import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/lib/audit";
import db from "@/lib/prisma";
import {
  createCohort,
  createCourse,
  createDepartment,
  createProgram,
  deleteCohort,
  deleteCourse,
  deleteDepartment,
  deleteProgram,
  updateCohort,
  updateCourse,
  updateDepartment,
  updateProgram,
} from "@/lib/queries/academicQueries";
// --- Department Actions ---

export async function createDepartmentAction(formData: FormData) {
  const name = formData.get("name") as string;
  const code = formData.get("code") as string;
  const description = formData.get("description") as string;

  if (!name) return { error: "Name is required" };

  try {
    const dept = await createDepartment({ name, code, description });
    await createAuditLog({
      action: "CREATE",
      resource: "Department",
      resourceId: dept.id,
      meta: { name },
    });
    revalidatePath("/admin/academics/departments");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateDepartmentAction(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const code = formData.get("code") as string;
  const description = formData.get("description") as string;

  try {
    await updateDepartment(id, { name, code, description });
    await createAuditLog({
      action: "UPDATE",
      resource: "Department",
      resourceId: id,
      meta: { name },
    });
    revalidatePath("/admin/academics/departments");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteDepartmentAction(id: string) {
  try {
    await deleteDepartment(id);
    await createAuditLog({
      action: "DELETE",
      resource: "Department",
      resourceId: id,
    });
    revalidatePath("/admin/academics/departments");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

// --- Program Actions ---

export async function createProgramAction(formData: FormData) {
  const name = formData.get("name") as string;
  const code = formData.get("code") as string;
  const departmentId = formData.get("departmentId") as string;
  const durationMonths =
    parseInt(formData.get("durationMonths") as string, 10) || 0;
  const description = formData.get("description") as string;

  if (!name) return { error: "Name is required" };

  try {
    const prog = await createProgram({
      name,
      code,
      departmentId,
      durationMonths,
      description,
    });
    await createAuditLog({
      action: "CREATE",
      resource: "Program",
      resourceId: prog.id,
      meta: { name },
    });
    revalidatePath("/admin/academics/programs");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateProgramAction(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const code = formData.get("code") as string;
  const departmentId = formData.get("departmentId") as string;
  const durationMonths =
    parseInt(formData.get("durationMonths") as string, 10) || 0;
  const description = formData.get("description") as string;

  try {
    await updateProgram(id, {
      name,
      code,
      departmentId,
      durationMonths,
      description,
    });
    await createAuditLog({
      action: "UPDATE",
      resource: "Program",
      resourceId: id,
      meta: { name },
    });
    revalidatePath("/admin/academics/programs");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteProgramAction(id: string) {
  try {
    await deleteProgram(id);
    await createAuditLog({
      action: "DELETE",
      resource: "Program",
      resourceId: id,
    });
    revalidatePath("/admin/academics/programs");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

// --- Course Actions ---

export async function createCourseAction(formData: FormData) {
  const title = formData.get("title") as string;
  const code = formData.get("code") as string;
  const description = formData.get("description") as string;
  const creditHours = parseInt(formData.get("creditHours") as string, 10) || 0;
  const programId = formData.get("programId") as string;
  const departmentId = formData.get("departmentId") as string;

  try {
    const course = await createCourse({
      title,
      code,
      description,
      creditHours,
      programId,
      departmentId,
    });
    await createAuditLog({
      action: "CREATE",
      resource: "Course",
      resourceId: course.id,
      meta: { title },
    });
    revalidatePath("/admin/academics/courses");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateCourseAction(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const code = formData.get("code") as string;
  const description = formData.get("description") as string;
  const creditHours = parseInt(formData.get("creditHours") as string, 10) || 0;
  const programId = formData.get("programId") as string;
  const departmentId = formData.get("departmentId") as string;

  try {
    await updateCourse(id, {
      title,
      code,
      description,
      creditHours,
      programId,
      departmentId,
    });
    await createAuditLog({
      action: "UPDATE",
      resource: "Course",
      resourceId: id,
      meta: { title },
    });
    revalidatePath("/admin/academics/courses");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteCourseAction(id: string) {
  try {
    await deleteCourse(id);
    await createAuditLog({
      action: "DELETE",
      resource: "Course",
      resourceId: id,
    });
    revalidatePath("/admin/academics/courses");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

// --- Cohort Actions ---

export async function createCohortAction(formData: FormData) {
  const name = formData.get("name") as string;
  const startDate = new Date(formData.get("startDate") as string);
  const endDate = formData.get("endDate")
    ? new Date(formData.get("endDate") as string)
    : undefined;
  const programId = formData.get("programId") as string;

  try {
    const cohort = await createCohort({ name, startDate, endDate, programId });
    await createAuditLog({
      action: "CREATE",
      resource: "Cohort",
      resourceId: cohort.id,
      meta: { name },
    });
    revalidatePath("/admin/academics/cohorts");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateCohortAction(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const startDate = new Date(formData.get("startDate") as string);
  const endDate = formData.get("endDate")
    ? new Date(formData.get("endDate") as string)
    : undefined;
  const programId = formData.get("programId") as string;

  try {
    await updateCohort(id, { name, startDate, endDate, programId });
    await createAuditLog({
      action: "UPDATE",
      resource: "Cohort",
      resourceId: id,
      meta: { name },
    });
    revalidatePath("/admin/academics/cohorts");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteCohortAction(id: string) {
  try {
    await deleteCohort(id);
    await createAuditLog({
      action: "DELETE",
      resource: "Cohort",
      resourceId: id,
    });
    revalidatePath("/admin/academics/cohorts");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateLessonAction(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const order = parseInt(formData.get("order") as string, 10) || 0;

  try {
    await db.lesson.update({
      where: { id },
      data: { title, content, order },
    });
    await createAuditLog({
      action: "UPDATE",
      resource: "Lesson",
      resourceId: id,
      meta: { title },
    });
    revalidatePath("/admin/academics/courses");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteLessonAction(id: string) {
  try {
    await db.lesson.delete({ where: { id } });
    await createAuditLog({
      action: "DELETE",
      resource: "Lesson",
      resourceId: id,
    });
    revalidatePath("/admin/academics/courses");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
