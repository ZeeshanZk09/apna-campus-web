import db from '@/lib/prisma';
import { ApiError } from './NextApiError';

export async function getExistingUser(
  username: string,
  email: string,
  term?: 'register' | 'login'
) {
  const existingUser = await db.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });
  switch (term) {
    case 'register':
      if (existingUser) {
        throw new ApiError(400, 'User already exists');
      }
      return existingUser;
    case 'login':
      if (!existingUser) {
        throw new ApiError(404, 'User does not exist');
      }
      return existingUser;
    default:
      break;
  }
  return existingUser;
}
