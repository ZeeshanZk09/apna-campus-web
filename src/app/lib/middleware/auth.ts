import { NextResponse } from "next/server";
import { authenticateUser } from "@/app/lib/utils/auth";

export async function authMiddleware(request: Request) {
  const user = await authenticateUser();

  if (!user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  return NextResponse.next();
}
