import { NextResponse } from "next/server";
import { getSessionUser } from "@/app/actions/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query || query.length < 3) {
      return NextResponse.json({ results: [] });
    }

    const results: any[] = [];

    // Search Courses
    const courses = await prisma.course.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { code: { contains: query, mode: "insensitive" } },
        ],
        deletedAt: null,
      },
      take: 5,
    });

    courses.forEach((c) => {
      results.push({
        id: c.id,
        type: "course",
        title: c.title,
        subtitle: c.code,
        url:
          user.role === "ADMIN"
            ? `/admin/academics/courses/${c.id}`
            : `/dashboard/courses/${c.id}`,
      });
    });

    // Search Users (Admin only)
    if (user.role === "ADMIN") {
      const users = await prisma.user.findMany({
        where: {
          OR: [
            { username: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
          ],
        },
        take: 5,
      });

      users.forEach((u) => {
        results.push({
          id: u.id,
          type: "user",
          title: u.username,
          subtitle: u.role,
          url: `/admin/users/${u.id}`,
        });
      });
    }

    // Search Departments
    const departments = await prisma.department.findMany({
      where: {
        name: { contains: query, mode: "insensitive" },
      },
      take: 3,
    });

    departments.forEach((d) => {
      results.push({
        id: d.id,
        type: "department",
        title: d.name,
        subtitle: "Department",
        url: `/admin/academics/departments/${d.id}`,
      });
    });

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
