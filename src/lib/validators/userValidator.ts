import z from "zod";

/**
 * fileLike:
 * - Accepts File or Blob-like objects (browser File)
 * - We cannot rely on `instanceof File` in all runtimes, so we use a lightweight duck-typing check.
 */
const fileLike = z.custom<File | Blob>((v) => {
  if (v == null) return false;
  try {
    // duck-type check for File/Blob
    return (
      typeof v === "object" &&
      "name" in (v as any) &&
      typeof (v as any).size === "number"
    );
  } catch {
    return false;
  }
});

/**
 * fileOrUrl:
 * - Accepts either a valid URL string (your uploaded image URL), OR a File/Blob object (before upload).
 * - We mark .optional() so the key can be absent; .nullable() permits explicit null.
 */
const _fileOrUrl = z.union([z.string().url(), fileLike]).optional().nullable();

const userSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .catch(""),
  email: z.string().email("Invalid email").catch(""),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .catch(""),
  role: z
    .enum([
      "TEACHER",
      "STUDENT",
      "PARENT",
      "GUARDIAN",
      "STAFF",
      "USER",
      "GUEST",
    ])
    .optional(),
  name: z.string().min(3, "Name must be at least 3 characters").catch(""),
});

// Partial schema for updates
const updateUserSchema = userSchema.partial();

export { userSchema, updateUserSchema };
export type UserSchema = z.infer<typeof userSchema>;
