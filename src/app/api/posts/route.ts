import ApiError from "@/lib/api/NextApiError";
import ApiSuccess from "@/lib/api/NextApiSuccess";
import { getPrisma } from "@/lib/prisma";

const db = getPrisma();

export async function GET() {
  try {
    const posts = await db.post.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        createdAt: true,
      },
    });
    return new ApiSuccess(posts).toNextResponse();
  } catch (error: any) {
    return ApiError.internal(error.message).toNextResponse();
  }
}
