import type { User } from "@/app/generated/prisma/client";
import db from "@/lib/prisma";
import type { Term } from "@/types/auth";

/**
 * Look up a user by username or email.
 * Throws descriptive errors so API routes can catch and return proper HTTP responses.
 */
async function getExistingUser({
  username,
  email,
  term,
}: {
  username?: string;
  email?: string;
  term?: Term;
}): Promise<User | null> {
  if (!username && !email) {
    throw new Error("Provide either username or email to find the user.");
  }

  const where =
    username && email
      ? { OR: [{ email }, { username }] }
      : username
        ? { username }
        : { email: email! };

  const existingUser = await db.user.findFirst({ where });

  switch (term) {
    case "register":
      if (existingUser) {
        throw new Error("User already exists with this email or username.");
      }
      return null;
    case "login":
      if (!existingUser) {
        throw new Error("Invalid credentials.");
      }
      return existingUser;
    default:
      return existingUser;
  }
}

export { getExistingUser };
