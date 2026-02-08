'use server';

import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import type { UserUpdateInput } from '@/app/generated/prisma/models';
import { createAuditLog } from '@/lib/audit';
import { getSessionUser } from '@/lib/auth/authHelpers';
import { uploadFile } from '@/lib/cloudinary';
import db from '@/lib/prisma';
import { updateUserSchema } from '@/lib/validators/userValidator';

export { getSessionUser };

export async function getUserById(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId, isDeleted: false },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    gender: user.gender,
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
    name: formData.get('name') as string | null,
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

  const { name, username, email, password } = parsed.data;

  const updateData: Partial<{
    name: string | null;
    username: string | null;
    email: string;
    password: string;
    profilePic: string | null;
    coverPic: string | null;
  }> = {};

  if (name) updateData.name = name;
  if (username !== undefined) updateData.username = username;
  if (email) updateData.email = email;
  if (password) updateData.password = await bcrypt.hash(password, 10);
  // if (profilePicFile !== undefined) updateData.profilePic! = profilePicFile as string;
  // if (coverPicFile !== undefined) updateData.coverPic! = coverPicFile ;

  const user = await db.user.update({
    where: { id: userId, isDeleted: false },
    data: updateData as UserUpdateInput,
  });

  await createAuditLog({
    action: 'UPDATE',
    resource: 'UserProfile',
    resourceId: userId,
    meta: { fields: Object.keys(updateData) },
  });

  revalidatePath('/dashboard');

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    gender: user.gender,
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
  const _user = await db.user.update({
    where: { id: userId, isDeleted: false },
    data: { isDeleted: true },
  });

  const cookieStore = await cookies();
  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');
  revalidatePath('/dashboard');

  return;
}
