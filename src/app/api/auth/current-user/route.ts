import { NextResponse } from "next/server";
import { authenticateUser } from "@/app/lib/utils/auth";

export async function GET() {
  try {
    const user = await authenticateUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePic: user?.profilePic,
        coverPic: user?.coverPic,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
