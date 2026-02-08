// src/lib/queries/auxiliaryQueries.ts
import db from "@/lib/prisma";

// --- Testimonial Queries ---

export async function getApprovedTestimonials() {
  return await db.testimonial.findMany({
    where: { approved: true },
    include: { user: true },
  });
}

export async function submitTestimonial(data: {
  userId?: string;
  name?: string;
  role?: string;
  content: string;
  rating?: number;
}) {
  return await db.testimonial.create({
    data,
  });
}

export async function approveTestimonial(id: string) {
  return await db.testimonial.update({
    where: { id },
    data: { approved: true },
  });
}
