import { NextResponse } from "next/server";
import { authenticateUser } from "../utils/auth";

export async function adminMiddleware(request: Request) {
  const user = await authenticateUser();

  if (!user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  if (!user.isAdmin) {
    return NextResponse.json(
      { error: "Admin privileges required" },
      { status: 403 }
    );
  }

  return NextResponse.next();
}
