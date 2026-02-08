import { Loader2, Users } from "lucide-react";
import { Suspense } from "react";
import {
  getAllCohorts,
  getAttendanceByCohort,
} from "@/lib/queries/enrollmentQueries";
import AttendanceFilters from "../_components/AttendanceFilters";
import AttendanceSheet from "../_components/AttendanceSheet";

interface AttendancePageProps {
  searchParams: Promise<{
    cohortId?: string;
    date?: string;
  }>;
}

export default async function AttendancePage({
  searchParams,
}: AttendancePageProps) {
  const { cohortId, date: dateStr } = await searchParams;
  const cohorts = await getAllCohorts();

  const selectedDate = dateStr ? new Date(dateStr) : new Date();
  const selectedCohort = cohorts.find((c) => c.id === cohortId);

  let attendanceRecords: any[] = [];
  if (selectedCohort) {
    attendanceRecords = await getAttendanceByCohort(
      selectedCohort.id,
      selectedDate,
    );
  }

  // Map students from cohort and attach attendance status if found
  const students =
    selectedCohort?.enrollments.map((enrollment) => {
      const record = attendanceRecords.find(
        (r) => r.enrollmentId === enrollment.id,
      );
      return {
        id: enrollment.id,
        userId: enrollment.userId,
        username:
          (enrollment as any).user.username ||
          (enrollment as any).user.name ||
          "Unknown",
        email: (enrollment as any).user.email,
        status: record?.status,
      };
    }) || [];

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tight">Attendance Hub</h1>
        <p className="text-muted-foreground font-medium">
          Manage daily presence and tracking for your students.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar: Cohort Selection & Date */}
        <div className="lg:col-span-4">
          <Suspense
            fallback={
              <div className="h-[400px] flex items-center justify-center bg-muted rounded-3xl animate-pulse">
                <Loader2 className="animate-spin" />
              </div>
            }
          >
            <AttendanceFilters
              cohorts={cohorts}
              selectedCohortId={cohortId}
              selectedDate={selectedDate}
            />
          </Suspense>
        </div>

        {/* Main Content: Attendance Sheet */}
        <div className="lg:col-span-8">
          {selectedCohort ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-card p-6 rounded-3xl border border-border shadow-sm">
                <div>
                  <h3 className="text-xl font-bold">{selectedCohort.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedDate.toLocaleDateString("en-US", {
                      dateStyle: "full",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-2xl">
                  <Users size={14} className="text-muted-foreground" />
                  <span className="text-sm font-bold">
                    {students.length} Students
                  </span>
                </div>
              </div>
              <AttendanceSheet
                cohortId={selectedCohort.id}
                date={selectedDate}
                students={students}
              />
            </div>
          ) : (
            <div className="h-[400px] flex flex-col items-center justify-center bg-muted/30 rounded-3xl border-2 border-dashed border-border text-center p-8">
              <div className="w-16 h-16 rounded-3xl bg-card flex items-center justify-center shadow-sm mb-4">
                <Users className="text-muted-foreground" size={24} />
              </div>
              <h3 className="text-lg font-bold">No Cohort Selected</h3>
              <p className="text-sm text-muted-foreground max-w-[250px] mx-auto mt-2">
                Please select a cohort from the left sidebar to start marking
                attendance.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
