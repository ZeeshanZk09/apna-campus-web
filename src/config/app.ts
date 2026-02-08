/**
 * Application configuration — centralized settings for all modules.
 * Environment-specific values come from constants.ts which reads env vars.
 */
import { DEFAULT_PAGE_SIZE, IS_PRODUCTION, SITE_URL } from "@/lib/constants";

export const appConfig = {
  /** Application identity */
  name: "Apna Campus",
  description: "Learning Management System",
  url: SITE_URL,
  isProduction: IS_PRODUCTION,

  /** Authentication settings */
  auth: {
    accessTokenExpiry: "1d",
    refreshTokenExpiry: "30d",
    sessionExpiry: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes in ms
    passwordMinLength: 8,
    requireTwoFactor: false,
  },

  /** Pagination defaults */
  pagination: {
    defaultPageSize: DEFAULT_PAGE_SIZE,
    maxPageSize: 100,
  },

  /** File upload settings */
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedImageTypes: ["image/jpeg", "image/png", "image/webp"],
    allowedDocTypes: ["application/pdf", "application/msword"],
    maxFilesPerUpload: 5,
  },

  /** Rate limiting settings (requests per window) */
  rateLimit: {
    auth: { windowMs: 15 * 60 * 1000, max: 10 }, // 10 requests per 15 min
    api: { windowMs: 60 * 1000, max: 100 }, // 100 requests per minute
    upload: { windowMs: 60 * 1000, max: 10 }, // 10 uploads per minute
  },

  /** Roles hierarchy for authorization */
  roles: {
    ADMIN: { level: 100, label: "Administrator" },
    STAFF: { level: 80, label: "Staff" },
    TEACHER: { level: 60, label: "Teacher" },
    PARENT: { level: 40, label: "Parent" },
    GUARDIAN: { level: 40, label: "Guardian" },
    STUDENT: { level: 20, label: "Student" },
    USER: { level: 10, label: "User" },
    GUEST: { level: 0, label: "Guest" },
  },
} as const;

export type AppRole = keyof typeof appConfig.roles;
