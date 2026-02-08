// src/app/actions/auxiliary.ts
"use server";

import { revalidatePath } from "next/cache";
import * as queries from "@/lib/queries/auxiliaryQueries";

// --- Testimonials ---

export async function submitTestimonialAction(formData: FormData) {
  const content = formData.get("content") as string;
  try {
    await queries.submitTestimonial({ content });
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function approveTestimonialAction(id: string) {
  try {
    await queries.approveTestimonial(id);
    revalidatePath("/admin/testimonials");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
