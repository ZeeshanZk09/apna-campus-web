import ApiError from "@/lib/api/NextApiError";
import ApiSuccess from "@/lib/api/NextApiSuccess";
import { createCourse, getAllCourses } from "@/lib/queries/academicQueries";

export async function GET() {
  try {
    const courses = await getAllCourses();
    return new ApiSuccess(courses).toNextResponse();
  } catch (error: any) {
    return ApiError.internal(error.message).toNextResponse();
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const course = await createCourse(body);
    return new ApiSuccess(course, 201).toNextResponse();
  } catch (error: any) {
    return ApiError.internal(error.message).toNextResponse();
  }
}
