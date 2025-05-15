import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { findUserById, User } from "@/app/lib/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const generateToken = (userId: string, isAdmin: boolean = false) => {
  return jwt.sign({ userId, isAdmin }, JWT_SECRET, { expiresIn: "30d" });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};
export const setAuthCookie = async (token: string) => {
  const cookieStore = await cookies();

  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: "/",
  });
};

export const clearAuthCookie = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("token");
};

export const getAuthToken = async () => {
  const cookieStore = await cookies();

  return cookieStore.get("token")?.value;
};

export const authenticateUser = async () => {
  const token = await getAuthToken();

  if (!token) {
    return null;
  }

  try {
    const decoded = verifyToken(token) as { userId: string; isAdmin: boolean };
    const user = await findUserById(decoded.userId);

    if (!user) {
      return null;
    }

    return {
      ...(user as User),
      isAdmin: decoded.isAdmin,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const requireAuth = async () => {
  const user = await authenticateUser();

  if (!user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  return user;
};

export const requireAdmin = async () => {
  const user = await authenticateUser();

  if (!user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  if (!user.isAdmin) {
    return NextResponse.json(
      { error: "Admin privileges required" },
      { status: 403 }
    );
  }

  return user;
};
