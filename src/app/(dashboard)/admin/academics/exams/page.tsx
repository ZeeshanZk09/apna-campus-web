// import { getAllCourses } from '@/lib/queries/courseQueries';
import { ArrowRight, Calendar, Target, Trophy } from "lucide-react";
import Link from "next/link";
import { getAllCourses } from "@/lib/queries/academicQueries";
import { getAllExams } from "@/lib/queries/assessmentQueries";
import ExamForm from "../_components/ExamForm";

export default async function ExamsPage() {
  const exams = await getAllExams();
  const courses = await getAllCourses();

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Academic Exams</h1>
          <p className="text-muted-foreground font-medium">
            Schedule and manage examinations across all programs.
          </p>
        </div>
        <ExamForm courses={courses} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map((exam) => (
          <Link
            key={exam.id}
            href={`/admin/academics/exams/${exam.id}`}
            className="group block p-6 bg-card rounded-[2.5rem] border border-border hover:border-primary transition-all shadow-sm hover:shadow-xl hover:shadow-primary/5"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-4 bg-orange-500/10 rounded-2xl text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                <Trophy size={24} />
              </div>
              <span className="px-3 py-1 bg-muted rounded-full text-[10px] font-black uppercase tracking-wider">
                {exam.course.code}
              </span>
            </div>

            <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">
              {exam.title}
            </h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-6">
              {exam.type} EXAMINATION
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-2xl">
                <div className="flex items-center gap-2">
                  <Target size={14} className="text-muted-foreground" />
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Passing Marks
                  </span>
                </div>
                <span className="text-sm font-black text-primary">
                  {exam.passingMarks}/{exam.maxMarks}
                </span>
              </div>
              <div className="flex items-center gap-2 px-3">
                <Calendar size={14} className="text-muted-foreground" />
                <span className="text-xs font-bold">
                  {exam.date ? new Date(exam.date).toLocaleDateString() : "TBD"}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-primary pt-4 border-t border-border">
              <span>View Results</span>
              <ArrowRight
                size={14}
                className="-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all"
              />
            </div>
          </Link>
        ))}

        {exams.length === 0 && (
          <div className="col-span-full h-[300px] flex flex-col items-center justify-center bg-muted/30 rounded-3xl border-2 border-dashed border-border text-center p-8">
            <Trophy
              className="text-muted-foreground mb-4 opacity-20"
              size={64}
            />
            <h3 className="text-lg font-bold">No Exams Scheduled</h3>
            <p className="text-sm text-muted-foreground max-w-[300px] mt-2">
              Create and schedule exams to track student academic excellence.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
