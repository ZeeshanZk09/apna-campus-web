"use client";

import { AlertCircle, Check, Clock, Loader2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { saveAttendanceAction } from "@/app/actions/attendance";
import type { AttendanceStatus } from "@/app/generated/prisma/enums";

interface Student {
  id: string;
  name: string;
  enrollmentId: string;
}

interface AttendanceManagerProps {
  students: Student[];
  cohortName: string;
}

export default function AttendanceManager({
  students,
  cohortName,
}: AttendanceManagerProps) {
  const [attendance, setAttendance] = useState<
    Record<string, AttendanceStatus>
  >(
    Object.fromEntries(
      students.map((s) => [s.enrollmentId, "PRESENT" as AttendanceStatus]),
    ),
  );
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const records = Object.entries(attendance).map(
      ([enrollmentId, status]) => ({
        enrollmentId,
        status,
        date: new Date().toISOString(),
      }),
    );

    const result = await saveAttendanceAction(records);
    if (result.success) {
      toast.success("Attendance saved successfully");
    } else {
      toast.error(result.error || "Failed to save attendance");
    }
    setLoading(false);
  };

  const statusColors = {
    PRESENT:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    ABSENT: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    LATE: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    EXCUSED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold dark:text-white">
            Attendance: {cohortName}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            "Save Attendance"
          )}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900/50">
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                Student Name
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {students.map((student) => (
              <tr
                key={student.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
              >
                <td className="px-6 py-4">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {student.name}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[attendance[student.enrollmentId] as keyof typeof statusColors]}`}
                  >
                    {attendance[student.enrollmentId]}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() =>
                        setAttendance((prev) => ({
                          ...prev,
                          [student.enrollmentId]: "PRESENT",
                        }))
                      }
                      className={`p-2 rounded-lg transition-colors ${attendance[student.enrollmentId] === "PRESENT" ? "bg-green-500 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-400 hover:text-green-500"}`}
                    >
                      <Check size={18} />
                    </button>
                    <button
                      onClick={() =>
                        setAttendance((prev) => ({
                          ...prev,
                          [student.enrollmentId]: "ABSENT",
                        }))
                      }
                      className={`p-2 rounded-lg transition-colors ${attendance[student.enrollmentId] === "ABSENT" ? "bg-red-500 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-400 hover:text-red-500"}`}
                    >
                      <X size={18} />
                    </button>
                    <button
                      onClick={() =>
                        setAttendance((prev) => ({
                          ...prev,
                          [student.enrollmentId]: "LATE",
                        }))
                      }
                      className={`p-2 rounded-lg transition-colors ${attendance[student.enrollmentId] === "LATE" ? "bg-yellow-500 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-400 hover:text-yellow-500"}`}
                    >
                      <Clock size={18} />
                    </button>
                    <button
                      onClick={() =>
                        setAttendance((prev) => ({
                          ...prev,
                          [student.enrollmentId]: "EXCUSED",
                        }))
                      }
                      className={`p-2 rounded-lg transition-colors ${attendance[student.enrollmentId] === "EXCUSED" ? "bg-blue-500 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-400 hover:text-blue-500"}`}
                    >
                      <AlertCircle size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
