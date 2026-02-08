import ApiError from "@/lib/api/NextApiError";
import ApiSuccess from "@/lib/api/NextApiSuccess";
import { getCourseByCode } from "@/lib/queries/academicQueries";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const course = await getCourseByCode(slug);
    if (!course) {
      return new ApiError(404, "Course not found").toNextResponse();
    }
    return new ApiSuccess(course).toNextResponse();
  } catch (error: any) {
    return ApiError.internal(error.message).toNextResponse();
  }
}
