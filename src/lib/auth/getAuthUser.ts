import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth/token";

export async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) return null;

  try {
    const { payload } = await verifyAccessToken(token);
    if (!payload || !payload.id) return null;

    // We only need the ID and some basics
    return {
      id: payload.id as string,
      username: payload.username as string,
      email: payload.email as string,
      role: payload.role as string,
    };
  } catch (_error) {
    return null;
  }
}
