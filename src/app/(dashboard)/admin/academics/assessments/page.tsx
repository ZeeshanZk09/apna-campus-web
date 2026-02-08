// import { getAllCourses } from '@/lib/queries/courseQueries';
import { ArrowRight, BookOpen, Clock, FileText, Users } from "lucide-react";
import Link from "next/link";
import { getAllCourses } from "@/lib/queries/academicQueries";
import { getAllAssignments } from "@/lib/queries/assessmentQueries";
import AssessmentForm from "../_components/AssessmentForm";

export default async function AssessmentsPage() {
  const assignments = await getAllAssignments();
  const courses = await getAllCourses();

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Assessments</h1>
          <p className="text-muted-foreground font-medium">
            Create and manage assignments for all courses.
          </p>
        </div>
        <AssessmentForm courses={courses} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.map((assignment) => (
          <Link
            key={assignment.id}
            href={`/admin/academics/assessments/${assignment.id}`}
            className="group block p-6 bg-card rounded-3xl border border-border hover:border-primary transition-all shadow-sm hover:shadow-xl hover:shadow-primary/5"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <FileText size={24} />
              </div>
              <span className="px-3 py-1 bg-muted rounded-full text-[10px] font-black uppercase tracking-wider">
                {assignment.course.code}
              </span>
            </div>

            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
              {assignment.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-6">
              {assignment.description || "No description provided."}
            </p>

            <div className="grid grid-cols-2 gap-4 pb-6 border-b border-border mb-6">
              <div className="flex items-center gap-2">
                <Users size={14} className="text-muted-foreground" />
                <span className="text-xs font-bold">
                  {assignment._count.submissions} Submissions
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-muted-foreground" />
                <span className="text-xs font-bold">Open</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-primary">
              <span>View Details</span>
              <ArrowRight
                size={14}
                className="-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all"
              />
            </div>
          </Link>
        ))}

        {assignments.length === 0 && (
          <div className="col-span-full h-[300px] flex flex-col items-center justify-center bg-muted/30 rounded-3xl border-2 border-dashed border-border text-center p-8">
            <BookOpen className="text-muted-foreground mb-4" size={48} />
            <h3 className="text-lg font-bold">No Assignments Yet</h3>
            <p className="text-sm text-muted-foreground max-w-[300px] mt-2">
              Start by creating your first assignment using the "New Assignment"
              button.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
