import clientPromise from '@/app/lib/db/connect';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';

export interface User {
  _id: ObjectId;
  username: string;
  email: string;
  password: string;
  profilePic?: string;
  coverPic?: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const createUser = async (userData: Omit<User, '_id' | 'createdAt' | 'updatedAt'>) => {
  const client = await clientPromise;
  const db = client.db();

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password, salt);

  const newUser = {
    ...userData,
    password: hashedPassword,
    isAdmin: false,
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },
  };

  const result = await db.collection('users').insertOne(newUser);
  return result.insertedId;
};

export const findUserByEmail = async (email: string) => {
  const client = await clientPromise;
  const db = client.db();
  return await db.collection('users').findOne({ email });
};
export const findUserByUsername = async (username: string) => {
  const client = await clientPromise;
  const db = client.db();
  return await db.collection('users').findOne({ username });
};

export const findUserById = async (id: string) => {
  const client = await clientPromise;
  const db = client.db();
  return await db.collection('users').findOne({ _id: new ObjectId(id) });
};

export const updateUserById = async (id: string, updateData: Partial<User>) => {
  const client = await clientPromise;
  const db = client.db();

  const updateObj = {
    ...updateData,
    updatedAt: Date.now(),
  };

  if (updateData.password) {
    const salt = await bcrypt.genSalt(10);
    updateObj.password = await bcrypt.hash(updateData.password, salt);
  }

  return await db.collection('users').updateOne({ _id: new ObjectId(id) }, { $set: updateObj });
};

export const deleteUserById = async (id: string) => {
  const client = await clientPromise;
  const db = client.db();
  return await db.collection('users').deleteOne({ _id: new ObjectId(id) });
};

export const getAllUsers = async () => {
  const client = await clientPromise;
  const db = client.db();
  return await db.collection('users').find().toArray();
};

export const comparePasswords = async (password: string, hashedPassword: string) => {
  return await bcrypt.compare(password, hashedPassword);
};
