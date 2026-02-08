"use client";

import { AlertCircle, Check, Clock, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { bulkMarkAttendanceAction } from "@/app/actions/enrollment";
import { AttendanceStatus } from "@/app/generated/prisma/enums";

interface AttendanceSheetProps {
  cohortId: string;
  date: Date;
  students: {
    id: string; // enrollmentId
    userId: string;
    username: string;
    email: string;
    status?: AttendanceStatus;
  }[];
}

export default function AttendanceSheet({
  cohortId,
  date,
  students: initialStudents,
}: AttendanceSheetProps) {
  const [records, setRecords] = useState(
    initialStudents.map((s) => ({
      enrollmentId: s.id,
      status: s.status || AttendanceStatus.PRESENT,
      note: "",
    })),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleStatusChange = (
    enrollmentId: string,
    status: AttendanceStatus,
  ) => {
    setRecords((prev) =>
      prev.map((r) => (r.enrollmentId === enrollmentId ? { ...r, status } : r)),
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await bulkMarkAttendanceAction(date, records);
      if (res.success) {
        toast.success("Attendance records saved");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to save attendance");
      }
    } catch (_err) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case AttendanceStatus.PRESENT:
        return "bg-emerald-500 text-white";
      case AttendanceStatus.ABSENT:
        return "bg-destructive text-white";
      case AttendanceStatus.LATE:
        return "bg-orange-500 text-white";
      case AttendanceStatus.EXCUSED:
        return "bg-blue-500 text-white";
      default:
        return "bg-slate-200 text-slate-600";
    }
  };

  return (
    <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-muted/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Quick Mark</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {initialStudents.map((student, _idx) => {
              const record = records.find(
                (r) => r.enrollmentId === student.id,
              )!;
              return (
                <tr
                  key={student.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                        {student.username[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{student.username}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {student.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusColor(record.status)}`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() =>
                          handleStatusChange(
                            student.id,
                            AttendanceStatus.PRESENT,
                          )
                        }
                        className={`p-2 rounded-xl border transition-all ${record.status === AttendanceStatus.PRESENT ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "border-border text-slate-400 hover:border-emerald-500"}`}
                        title="Present"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(
                            student.id,
                            AttendanceStatus.ABSENT,
                          )
                        }
                        className={`p-2 rounded-xl border transition-all ${record.status === AttendanceStatus.ABSENT ? "bg-destructive border-destructive text-white shadow-lg shadow-destructive/20" : "border-border text-slate-400 hover:border-destructive"}`}
                        title="Absent"
                      >
                        <X size={16} />
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(student.id, AttendanceStatus.LATE)
                        }
                        className={`p-2 rounded-xl border transition-all ${record.status === AttendanceStatus.LATE ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20" : "border-border text-slate-400 hover:border-orange-500"}`}
                        title="Late"
                      >
                        <Clock size={16} />
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(
                            student.id,
                            AttendanceStatus.EXCUSED,
                          )
                        }
                        className={`p-2 rounded-xl border transition-all ${record.status === AttendanceStatus.EXCUSED ? "bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/20" : "border-border text-slate-400 hover:border-blue-500"}`}
                        title="Excused"
                      >
                        <AlertCircle size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="p-6 bg-muted/30 border-t border-border flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
            <Save size={18} />
          )}
          Save Records
        </button>
      </div>
    </div>
  );
}
