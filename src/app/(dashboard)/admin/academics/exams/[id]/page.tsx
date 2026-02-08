import {
  ArrowLeft,
  Calendar,
  GraduationCap,
  Target,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getExamById } from "@/lib/queries/assessmentQueries";
import ExamResultForm from "../../_components/ExamResultForm";

interface ExamDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function ExamDetailsPage({
  params,
}: ExamDetailsPageProps) {
  const { id } = await params;
  const exam = await getExamById(id);

  if (!exam) return notFound();

  // Extract all students from all cohorts of the program
  const cohorts = exam.course.program?.cohorts || [];
  const allEnrollments = cohorts.flatMap((c) => c.enrollments);

  return (
    <div className="space-y-8 p-8">
      {/* Back link */}
      <Link
        href="/admin/academics/exams"
        className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-orange-500 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Exams
      </Link>

      {/* Hero Card */}
      <div className="bg-card rounded-[2.5rem] border border-border p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-5">
            <div className="p-5 bg-orange-500 rounded-[2rem] text-white shadow-xl shadow-orange-500/20">
              <Trophy size={32} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-md">
                  {exam.course.code}
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  {exam.type} EXAM
                </span>
              </div>
              <h1 className="text-4xl font-black tracking-tight">
                {exam.title}
              </h1>
              <p className="text-muted-foreground font-medium mt-1">
                {exam.course.title}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-3xl">
              <div className="p-2 bg-card rounded-xl text-muted-foreground">
                <Calendar size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black tracking-widest uppercase opacity-50">
                  Exam Date
                </p>
                <p className="text-sm font-black">
                  {exam.date ? new Date(exam.date).toLocaleDateString() : "TBD"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-orange-500/10 rounded-3xl">
              <div className="p-2 bg-orange-500 text-white rounded-xl">
                <Target size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black tracking-widest uppercase opacity-50 text-orange-600">
                  Passing
                </p>
                <p className="text-sm font-black text-orange-600">
                  {exam.passingMarks}/{exam.maxMarks}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Entry Section */}
      <div className="bg-card rounded-[2.5rem] border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
            <GraduationCap size={16} /> Mark Results
          </h2>
          <span className="text-xs font-bold px-3 py-1 bg-muted rounded-full">
            {allEnrollments.length} Students Enrolled
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-muted/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-8 py-4">Student</th>
                <th className="px-8 py-4">Cohort</th>
                <th className="px-8 py-4">Marks / Grade / Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {allEnrollments.map((enrollment) => {
                const result = enrollment.ExamResult?.find(
                  (r) => r.examId === exam.id,
                );
                return (
                  <tr
                    key={enrollment.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-8 py-5 min-w-[200px]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-sm">
                          {enrollment.user.name?.[0] || "S"}
                        </div>
                        <div>
                          <p className="font-bold text-sm">
                            {enrollment.user.name || enrollment.user.username}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {enrollment.user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-xs font-bold px-2 py-1 bg-muted rounded-md border border-border">
                        {
                          cohorts.find((c) => c.id === enrollment.cohortId)
                            ?.name
                        }
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <ExamResultForm
                        examId={exam.id}
                        enrollmentId={enrollment.id}
                        initialMarks={result?.marks || undefined}
                        initialGrade={result?.grade || undefined}
                        initialRemarks={result?.remarks || undefined}
                        maxMarks={exam.maxMarks}
                      />
                    </td>
                  </tr>
                );
              })}
              {allEnrollments.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-8 py-20 text-center text-muted-foreground font-medium"
                  >
                    No students currently enrolled in this program/course.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
