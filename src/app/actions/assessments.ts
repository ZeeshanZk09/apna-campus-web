"use server";

import { gradeAssignment } from "@/lib/queries/assessmentQueries";

// Wait, server actions should not have 'use client'.
// I'll create it as a proper server action file.

async function gradeAssignmentAction(
  assignmentId: string,
  studentId: string,
  marks: number,
  feedback?: string,
  gradedById?: string,
) {
  try {
    // Call the actual grading logic (e.g., update DB)
    await gradeAssignment({
      assignmentId,
      studentId,
      marks,
      feedback,
      gradedById,
    });

    // Optionally, you can add audit logging here

    return { success: true, message: "Grade submitted successfully" };
  } catch (_error) {
    return { success: false, error: "Failed to submit grade" };
  }
}

export { gradeAssignmentAction };
