import { Term } from '@/utils/auth/authHelpers';
import { ApiError } from '@/utils/NextApiError';
import { NextResponse } from 'next/server';
import db from '@/lib/prisma';

/**
 * Find an existing user by username OR email.
 * At least one of `username` or `email` must be provided.
 */

async function getExistingUser({
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
      new ApiError(400, 'Provide either username or email to find the user'),
      { status: 400 }
    );
  }

  // build where clause based on what was provided
  const where =
    username && email ? { OR: [{ email }, { username }] } : username ? { username } : { email };

  const existingUser = await db.user.findFirst({ where });

  switch (term) {
    case 'register':
      if (existingUser) {
        return NextResponse.json(new ApiError(400, 'User already exists'), { status: 400 });
      }
      return existingUser;
    case 'login':
      if (!existingUser) {
        return NextResponse.json(new ApiError(404, 'User does not exist'), { status: 404 });
      }
      return existingUser;
    default:
      return existingUser;
  }
}

export { getExistingUser };
