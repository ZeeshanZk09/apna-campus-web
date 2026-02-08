import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Download,
  FileText,
  Users,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAssignmentById } from "@/lib/queries/assessmentQueries";
import EvaluationForm from "../../_components/EvaluationForm";

interface AssignmentPageProps {
  params: Promise<{ id: string }>;
}

export default async function AssignmentPage({ params }: AssignmentPageProps) {
  const { id } = await params;
  const assignment = await getAssignmentById(id);

  if (!assignment) return notFound();

  return (
    <div className="space-y-8 p-8">
      {/* Breadcrumbs / Back */}
      <Link
        href="/admin/academics/assessments"
        className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Assessments
      </Link>

      {/* Header Card */}
      <div className="bg-card rounded-[2.5rem] border border-border p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                <FileText size={24} />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                  {assignment.course.code}
                </span>
                <h1 className="text-3xl font-black tracking-tight mt-1">
                  {assignment.title}
                </h1>
              </div>
            </div>
            <p className="text-muted-foreground max-w-2xl font-medium">
              {assignment.description ||
                "No description provided for this assignment."}
            </p>
          </div>

          <div className="flex gap-4">
            <div className="p-6 bg-muted/50 rounded-3xl text-center min-w-[120px]">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                Submissions
              </p>
              <p className="text-2xl font-black">
                {assignment.submissions.length}
              </p>
            </div>
            <div className="p-6 bg-emerald-500/10 rounded-3xl text-center min-w-[120px]">
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">
                Evaluated
              </p>
              <p className="text-2xl font-black text-emerald-600">
                {assignment.evaluations.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-card rounded-[2.5rem] border border-border overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
            <Users size={16} /> Student Submissions
          </h2>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500">
              <CheckCircle2 size={12} /> Graded
            </span>
            <span className="flex items-center gap-1 text-[10px] font-bold text-orange-500">
              <AlertCircle size={12} /> Pending
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-muted/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-8 py-4">Student</th>
                <th className="px-8 py-4">Submitted At</th>
                <th className="px-8 py-4">Marks</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {assignment.submissions.map((submission) => {
                const evaluation = assignment.evaluations.find(
                  (e) => e.studentId === submission.studentId,
                );
                return (
                  <tr
                    key={submission.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-sm">
                          {submission.student.name?.[0] || "U"}
                        </div>
                        <div>
                          <p className="font-bold text-sm">
                            {submission.student.name ||
                              submission.student.username}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {submission.student.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Calendar size={14} className="text-muted-foreground" />
                        {new Date(submission.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      {evaluation ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black">
                            {evaluation.marks}/100
                          </span>
                          <CheckCircle2
                            size={14}
                            className="text-emerald-500"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-orange-500">
                            Not Graded
                          </span>
                          <AlertCircle size={14} className="text-orange-500" />
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="p-2.5 bg-muted rounded-xl hover:bg-primary hover:text-primary-foreground transition-all group"
                          title="Download Submission"
                        >
                          <Download size={16} />
                        </button>
                        <EvaluationForm
                          assignmentId={assignment.id}
                          studentId={submission.studentId}
                          existingMarks={evaluation?.marks || undefined}
                          existingFeedback={evaluation?.feedback || undefined}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
              {assignment.submissions.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <p className="text-muted-foreground font-medium">
                      No submissions yet.
                    </p>
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
