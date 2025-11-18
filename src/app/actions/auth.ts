'use server';

import { UserUpdateInput } from '@/app/generated/prisma/models';
import { getPrisma } from '@/lib/prisma';
import { uploadFile } from '@/lib/cloudinary';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { updateUserSchema } from '@/lib/validators/userValidator';
import { revalidatePath } from 'next/cache';
const db = getPrisma();

export async function getUserById(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId, isDeleted: false },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    Gender: user.Gender,
    profilePic: user.profilePic,
    coverPic: user.coverPic,
    isBlocked: user.isBlocked,
    isDeleted: user.isDeleted,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function updateUser(userId: string, formData: FormData) {
  // Extract fields from FormData
  const rawData = {
    username: formData.get('username') as string | null,
    email: formData.get('email') as string | null,
    password: formData.get('password') as string | null,
    profilePic: null as string | null,
    coverPic: null as string | null,
  };

  // Handle file uploads if present
  const profilePicFile = formData.get('profilePic') as File | null;
  if (profilePicFile) {
    rawData.profilePic = await uploadFile(profilePicFile, rawData.username || userId);
  }

  const coverPicFile = formData.get('coverPic') as File | null;
  if (coverPicFile) {
    rawData.coverPic = await uploadFile(coverPicFile, rawData.username || userId);
  }

  // Validate extracted data
  const parsed = updateUserSchema.safeParse(rawData);
  if (!parsed.success) {
    throw new Error('Invalid form data');
  }

  const { username, email, password } = parsed.data;

  const updateData: Partial<{
    username: string | null;
    email: string;
    password: string;
    profilePic: string | null;
    coverPic: string | null;
  }> = {};

  if (username !== undefined) updateData.username = username;
  if (email) updateData.email = email;
  if (password) updateData.password = await bcrypt.hash(password, 10);
  // if (profilePicFile !== undefined) updateData.profilePic! = profilePicFile as string;
  // if (coverPicFile !== undefined) updateData.coverPic! = coverPicFile ;

  const user = await db.user.update({
    where: { id: userId, isDeleted: false },
    data: updateData as UserUpdateInput,
  });

  revalidatePath('/profile');

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    Gender: user.Gender,
    profilePic: user.profilePic,
    coverPic: user.coverPic,
    isBlocked: user.isBlocked,
    isDeleted: user.isDeleted,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function deleteUser(userId: string) {
  const user = await db.user.update({
    where: { id: userId, isDeleted: false },
    data: { isDeleted: true },
  });

  (await cookies()).delete('token');
  revalidatePath('/profile');

  return;
}
