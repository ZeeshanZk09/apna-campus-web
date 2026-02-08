import ApiError from "@/lib/api/NextApiError";
import ApiSuccess from "@/lib/api/NextApiSuccess";
import { getPrisma } from "@/lib/prisma";

const db = getPrisma();

export async function GET() {
  try {
    const posts = await db.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            username: true,
            profilePic: true,
          },
        },
        _count: {
          select: { comments: true },
        },
      },
    });
    return new ApiSuccess(posts).toNextResponse();
  } catch (error: any) {
    return ApiError.internal(error.message).toNextResponse();
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const slug =
      body.slug ||
      body.title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
    const post = await db.post.create({
      data: {
        title: body.title,
        slug,
        content: body.content,
        images: body.images || [],
        userId: body.userId,
        adminId: body.adminId,
      },
    });
    return new ApiSuccess(post, 201).toNextResponse();
  } catch (error: any) {
    return ApiError.internal(error.message).toNextResponse();
  }
}
