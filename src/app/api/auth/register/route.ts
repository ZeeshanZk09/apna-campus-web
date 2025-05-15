import { NextResponse } from "next/server";
import { createUser, findUserByEmail } from "@/app/lib/models/User";
import { generateToken, setAuthCookie } from "@/app/lib/utils/auth";
import { uploadImage } from "@/app/lib/utils/cloudinary";

export async function POST(request: Request) {
  try {
    // Check content type
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Content-Type must be multipart/form-data" },
        { status: 400 }
      );
    }

    const formData = await request.formData();

    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const profilePic = formData.get("profilePic") as File | null;
    const coverPic = formData.get("coverPic") as File | null;

    // Check if user exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      );
    }

    // Upload images to Cloudinary
    let profilePicUrl = null;
    if (profilePic) {
      const profilePicBuffer = await profilePic.arrayBuffer();
      const profilePicBase64 = Buffer.from(profilePicBuffer).toString("base64");
      profilePicUrl = await uploadImage(
        `data:${profilePic.type};base64,${profilePicBase64}`
      );
    }

    let coverPicUrl = null;
    if (coverPic) {
      const coverPicBuffer = await coverPic.arrayBuffer();
      const coverPicBase64 = Buffer.from(coverPicBuffer).toString("base64");
      coverPicUrl = await uploadImage(
        `data:${coverPic.type};base64,${coverPicBase64}`,
        "cover_pics"
      );
    }

    // Create user
    const userData = {
      username,
      email,
      password,
      profilePic: profilePicUrl || undefined,
      coverPic: coverPicUrl || undefined,
      isAdmin: false,
    };

    const userId = await createUser(userData);

    // Generate token and set cookie
    const token = generateToken(userId.toString());
    setAuthCookie(token);

    return NextResponse.json({ success: true, userId }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}
