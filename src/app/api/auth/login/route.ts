// app/api/auth/login/route.ts
import { User } from '@/app/generated/prisma/client';
import { getExistingUser } from '@/lib/services/auth/userServices';
import generateToken from '@/utils/auth/generateToken';
import { ApiError } from '@/utils/NextApiError';
import { compare } from 'bcryptjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const rawData = {
      username: formData.get('username') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    console.log('Form Data in loginUser server action', formData);

    const { username, email, password } = rawData;

    if ((!username && !email) || !password) {
      return NextResponse.json(new ApiError(400, 'Email or username and password are required.'), {
        status: 400,
      });
    }

    const user = (await getExistingUser({ username, email, term: 'login' })) as User;

    // Verify password
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Generate token
    const token = (await generateToken(user.id, user)) as string;

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        } as User,
      },
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );

    // Set cookie
    (await cookies()).set('token', token, {
      // Adjust token generation
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
