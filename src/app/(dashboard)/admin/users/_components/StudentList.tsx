"use client";

import {
  ExternalLink,
  MoreVertical,
  Search,
  ShieldCheck,
  ShieldX,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { Cohort, Enrollment, User } from "@/app/generated/prisma/browser";

interface StudentWithEnrollments extends User {
  enrollments: (Enrollment & { cohort: Cohort })[];
}

interface StudentListProps {
  students: StudentWithEnrollments[];
}

export default function StudentList({
  students: initialStudents,
}: StudentListProps) {
  const [students, _setStudents] = useState(initialStudents);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = students.filter(
    (student) =>
      student.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <input
            type="text"
            placeholder="Search students by name, email or ID..."
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-muted/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border">
            <tr>
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">Enrollments</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Joined</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredStudents.map((student) => (
              <tr
                key={student.id}
                className="hover:bg-muted/30 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20 overflow-hidden">
                      {student.profilePic ? (
                        <img
                          src={student.profilePic}
                          alt={student.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        student.username[0].toUpperCase()
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-sm tracking-tight">
                        {student.username}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {student.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {student.enrollments.length > 0 ? (
                      student.enrollments.map((en) => (
                        <span
                          key={en.id}
                          className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded-md text-[9px] font-black uppercase border border-secondary shadow-sm"
                        >
                          {en.cohort.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-muted-foreground italic">
                        Not Enrolled
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      student.isBlocked
                        ? "bg-destructive/10 text-destructive"
                        : "bg-emerald-500/10 text-emerald-600"
                    }`}
                  >
                    {student.isBlocked ? (
                      <>
                        <ShieldX size={12} /> Restricted
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={12} /> Active
                      </>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-xs font-medium text-muted-foreground">
                  {new Date(student.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/users/students/${student.id}`}
                      className="p-2 hover:bg-primary/10 rounded-xl text-primary transition-colors"
                      title="View Profile"
                    >
                      <ExternalLink size={18} />
                    </Link>
                    <button className="p-2 hover:bg-muted rounded-xl transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredStudents.length === 0 && (
          <div className="text-center py-20">
            <Users
              size={48}
              className="mx-auto text-muted-foreground mb-4 opacity-20"
            />
            <p className="text-muted-foreground font-medium">
              No students found matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
