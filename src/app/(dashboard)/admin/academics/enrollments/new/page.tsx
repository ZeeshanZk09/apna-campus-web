// import { EnrollmentForm } from '../_components/AcademicForms';
import { UserPlus } from "lucide-react";
import { getAllCohorts } from "@/lib/queries/academicQueries";
import { getAllStudents } from "@/lib/queries/studentQueries";
import { EnrollmentForm } from "../../_components/AcademicForms";

export default async function NewEnrollmentPage({
  searchParams,
}: {
  searchParams: { cohortId?: string };
}) {
  const [students, cohorts] = await Promise.all([
    getAllStudents(),
    getAllCohorts(),
  ]);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-500/10 text-blue-600 rounded-xl">
            <UserPlus size={24} />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight">
            Enroll Student
          </h1>
        </div>
        <p className="text-slate-500 font-medium">
          Assign a registered student to an academic batch.
        </p>
      </div>

      <EnrollmentForm
        students={students as any}
        cohorts={cohorts as any}
        initialCohortId={searchParams.cohortId}
      />
    </div>
  );
}
