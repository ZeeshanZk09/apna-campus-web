"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const STUDENT_QUERY_KEYS = {
  dashboard: ["student", "dashboard"],
  courses: ["student", "courses"],
  grades: ["student", "grades"],
  attendance: ["student", "attendance"],
};

export function useStudentDashboard() {
  return useQuery({
    queryKey: STUDENT_QUERY_KEYS.dashboard,
    queryFn: async () => {
      const { data } = await axios.get("/api/student/dashboard");
      return data.data;
    },
  });
}

export function useTeacherDashboard() {
  return useQuery({
    queryKey: ["teacher", "dashboard"],
    queryFn: async () => {
      const { data } = await axios.get("/api/teacher/dashboard");
      return data.data;
    },
  });
}
