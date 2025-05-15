import { NextResponse } from "next/server";
import { requireAuth } from "@/app/lib/utils/auth";
import { updateUserById, findUserById } from "@/app/lib/models/User";
import { uploadImage, deleteImage } from "@/app/lib/utils/cloudinary";

interface UserUpdateData {
  username: string;
  email: string;
  profilePic?: string;
  coverPic?: string;
}

// Helper function to process image upload
async function processImageUpload(
  imageFile: File | null,
  existingUrl: string | undefined,
  folder?: string
): Promise<string | undefined> {
  if (!imageFile) return existingUrl;

  // Delete old image if exists
  if (existingUrl) {
    try {
      await deleteImage(existingUrl);
    } catch (error) {
      console.error("Error deleting old image:", error);
    }
  }

  // Upload new image
  const buffer = await imageFile.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");
  const result = await uploadImage(
    `data:${imageFile.type};base64,${base64}`,
    folder
  );

  return result;
}

// Fetch authenticated user
export async function GET(request: Request) {
  console.log(request);
  try {
    const user = await requireAuth();
    if (user instanceof NextResponse) return user;

    // Fetch fresh data from database
    const currentUser = await findUserById(user._id.toString());
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        _id: currentUser._id,
        username: currentUser.username,
        email: currentUser.email,
        profilePic: currentUser.profilePic,
        coverPic: currentUser.coverPic,
        isAdmin: currentUser.isAdmin,
      },
    });
  } catch (error) {
    console.error("Fetch user error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
// Update user profile
export async function PUT(request: Request) {
  try {
    const user = await requireAuth();
    if (user instanceof NextResponse) return user;

    // Get current user data
    const currentUser = await findUserById(user._id.toString());
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const contentType = request.headers.get("content-type") || "";
    let updateData: Partial<UserUpdateData> = {};

    // Handle form data (file uploads)
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();

      updateData = {
        username: formData.get("username")?.toString() || currentUser.username,
        email: formData.get("email")?.toString() || currentUser.email,
      };

      // Process profile picture
      const profilePic = formData.get("profilePic");
      if (profilePic instanceof File && profilePic.size > 0) {
        updateData.profilePic = await processImageUpload(
          profilePic,
          currentUser.profilePic || undefined,
          "profile_pics"
        );
      }

      // Process cover photo
      const coverPic = formData.get("coverPic");
      if (coverPic instanceof File && coverPic.size > 0) {
        updateData.coverPic = await processImageUpload(
          coverPic,
          currentUser.coverPic || undefined,
          "cover_pics"
        );
      }
    }
    // Handle JSON data (deletions)
    else if (contentType.includes("application/json")) {
      const jsonData = await request.json();
      updateData = jsonData;

      // Handle image deletions
      if (jsonData.profilePic === null && currentUser.profilePic) {
        await deleteImage(currentUser.profilePic);
      }
      if (jsonData.coverPic === null && currentUser.coverPic) {
        await deleteImage(currentUser.coverPic);
      }
    } else {
      return NextResponse.json(
        { error: "Unsupported Content-Type" },
        { status: 415 }
      );
    }

    // Validate data
    if (!updateData.username?.trim() || !updateData.email?.trim()) {
      return NextResponse.json(
        { error: "Username and email are required" },
        { status: 400 }
      );
    }

    // Update user and get the updated document
    await updateUserById(user._id.toString(), updateData);

    // Fetch the updated user data
    const updatedUser = await findUserById(user._id.toString());
    if (!updatedUser) {
      throw new Error("Failed to fetch updated user data");
    }

    return NextResponse.json({
      success: true,
      user: {
        _id: updatedUser._id.toString(),
        username: updatedUser.username,
        email: updatedUser.email,
        profilePic: updatedUser.profilePic || null,
        coverPic: updatedUser.coverPic || null,
      },
    });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to update user",
      },
      { status: 500 }
    );
  }
}
