import ApiError from "@/lib/api/NextApiError";
import ApiSuccess from "@/lib/api/NextApiSuccess";
import { getPrisma } from "@/lib/prisma";

const db = getPrisma();

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const post = await db.post.findUnique({
      where: { slug: slug },
      include: {
        user: {
          select: {
            username: true,
            profilePic: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                username: true,
                profilePic: true,
              },
            },
          },
        },
      },
    });

    if (!post) {
      return new ApiError(404, "Post not found").toNextResponse();
    }

    return new ApiSuccess(post).toNextResponse();
  } catch (error: any) {
    return ApiError.internal(error.message).toNextResponse();
  }
}
