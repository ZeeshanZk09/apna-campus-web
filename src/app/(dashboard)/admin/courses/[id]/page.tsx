// src/app/admin/courses/[id]/page.tsx

import {
  BookOpen,
  ChevronRight,
  FileCheck,
  FileText,
  Layers,
  Video,
} from "lucide-react";
import { notFound } from "next/navigation";
import ProtectedRoute from "@/components/ui/ProtectedRoute";
import db from "@/lib/prisma";
import LessonForm from "../_components/LessonForm";
import SubjectForm from "../_components/SubjectForm";

export const dynamic = "force-dynamic";

async function getCourseDetails(id: string) {
  return await db.course.findUnique({
    where: { id },
    include: {
      subjects: {
        include: {
          lessons: true,
        },
        orderBy: { title: "asc" },
      },
      program: true,
      department: true,
    },
  });
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const course = await getCourseDetails(id);

  if (!course) notFound();

  return (
    <ProtectedRoute adminOnly>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-indigo-500 font-bold text-xs uppercase tracking-widest mb-2">
              <BookOpen size={14} /> Curriculum Management
            </div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
              {course.title}{" "}
              <span className="text-gray-300 dark:text-gray-700">
                / {course.code}
              </span>
            </h1>
            <p className="text-gray-500 mt-2 max-w-2xl">
              {course.description ||
                "Manage the learning structure and content for this course."}
            </p>
          </div>

          <div className="flex gap-3">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600">
                <Layers size={20} />
              </div>
              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase">
                  Subjects
                </div>
                <div className="text-lg font-black dark:text-white">
                  {course.subjects.length}
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/40 flex items-center justify-center text-green-600">
                <FileText size={20} />
              </div>
              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase">
                  Total Lessons
                </div>
                <div className="text-lg font-black dark:text-white">
                  {course.subjects.reduce(
                    (acc, s) => acc + s.lessons.length,
                    0,
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content: Subjects & Lessons */}
          <div className="lg:col-span-2 space-y-8">
            {course.subjects.length === 0 ? (
              <div className="bg-gray-50 dark:bg-gray-900/40 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800 p-20 text-center">
                <Layers
                  size={64}
                  className="mx-auto text-gray-200 dark:text-gray-800 mb-6"
                />
                <h3 className="text-xl font-bold dark:text-white mb-2">
                  Structure is Empty
                </h3>
                <p className="text-gray-500">
                  Start by adding a subject or module to this course.
                </p>
              </div>
            ) : (
              course.subjects.map((subject) => (
                <div
                  key={subject.id}
                  className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm"
                >
                  <div className="p-6 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                        {subject.title.charAt(0)}
                      </div>
                      <h4 className="font-bold text-lg dark:text-white">
                        {subject.title}
                      </h4>
                    </div>
                    <LessonForm subjectId={subject.id} />
                  </div>

                  <div className="divide-y divide-gray-50 dark:divide-gray-700">
                    {subject.lessons.length === 0 ? (
                      <div className="p-10 text-center text-sm text-gray-400">
                        No lessons added to this subject yet.
                      </div>
                    ) : (
                      subject.lessons
                        .sort((a, b) => (a.order || 0) - (b.order || 0))
                        .map((lesson) => (
                          <div
                            key={lesson.id}
                            className="p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors group"
                          >
                            <div className="flex items-center gap-4">
                              <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                                <ChevronRight size={16} />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-bold text-sm dark:text-white">
                                  {lesson.title}
                                </span>
                                <span className="text-[10px] text-gray-400 uppercase font-medium">
                                  Order: {lesson.order}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button className="p-2 text-gray-300 hover:text-indigo-500 transition-colors">
                                <Video size={16} />
                              </button>
                              <button className="p-2 text-gray-300 hover:text-green-500 transition-colors">
                                <FileCheck size={16} />
                              </button>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Sidebar Forms */}
          <div className="lg:col-span-1 space-y-8">
            <div className="sticky top-8 space-y-8">
              <SubjectForm courseId={course.id} />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
