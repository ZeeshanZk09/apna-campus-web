import { NextResponse } from "next/server";
import { getSessionUser } from "@/app/actions/auth";
import db from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [
      totalUsers,
      totalStudents,
      totalTeachers,
      totalCourses,
      totalDepartments,
      totalEnrollments,
      recentUsers,
    ] = await Promise.all([
      db.user.count({ where: { isDeleted: false } }),
      db.user.count({ where: { isDeleted: false, role: "STUDENT" } }),
      db.user.count({ where: { isDeleted: false, role: "TEACHER" } }),
      db.course.count({ where: { deletedAt: null } }),
      db.department.count(),
      db.enrollment.count(),
      db.user.findMany({
        where: { isDeleted: false },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          name: true,
          username: true,
          role: true,
          createdAt: true,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        totalStudents,
        totalTeachers,
        totalCourses,
        totalDepartments,
        totalEnrollments,
        recentUsers,
      },
    });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to fetch admin stats" },
      { status: 500 },
    );
  }
}
