"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { PaginationParams } from "@/types";

// ============================================
// Query Keys
// ============================================

export const ACADEMIC_QUERY_KEYS = {
  departments: (params?: PaginationParams) => [
    "academics",
    "departments",
    params,
  ],
  programs: (params?: PaginationParams) => ["academics", "programs", params],
  courses: (params?: PaginationParams) => ["academics", "courses", params],
  courseDetail: (id: string) => ["academics", "course", id],
  cohorts: (params?: PaginationParams) => ["academics", "cohorts", params],
  enrollments: (params?: PaginationParams) => [
    "academics",
    "enrollments",
    params,
  ],
  attendance: (cohortId?: string, date?: string) => [
    "academics",
    "attendance",
    cohortId,
    date,
  ],
  exams: (params?: PaginationParams) => ["academics", "exams", params],
  examDetail: (id: string) => ["academics", "exam", id],
};

// ============================================
// Departments
// ============================================

export function useDepartments(params?: PaginationParams) {
  return useQuery({
    queryKey: ACADEMIC_QUERY_KEYS.departments(params),
    queryFn: async () => {
      const { data } = await axios.get("/api/admin/academics/departments");
      return data;
    },
  });
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dept: {
      name: string;
      code?: string;
      description?: string;
    }) => {
      const { data } = await axios.post(
        "/api/admin/academics/departments",
        dept,
      );
      return data.data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["academics", "departments"] }),
  });
}

// ============================================
// Programs
// ============================================

export function usePrograms(params?: PaginationParams) {
  return useQuery({
    queryKey: ACADEMIC_QUERY_KEYS.programs(params),
    queryFn: async () => {
      const { data } = await axios.get("/api/admin/academics/programs");
      return data;
    },
  });
}

export function useCreateProgram() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (program: Record<string, unknown>) => {
      const { data } = await axios.post(
        "/api/admin/academics/programs",
        program,
      );
      return data.data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["academics", "programs"] }),
  });
}

// ============================================
// Courses
// ============================================

export function useCourses(params?: PaginationParams) {
  return useQuery({
    queryKey: ACADEMIC_QUERY_KEYS.courses(params),
    queryFn: async () => {
      const { data } = await axios.get("/api/admin/courses");
      return data;
    },
  });
}

export function useCourseDetail(id: string) {
  return useQuery({
    queryKey: ACADEMIC_QUERY_KEYS.courseDetail(id),
    queryFn: async () => {
      const { data } = await axios.get(`/api/admin/courses/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useCreateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (course: Record<string, unknown>) => {
      const { data } = await axios.post("/api/admin/courses", course);
      return data.data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["academics", "courses"] }),
  });
}

// ============================================
// Cohorts
// ============================================

export function useCohorts(params?: PaginationParams) {
  return useQuery({
    queryKey: ACADEMIC_QUERY_KEYS.cohorts(params),
    queryFn: async () => {
      const { data } = await axios.get("/api/admin/academics/classrooms");
      return data;
    },
  });
}

export function useCreateCohort() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (cohort: Record<string, unknown>) => {
      const { data } = await axios.post(
        "/api/admin/academics/classrooms",
        cohort,
      );
      return data.data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["academics", "cohorts"] }),
  });
}

// ============================================
// Enrollments
// ============================================

export function useEnrollments(params?: PaginationParams) {
  return useQuery({
    queryKey: ACADEMIC_QUERY_KEYS.enrollments(params),
    queryFn: async () => {
      const { data } = await axios.get("/api/admin/academics/enrollments");
      return data;
    },
  });
}

export function useCreateEnrollment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (enrollment: { userId: string; cohortId: string }) => {
      const { data } = await axios.post(
        "/api/admin/academics/enrollments",
        enrollment,
      );
      return data.data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["academics", "enrollments"] }),
  });
}

// ============================================
// Attendance
// ============================================

export function useAttendance(cohortId?: string, date?: string) {
  return useQuery({
    queryKey: ACADEMIC_QUERY_KEYS.attendance(cohortId, date),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (cohortId) searchParams.set("cohortId", cohortId);
      if (date) searchParams.set("date", date);
      const { data } = await axios.get(
        `/api/admin/academics/attendance?${searchParams.toString()}`,
      );
      return data;
    },
    enabled: !!cohortId,
  });
}

export function useSaveAttendance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (record: {
      enrollmentId: string;
      date: string;
      status: string;
      note?: string;
    }) => {
      const { data } = await axios.post(
        "/api/admin/academics/attendance",
        record,
      );
      return data.data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["academics", "attendance"] }),
  });
}

// ============================================
// Exams
// ============================================

export function useExams(
  params?: PaginationParams & { courseId?: string; type?: string },
) {
  return useQuery({
    queryKey: ACADEMIC_QUERY_KEYS.exams(params),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set("page", String(params.page));
      if (params?.limit) searchParams.set("limit", String(params.limit));
      if (params?.courseId) searchParams.set("courseId", params.courseId);
      if (params?.type) searchParams.set("type", params.type);
      const { data } = await axios.get(
        `/api/admin/academics/exams?${searchParams.toString()}`,
      );
      return data;
    },
  });
}

export function useExamDetail(id: string) {
  return useQuery({
    queryKey: ACADEMIC_QUERY_KEYS.examDetail(id),
    queryFn: async () => {
      const { data } = await axios.get(`/api/admin/academics/exams/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useCreateExam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (exam: Record<string, unknown>) => {
      const { data } = await axios.post("/api/admin/academics/exams", exam);
      return data.data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["academics", "exams"] }),
  });
}

export function useRecordExamResult() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (result: Record<string, unknown>) => {
      const { data } = await axios.post(
        "/api/admin/academics/exam-results",
        result,
      );
      return data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["academics"] }),
  });
}
