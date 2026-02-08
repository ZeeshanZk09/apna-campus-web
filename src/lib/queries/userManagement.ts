// src/lib/queries/userManagement.ts
import type { Role } from "@/app/generated/prisma/enums";
import db from "@/lib/prisma";

/**
 * Follow a user
 */
export async function followUser(followerId: string, followingId: string) {
  return await db.follow.create({
    data: {
      followerId,
      followingId,
    },
  });
}

/**
 * Unfollow a user
 */
export async function unfollowUser(followerId: string, followingId: string) {
  return await db.follow.deleteMany({
    where: {
      followerId,
      followingId,
    },
  });
}

/**
 * Manage Parent-Child Relationship
 */
export async function linkParentToChild(
  parentId: string,
  childId: string,
  relation: string,
) {
  return await db.parentChild.upsert({
    where: {
      parentId_childId: { parentId, childId },
    },
    update: { relation },
    create: { parentId, childId, relation },
  });
}

/**
 * Block/Unblock User
 */
export async function setBlockStatus(userId: string, isBlocked: boolean) {
  return await db.user.update({
    where: { id: userId },
    data: { isBlocked },
  });
}

/**
 * Create User (Admin)
 */
export async function createUser(data: {
  name: string;
  username: string;
  email: string;
  passwordHash: string;
  role: Role;
}) {
  return await db.user.create({
    data: {
      name: data.name,
      username: data.username,
      email: data.email,
      password: data.passwordHash,
      role: data.role,
    },
  });
}

/**
 * Update User (Admin)
 */
export async function updateUserAdmin(
  userId: string,
  data: Partial<{
    username: string;
    email: string;
    role: Role;
    isBlocked: boolean;
  }>,
) {
  return await db.user.update({
    where: { id: userId },
    data,
  });
}

/**
 * Get users by role
 */
export async function getUsersByRole(role: Role) {
  return await db.user.findMany({
    where: { role, isDeleted: false },
    select: {
      id: true,
      username: true,
      email: true,
      profilePic: true,
    },
  });
}

/**
 * Search users by username or email
 */
export async function searchUsers(query: string) {
  return await db.user.findMany({
    where: {
      OR: [
        { username: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
      ],
      isDeleted: false,
    },
    take: 20,
  });
}

/**
 * Get summary of all users count
 */
export async function getUserStats() {
  const [total, students, teachers] = await Promise.all([
    db.user.count({ where: { isDeleted: false } }),
    db.user.count({ where: { role: "STUDENT", isDeleted: false } }),
    db.user.count({ where: { role: "TEACHER", isDeleted: false } }),
  ]);
  return { total, students, teachers };
}

/**
 * Get all children for a parent with their academic summary
 */
export async function getChildrenSummary(parentId: string) {
  return await db.parentChild.findMany({
    where: { parentId },
    include: {
      child: {
        include: {
          enrollments: {
            include: {
              cohort: true,
              Attendance: {
                take: 5,
                orderBy: { date: "desc" },
              },
              ExamResult: {
                include: { exam: true },
              },
              Invoice: {
                where: { status: "PENDING" },
              },
            },
          },
        },
      },
    },
  });
}

/**
 * Get children's upcoming exams
 */
export async function getChildrenExams(parentId: string) {
  return await db.parentChild.findMany({
    where: { parentId },
    include: {
      child: {
        include: {
          enrollments: {
            include: {
              cohort: {
                include: {
                  program: {
                    include: {
                      courses: {
                        include: {
                          exams: {
                            where: { date: { gte: new Date() } },
                            orderBy: { date: "asc" },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
}
