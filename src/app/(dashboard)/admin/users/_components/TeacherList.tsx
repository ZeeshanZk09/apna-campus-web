"use client";

import {
  Calendar,
  ExternalLink,
  GraduationCap,
  Mail,
  MoreVertical,
  Search,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { removeTeacherFromCohortAction } from "@/app/actions/teacherActions";
import type {
  Cohort,
  TeacherCohort,
  User,
} from "@/app/generated/prisma/browser";

interface TeacherWithCohorts extends User {
  teacherCohorts: (TeacherCohort & { cohort: Cohort })[];
}

interface TeacherListProps {
  teachers: TeacherWithCohorts[];
}

export default function TeacherList({
  teachers: initialTeachers,
}: TeacherListProps) {
  const [teachers, setTeachers] = useState(initialTeachers);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleRemove = async (assignmentId: string) => {
    if (!confirm("Are you sure you want to remove this assignment?")) return;

    const res = await removeTeacherFromCohortAction(assignmentId);
    if (res.success) {
      toast.success("Teacher removed from cohort");
      // Update local state
      setTeachers((prev) =>
        prev.map((t) => ({
          ...t,
          teacherCohorts: t.teacherCohorts.filter(
            (tc) => tc.id !== assignmentId,
          ),
        })),
      );
    } else {
      toast.error(res.error || "Failed to remove teacher");
    }
  };

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
            placeholder="Search teachers by name or email..."
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.map((teacher) => (
          <div
            key={teacher.id}
            className="bg-card rounded-3xl border border-border overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all group"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary overflow-hidden border border-primary/20">
                    {teacher.profilePic ? (
                      <img
                        src={teacher.profilePic}
                        alt={teacher.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <GraduationCap size={28} />
                    )}
                  </div>
                  <div>
                    <h3 className="font-black text-lg group-hover:text-primary transition-colors line-clamp-1">
                      {teacher.username}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                      <Mail size={12} /> {teacher.email}
                    </div>
                  </div>
                </div>
                <button className="p-2 hover:bg-muted rounded-xl transition-colors">
                  <MoreVertical size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">
                    Assigned Cohorts ({teacher.teacherCohorts.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {teacher.teacherCohorts.length > 0 ? (
                      teacher.teacherCohorts.map((tc) => (
                        <div
                          key={tc.id}
                          className="flex items-center gap-2 px-3 py-1.5 bg-secondary/50 text-secondary-foreground rounded-xl text-[10px] font-bold border border-secondary"
                        >
                          {tc.cohort.name}
                          <button
                            onClick={() => handleRemove(tc.id)}
                            className="hover:text-destructive transition-colors"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground italic">
                        No cohorts assigned
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <Link
                    href={`/admin/users/teachers/${teacher.id}`}
                    className="flex items-center gap-2 text-xs font-black text-primary hover:underline hover:gap-3 transition-all"
                  >
                    View Biography <ExternalLink size={14} />
                  </Link>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
                    <Calendar size={12} /> Joined{" "}
                    {new Date(teacher.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTeachers.length === 0 && (
        <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed border-border">
          <GraduationCap
            size={48}
            className="mx-auto text-muted-foreground mb-4 opacity-20"
          />
          <p className="text-muted-foreground font-medium">
            No teachers found matching your search.
          </p>
        </div>
      )}
    </div>
  );
}
