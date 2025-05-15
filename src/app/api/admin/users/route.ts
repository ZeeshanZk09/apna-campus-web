import { NextResponse } from "next/server";
import { requireAdmin } from "@/app/lib/utils/auth";
import {
  getAllUsers,
  findUserById,
  updateUserById,
  deleteUserById,
  findUserByEmail,
  findUserByUsername,
} from "@/app/lib/models/User";

export async function GET(request: Request) {
  try {
    const admin = await requireAdmin();
    if (admin instanceof NextResponse) return admin;

    const users = await getAllUsers();

    if (users) {
      const sanitizedUsers = users.map((user) => ({
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
        coverPic: user.coverPic,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }));

      return NextResponse.json({ users: sanitizedUsers });
    }

    // Get search query from URL parameters
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim();

    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    let user = null;

    // Try searching by ObjectId first (if query looks like a valid MongoDB ID)
    if (/^[0-9a-fA-F]{24}$/.test(query)) {
      user = await findUserById(query);
    }

    // If not found by ID, try searching by email
    if (!user && query.includes("@")) {
      user = await findUserByEmail(query);
    }

    // If still not found, try searching by username
    if (!user) {
      user = await findUserByUsername(query);
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Remove sensitive data before returning
    const sanitizedUser = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic,
      coverPic: user.coverPic,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return NextResponse.json({ user: sanitizedUser });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to search users" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const admin = await requireAdmin();
    if (admin instanceof NextResponse) return admin;

    const { userId, ...updateData } = await request.json();

    await updateUserById(userId, updateData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const admin = await requireAdmin();
    if (admin instanceof NextResponse) return admin;

    const { userId } = await request.json();

    await deleteUserById(userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
