import { z } from "zod";

/**
 * Assessment module validators.
 */

export const assignmentSchema = z.object({
  courseId: z.string().uuid("Course ID is required"),
  title: z.string().min(2, "Title is required").max(200),
  description: z.string().max(5000).optional(),
});

export const submissionSchema = z.object({
  assignmentId: z.string().uuid("Assignment ID is required"),
  studentId: z.string().uuid("Student ID is required"),
});

export const evaluationSchema = z.object({
  assignmentId: z.string().uuid("Assignment ID is required"),
  studentId: z.string().uuid("Student ID is required"),
  marks: z.number().min(0).optional(),
  feedback: z.string().max(2000).optional(),
  gradedById: z.string().uuid().optional(),
});

export const examSchema = z.object({
  courseId: z.string().uuid("Course ID is required"),
  title: z.string().min(2, "Title is required").max(200),
  type: z.enum(["MIDTERM", "FINAL", "QUIZ", "ASSIGNMENT", "PRACTICAL"]),
  maxMarks: z.number().int().positive("Max marks must be positive"),
  passingMarks: z.number().int().min(0, "Passing marks must be non-negative"),
  date: z.string().or(z.date()).optional(),
});

export const examResultSchema = z.object({
  examId: z.string().uuid("Exam ID is required"),
  enrollmentId: z.string().uuid("Enrollment ID is required"),
  marks: z.number().min(0).optional(),
  grade: z
    .enum([
      "A_PLUS",
      "A_MINUS",
      "B_PLUS",
      "B_MINUS",
      "C_PLUS",
      "C_MINUS",
      "D",
      "F",
    ])
    .optional(),
  remarks: z.string().max(500).optional(),
});

export type AssignmentInput = z.infer<typeof assignmentSchema>;
export type SubmissionInput = z.infer<typeof submissionSchema>;
export type EvaluationInput = z.infer<typeof evaluationSchema>;
export type ExamInput = z.infer<typeof examSchema>;
export type ExamResultInput = z.infer<typeof examResultSchema>;
