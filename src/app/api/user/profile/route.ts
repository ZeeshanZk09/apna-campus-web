import { NextResponse } from "next/server";
import { getSessionUser } from "@/app/actions/auth";
import { uploadImage } from "@/lib/cloudinary";
import prisma from "@/lib/prisma";

export async function PUT(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const username = formData.get("username") as string;
    const profilePic = formData.get("profilePic") as File;
    const coverPic = formData.get("coverPic") as File;

    const updateData: any = {};
    if (username) updateData.username = username;

    if (profilePic && profilePic.size > 0) {
      const buffer = Buffer.from(await profilePic.arrayBuffer());
      const result: any = await uploadImage(buffer, "profiles");
      updateData.profilePic = result.secure_url;
    }

    if (coverPic && coverPic.size > 0) {
      const buffer = Buffer.from(await coverPic.arrayBuffer());
      const result: any = await uploadImage(buffer, "covers");
      updateData.coverPic = result.secure_url;
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    console.error("Profile Update Error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 },
    );
  }
}
