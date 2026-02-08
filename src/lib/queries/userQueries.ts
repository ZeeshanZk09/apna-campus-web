import type { User } from "@/app/generated/prisma/client";

// Define the response type for registerUser (matches NextResponse JSON)
export type UserResponse = Omit<
  User,
  "password" | "twoFactorEnabled" | "twoFactorSecret"
>;

// Query keys for consistent cache management
export const QUERY_KEYS = {
  userById: (id: string) => ["user", id],
  userProfile: (id: string) => ["userProfile", id],
};

// Fetch all users (server-side)
export async function getAllUsers() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || ""}/api/admin/users`,
      {
        cache: "no-store",
      },
    );
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return [];
  }
}
