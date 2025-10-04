import db from '@/lib/prisma';
import generateToken from '@/app/actions/generateToken';
import { getExistingUser } from '@/utils/authHelpers';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const rawData = {
      username: formData.get('username') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    console.log('Form Data in registerUser server action', formData);

    const { username, email, password } = rawData;

    await getExistingUser({ username, email, term: 'register' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        createdAt: new Date(),
      },
    });

    const response = NextResponse.json({
      id: user.id,
      username: user.username,
      email: user.email,
      isBlocked: user.isBlocked,
      isDeleted: user.isDeleted,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });

    const token = (await generateToken(user.id, user)) as string;

    (await cookies()).set('token', token, {
      // Adjust token generation
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    console.log('Form Data in registerUser server action', formData);
    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
