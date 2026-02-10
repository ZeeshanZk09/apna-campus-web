import type { User } from '@/app/generated/prisma/client';

// Define the response type for registerUser (matches NextResponse JSON)
export type UserResponse = Omit<User, 'password' | 'twoFactorEnabled' | 'twoFactorSecret'>;

// Query keys for consistent cache management
export const QUERY_KEYS = {
  userById: (id: string) => ['user', id],
  userProfile: (id: string) => ['userProfile', id],
};

// Fetch all users (server-side)
export async function getAllUsers() {
  try {
    // If running on the server, query the database directly to avoid
    // making an internal no-store fetch that forces dynamic rendering.
    if (typeof window === 'undefined') {
      const { prisma } = await import('@/lib/prisma');
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          username: true,
          role: true,
          gender: true,
          profilePic: true,
          isBlocked: true,
          isDeleted: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      });
      return users || [];
    }

    // Client-side: fetch from the API route
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ''}/api/admin/users`);
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return [];
  }
}
