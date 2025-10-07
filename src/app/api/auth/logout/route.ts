import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';
import { decodeJwt } from 'jose';
import { ACCESS_TOKEN_SECRET } from '@/lib/constants';
import { SessionWhereUniqueInput } from '@/app/generated/prisma/models';
const db = getPrisma();
type JwtPayloadLike = Record<string, any>;

export async function POST() {
  try {
    const cookieStore = await cookies();
    let decoded: JwtPayloadLike | undefined;

    decoded = decodeJwt(cookieStore.get('token')?.value!);
    try {
      await db.session.delete({
        where: {
          userId: decoded.id,
        } as SessionWhereUniqueInput,
      });
    } catch (error) {}

    cookieStore.delete('token');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Failed to logout' }, { status: 500 });
  }
}
