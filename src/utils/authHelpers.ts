import db from "@/lib/prisma";
import { ApiError } from "./NextApiError";
import { NextResponse } from "next/server";

type Term = "register" | "login";

/**
 * Find an existing user by username OR email.
 * At least one of `username` or `email` must be provided.
 */
export async function getExistingUser({
  username,
  email,
  term,
}: {
  username?: string;
  email?: string;
  term?: Term;
}) {
  // require at least one identifier
  if (!username && !email) {
    return NextResponse.json(
      new ApiError(400, "Provide either username or email to find the user"),
      { status: 400 }
    );
  }

  // build where clause based on what was provided
  const where =
    username && email
      ? { OR: [{ email }, { username }] }
      : username
      ? { username }
      : { email };

  const existingUser = await db.user.findFirst({ where } );

  switch (term) {
    case "register":
      if (existingUser) {
        return NextResponse.json(new ApiError(400, "User already exists"), { status: 400 });
      }
      return existingUser;
    case "login":
      if (!existingUser) {
        return NextResponse.json(new ApiError(404, "User does not exist"), { status: 404 });
      }
      return existingUser;
    default:
      return existingUser;
  }
}
