/**
 * Comprehensive TypeScript types for the application.
 * These augment the Prisma-generated types with application-specific shapes.
 */

import type {
  EnrollmentStatus,
  ExamType,
  FeeType,
  Gender,
  GradeScale,
  PaymentStatus,
  Role,
} from "@/app/generated/prisma/client";

// ============================================
// User & Auth Types
// ============================================

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  username: string;
  role: Role;
  gender: Gender;
  profilePic: string | null;
  coverPic: string | null;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface SafeUser {
  id: string;
  username: string;
  email: string;
  name: string;
  role: Role;
  profilePic: string | null;
}

export interface SessionUser {
  id: string;
  username: string;
  email: string;
  role: Role;
  profilePic: string | null;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  metadata?: Record<string, unknown>;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  metadata: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// ============================================
// Academic Types
// ============================================

export interface DepartmentWithRelations {
  id: string;
  name: string;
  code: string | null;
  description: string | null;
  programs: { id: string; name: string }[];
  courses: { id: string; title: string }[];
  _count: { programs: number; courses: number };
}

export interface CourseWithRelations {
  id: string;
  code: string;
  title: string;
  description: string | null;
  creditHours: number | null;
  program: { id: string; name: string } | null;
  department: { id: string; name: string } | null;
  _count: { subjects: number; assignments: number; exams: number };
}

export interface SubjectWithRelations {
  id: string;
  title: string;
  description: string | null;
  course: { id: string; title: string };
  _count: { lessons: number };
}

export interface LessonData {
  id: string;
  title: string;
  content: string | null;
  order: number;
  videoUrl: string | null;
  subject: { id: string; title: string };
}

export interface CohortWithRelations {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date | null;
  program: { id: string; name: string } | null;
  _count: { enrollments: number; teacherCohorts: number };
}

export interface EnrollmentWithRelations {
  id: string;
  status: EnrollmentStatus;
  enrolledAt: Date;
  user: SafeUser;
  cohort: { id: string; name: string };
}

export interface AttendanceRecord {
  id: string;
  date: Date;
  status: string;
  remarks: string | null;
  user: SafeUser;
  cohort: { id: string; name: string };
}

// ============================================
// Assessment Types
// ============================================

export interface AssignmentWithRelations {
  id: string;
  title: string;
  description: string | null;
  dueDate: Date | null;
  course: { id: string; title: string };
  _count: { submissions: number; evaluations: number };
}

export interface SubmissionWithRelations {
  id: string;
  content: string | null;
  fileUrl: string | null;
  submittedAt: Date;
  user: SafeUser;
  assignment: { id: string; title: string };
}

export interface ExamWithRelations {
  id: string;
  title: string;
  type: ExamType;
  maxMarks: number;
  passingMarks: number;
  date: Date | null;
  course: { id: string; title: string };
  _count: { results: number };
}

export interface ExamResultData {
  id: string;
  marks: number | null;
  grade: GradeScale | null;
  remarks: string | null;
  user: SafeUser;
  exam: { id: string; title: string; type: ExamType; maxMarks: number };
}

// ============================================
// Finance Types
// ============================================

export interface FeeData {
  id: string;
  title: string;
  type: FeeType;
  amount: number;
  description: string | null;
}

export interface InvoiceWithRelations {
  id: string;
  invoiceNo: string;
  amount: number;
  status: PaymentStatus;
  issuedAt: Date;
  paidAt: Date | null;
  fee: { id: string; title: string; type: FeeType };
  enrollment: {
    id: string;
    user: SafeUser;
    cohort: { id: string; name: string };
  } | null;
}

export interface PaymentData {
  id: string;
  amount: number;
  method: string | null;
  transactionId: string | null;
  paidAt: Date;
  invoice: { id: string; invoiceNo: string };
}

// ============================================
// Communication Types
// ============================================

export interface PostWithRelations {
  id: string;
  content: string;
  imageUrl: string | null;
  createdAt: Date;
  author: SafeUser;
  _count: { comments: number };
}

export interface CommentData {
  id: string;
  content: string;
  createdAt: Date;
  author: SafeUser;
}

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  link: string | null;
}

export interface ConversationWithRelations {
  id: string;
  type: string;
  name: string | null;
  participants: {
    user: SafeUser;
  }[];
  messages: {
    id: string;
    content: string;
    createdAt: Date;
    sender: SafeUser;
  }[];
}

// ============================================
// Dashboard Types
// ============================================

export interface AdminStats {
  totalUsers: number;
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  totalEnrollments: number;
  totalDepartments: number;
  totalRevenue: number;
  pendingPayments: number;
  recentActivities: {
    id: string;
    action: string;
    resource: string | null;
    createdAt: Date;
    user: { username: string } | null;
  }[];
}

export interface StudentDashboardData {
  enrollments: {
    id: string;
    status: EnrollmentStatus;
    cohort: {
      id: string;
      name: string;
      program: { name: string } | null;
    };
  }[];
  recentGrades: {
    id: string;
    marks: number | null;
    grade: GradeScale | null;
    exam: { title: string; type: ExamType; maxMarks: number };
  }[];
  attendanceStats: {
    total: number;
    present: number;
    absent: number;
    late: number;
  };
  upcomingExams: {
    id: string;
    title: string;
    type: ExamType;
    date: Date | null;
    course: { title: string };
  }[];
}

export interface TeacherDashboardData {
  cohorts: {
    id: string;
    name: string;
    _count: { enrollments: number };
  }[];
  totalStudents: number;
  assignments: {
    id: string;
    title: string;
    _count: { submissions: number };
  }[];
  upcomingExams: {
    id: string;
    title: string;
    date: Date | null;
    course: { title: string };
  }[];
}

export interface ParentDashboardData {
  children: {
    id: string;
    name: string;
    username: string;
    enrollments: {
      cohort: { name: string };
      status: EnrollmentStatus;
    }[];
  }[];
}

// ============================================
// Form / Input Types
// ============================================

export interface SelectOption {
  label: string;
  value: string;
}

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  variant?: "default" | "destructive";
}
