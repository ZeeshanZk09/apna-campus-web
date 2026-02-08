"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { PaginationParams } from "@/types";

// ============================================
// Query Keys
// ============================================

export const ADMIN_QUERY_KEYS = {
  stats: ["admin", "stats"],
  users: (role: string, params?: PaginationParams) => [
    "admin",
    "users",
    role,
    params,
  ],
  userDetail: (role: string, id: string) => ["admin", "user", role, id],
  teachers: (params?: PaginationParams) => ["admin", "teachers", params],
  teacherDetail: (id: string) => ["admin", "teacher", id],
  students: (params?: PaginationParams) => ["admin", "students", params],
  studentDetail: (id: string) => ["admin", "student", id],
  staff: (params?: PaginationParams) => ["admin", "staff", params],
  parents: (params?: PaginationParams) => ["admin", "parents", params],
  guests: (params?: PaginationParams) => ["admin", "guests", params],
  reports: (type: string) => ["admin", "reports", type],
  notifications: (params?: PaginationParams) => [
    "admin",
    "notifications",
    params,
  ],
};

// ============================================
// Admin Stats
// ============================================

export function useAdminStats() {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.stats,
    queryFn: async () => {
      const { data } = await axios.get("/api/admin");
      return data.data;
    },
  });
}

// ============================================
// Role-based User Lists
// ============================================

function useRoleUsers(
  role: string,
  apiPath: string,
  params?: PaginationParams,
) {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.users(role, params),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set("page", String(params.page));
      if (params?.limit) searchParams.set("limit", String(params.limit));
      if (params?.search) searchParams.set("search", params.search);
      const { data } = await axios.get(`${apiPath}?${searchParams.toString()}`);
      return data;
    },
  });
}

export function useTeachers(params?: PaginationParams) {
  return useRoleUsers("teachers", "/api/admin/teachers", params);
}

export function useStudents(params?: PaginationParams) {
  return useRoleUsers("students", "/api/admin/students", params);
}

export function useStaff(params?: PaginationParams) {
  return useRoleUsers("staff", "/api/admin/staff", params);
}

export function useParents(params?: PaginationParams) {
  return useRoleUsers("parents", "/api/admin/parent-or-guardian", params);
}

export function useGuests(params?: PaginationParams) {
  return useRoleUsers("guests", "/api/admin/guests", params);
}

// ============================================
// User Detail
// ============================================

export function useTeacherDetail(id: string) {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.teacherDetail(id),
    queryFn: async () => {
      const { data } = await axios.get(`/api/admin/teachers/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useStudentDetail(id: string) {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.studentDetail(id),
    queryFn: async () => {
      const { data } = await axios.get(`/api/admin/students/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

// ============================================
// Create / Update / Delete Mutations
// ============================================

export function useCreateUser(role: string) {
  const queryClient = useQueryClient();
  const apiPaths: Record<string, string> = {
    TEACHER: "/api/admin/teachers",
    STUDENT: "/api/admin/students",
    STAFF: "/api/admin/staff",
    PARENT: "/api/admin/parent-or-guardian",
    GUARDIAN: "/api/admin/parent-or-guardian",
  };

  return useMutation({
    mutationFn: async (userData: Record<string, unknown>) => {
      const { data } = await axios.post(
        apiPaths[role] || "/api/admin/users",
        userData,
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.stats });
    },
  });
}

export function useUpdateUser(role: string) {
  const queryClient = useQueryClient();
  const apiPaths: Record<string, string> = {
    TEACHER: "/api/admin/teachers",
    STUDENT: "/api/admin/students",
    STAFF: "/api/admin/staff",
    PARENT: "/api/admin/parent-or-guardian",
    GUARDIAN: "/api/admin/parent-or-guardian",
  };

  return useMutation({
    mutationFn: async ({
      id,
      ...userData
    }: { id: string } & Record<string, unknown>) => {
      const { data } = await axios.put(
        `${apiPaths[role] || "/api/admin/users"}/${id}`,
        userData,
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
  });
}

export function useDeleteUser(role: string) {
  const queryClient = useQueryClient();
  const apiPaths: Record<string, string> = {
    TEACHER: "/api/admin/teachers",
    STUDENT: "/api/admin/students",
    STAFF: "/api/admin/staff",
    PARENT: "/api/admin/parent-or-guardian",
    GUARDIAN: "/api/admin/parent-or-guardian",
  };

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axios.delete(
        `${apiPaths[role] || "/api/admin/users"}/${id}`,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
  });
}

// ============================================
// Reports
// ============================================

export function useAdminReport(type: string) {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.reports(type),
    queryFn: async () => {
      const { data } = await axios.get(`/api/admin/reports?type=${type}`);
      return data.data;
    },
    enabled: !!type,
  });
}
