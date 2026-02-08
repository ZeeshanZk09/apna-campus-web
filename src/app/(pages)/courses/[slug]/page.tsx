import {
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  GraduationCap,
  Users,
} from "lucide-react";
import { notFound } from "next/navigation";
import { getCourseByCode } from "@/lib/queries/academicQueries";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourseByCode(slug);

  if (!course) {
    notFound();
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
      {/* Hero Section */}
      <div className="bg-indigo-700 dark:bg-indigo-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-white/20 backdrop-blur rounded text-xs font-bold uppercase tracking-wider">
              {course.code}
            </span>
            {course.department && (
              <span className="text-indigo-200 text-sm">
                {course.department.name}
              </span>
            )}
          </div>
          <h1 className="text-4xl font-extrabold sm:text-5xl mb-6">
            {course.title}
          </h1>
          <p className="text-xl text-indigo-100 max-w-3xl leading-relaxed">
            {course.description ||
              "Elevate your skills with our comprehensive course designed for industry excellence."}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Overview Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Course Curriculum
              </h2>
              <div className="space-y-4">
                {course.subjects.map((subject) => (
                  <div
                    key={subject.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
                  >
                    <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                      <h3 className="font-bold text-lg dark:text-white">
                        {subject.title}
                      </h3>
                      <span className="text-sm text-gray-50">
                        {subject.lessons.length} Lessons
                      </span>
                    </div>
                    <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                      {subject.lessons.map((lesson) => (
                        <li
                          key={lesson.id}
                          className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center gap-3 text-gray-600 dark:text-gray-300"
                        >
                          <BookOpen size={18} className="text-indigo-500" />
                          <span>{lesson.title}</span>
                          <span className="ml-auto text-xs text-gray-400">
                            Section {lesson.order}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                {course.subjects.length === 0 && (
                  <p className="text-gray-500 italic">
                    No curriculum details available yet.
                  </p>
                )}
              </div>
            </section>

            {/* Assignments & Exams Preview */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 dark:text-white">
                  <CheckCircle className="text-green-500" size={20} />{" "}
                  Assignments
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {course.assignments.length} assignments to test your knowledge
                  throughout the course.
                </p>
              </div>
              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 dark:text-white">
                  <Calendar className="text-amber-500" size={20} /> Exams
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {course.exams.length} comprehensive exams included to validate
                  your learning.
                </p>
              </div>
            </section>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="mb-6">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  Free Enrollment
                </div>
                <p className="text-gray-500 text-sm mt-1">
                  Limited time offer for new students.
                </p>
              </div>

              <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors mb-6">
                Enroll Now
              </button>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                  <Clock size={20} />
                  <span>{course.creditHours} Credit Hours</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                  <GraduationCap size={20} />
                  <span>Certification of Completion</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                  <Users size={20} />
                  <span>Self-paced Learning</span>
                </div>
              </div>
            </div>

            {course.program && (
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-xl border border-indigo-100 dark:border-indigo-800">
                <h4 className="font-bold text-indigo-900 dark:text-indigo-200 mb-2">
                  Part of Program:
                </h4>
                <p className="text-indigo-700 dark:text-indigo-300 font-medium">
                  {course.program.name}
                </p>
                <p className="text-sm text-indigo-600/70 dark:text-indigo-400/70 mt-2">
                  Complete this course as part of your {course.program.name}{" "}
                  journey.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
