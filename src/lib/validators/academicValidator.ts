import { z } from "zod";

/**
 * Academic module validators.
 */

export const departmentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  code: z.string().max(20).optional(),
  description: z.string().max(500).optional(),
});

export const programSchema = z.object({
  departmentId: z.string().uuid().optional(),
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  code: z.string().max(20).optional(),
  durationMonths: z.number().int().positive().optional(),
  description: z.string().max(1000).optional(),
});

export const courseSchema = z.object({
  programId: z.string().uuid().optional(),
  departmentId: z.string().uuid().optional(),
  code: z.string().min(2, "Course code is required").max(20),
  title: z.string().min(2, "Title is required").max(200),
  description: z.string().max(2000).optional(),
  creditHours: z.number().int().min(0).max(20).optional(),
  prerequisites: z.array(z.string()).optional(),
});

export const subjectSchema = z.object({
  courseId: z.string().uuid("Course ID is required"),
  title: z.string().min(2, "Title is required").max(200),
  code: z.string().max(20).optional(),
  description: z.string().max(1000).optional(),
});

export const lessonSchema = z.object({
  subjectId: z.string().uuid("Subject ID is required"),
  title: z.string().min(2, "Title is required").max(200),
  content: z.string().optional(),
  order: z.number().int().min(0).optional(),
});

export const cohortSchema = z.object({
  programId: z.string().uuid().optional(),
  name: z.string().min(2, "Name is required").max(100),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()).optional(),
});

export const enrollmentSchema = z.object({
  cohortId: z.string().uuid("Cohort ID is required"),
  userId: z.string().uuid("User ID is required"),
  status: z.enum(["ACTIVE", "COMPLETED", "WITHDRAWN", "SUSPENDED"]).optional(),
});

export const attendanceSchema = z.object({
  enrollmentId: z.string().uuid("Enrollment ID is required"),
  date: z.string().or(z.date()),
  status: z.enum(["PRESENT", "ABSENT", "LATE", "EXCUSED"]),
  note: z.string().max(500).optional(),
});

export type DepartmentInput = z.infer<typeof departmentSchema>;
export type ProgramInput = z.infer<typeof programSchema>;
export type CourseInput = z.infer<typeof courseSchema>;
export type SubjectInput = z.infer<typeof subjectSchema>;
export type LessonInput = z.infer<typeof lessonSchema>;
export type CohortInput = z.infer<typeof cohortSchema>;
export type EnrollmentInput = z.infer<typeof enrollmentSchema>;
export type AttendanceInput = z.infer<typeof attendanceSchema>;
