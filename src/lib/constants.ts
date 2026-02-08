/**
 * @file Centralized constants and environment variable proxy
 */

// Deployment Environment
export const IS_PRODUCTION = process.env.NODE_ENV === "production";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// API Configuration
export const API_BASE_URL = `${SITE_URL}/api`;
export const API_VERSION = "v1";

// Authentication & Security
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET ?? "";
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET ?? "";
export const SESSION_EXPIRY = "7d";
export const ACCESS_TOKEN_EXPIRY = "15m";
export const REFRESH_TOKEN_EXPIRY = "30d";

// Database
export const DATABASE_URL = process.env.DATABASE_URL;

// Cloudinary (Media Management)
export const CLOUDINARY_CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

// Third Party Integrations
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
export const NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

export const GOOGLE_ANALYTICS_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
export const OPTIMIZE_API_KEY = process.env.OPTIMIZE_API_KEY;

// Feature Flags
export const ENABLE_CHAT = true;
export const ENABLE_PAYMENTS = true;
export const ENABLE_NOTIFICATIONS = true;
export const ENABLE_FILE_UPLOADS = true;

// Pagination & UI
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

// Roles (referencing Prisma Role enum but exported for ease)
export const ROLES = {
  ADMIN: "ADMIN",
  TEACHER: "TEACHER",
  STUDENT: "STUDENT",
  PARENT: "PARENT",
  STAFF: "STAFF",
  USER: "USER",
  GUEST: "GUEST",
} as const;

// Cache settings
export const REVALIDATE_INTERVAL = 3600; // 1 hour
