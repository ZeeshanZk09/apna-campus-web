/**
 * Role-Based Access Control (RBAC) utilities.
 * Provides authorization checks for routes and actions.
 */

import { type AppRole, appConfig } from "@/config/app";

/**
 * Check if a role has sufficient level for an action.
 */
export function hasRoleLevel(userRole: string, requiredRole: AppRole): boolean {
  const userLevel = appConfig.roles[userRole as AppRole]?.level ?? 0;
  const requiredLevel = appConfig.roles[requiredRole]?.level ?? 100;
  return userLevel >= requiredLevel;
}

/**
 * Check if a role is in the allowed list.
 */
export function isRoleAllowed(
  userRole: string,
  allowedRoles: string[],
): boolean {
  return allowedRoles.includes(userRole);
}

/**
 * Check if user is admin or staff.
 */
export function isAdminOrStaff(role: string): boolean {
  return role === "ADMIN" || role === "STAFF";
}

/**
 * Check if user is a teacher.
 */
export function isTeacher(role: string): boolean {
  return role === "TEACHER";
}

/**
 * Check if user is a student.
 */
export function isStudent(role: string): boolean {
  return role === "STUDENT";
}

/**
 * Check if user is a parent or guardian.
 */
export function isParentOrGuardian(role: string): boolean {
  return role === "PARENT" || role === "GUARDIAN";
}

/**
 * Get the user ID and role from request headers (set by middleware).
 * Returns null if not authenticated.
 */
export function getAuthFromHeaders(
  request: Request,
): { userId: string; role: string } | null {
  const userId = request.headers.get("x-user-id");
  const role = request.headers.get("x-user-role");

  if (!userId || !role) return null;
  return { userId, role };
}

/**
 * Guard an API route — extracts auth from headers, checks role, returns user info.
 * Throws if unauthorized.
 */
export function requireAuth(
  request: Request,
  allowedRoles?: string[],
): { userId: string; role: string } {
  const auth = getAuthFromHeaders(request);

  if (!auth) {
    throw new Error("UNAUTHORIZED");
  }

  if (allowedRoles && !isRoleAllowed(auth.role, allowedRoles)) {
    throw new Error("FORBIDDEN");
  }

  return auth;
}
