import { z } from "zod";

/**
 * Authentication validators — Zod schemas for auth-related inputs.
 */

export const loginSchema = z
  .object({
    identifier: z.string().min(1, "Email or username is required").optional(),
    email: z.string().optional(),
    username: z.string().optional(),
    password: z.string().min(1, "Password is required"),
  })
  .refine((data) => data.identifier || data.email || data.username, {
    message: "Email or username is required",
    path: ["identifier"],
  })
  .transform((data) => ({
    ...data,
    identifier: data.identifier || data.email || data.username || "",
  }));

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30)
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, numbers, hyphens, and underscores",
    ),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
});

export const verify2FASchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  code: z
    .string()
    .length(6, "TOTP code must be 6 digits")
    .regex(/^\d+$/, "Code must be numeric"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type Verify2FAInput = z.infer<typeof verify2FASchema>;
