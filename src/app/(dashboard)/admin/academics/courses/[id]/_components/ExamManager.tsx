// src/app/admin/academics/courses/[slug]/_components/ExamManager.tsx
"use client";

import { Award, Calendar, FileText, Plus } from "lucide-react";
import { useState } from "react";

export default function ExamManager({
  courseId,
  initialExams,
}: {
  courseId: string;
  initialExams: any[];
}) {
  const [exams, _setExams] = useState(initialExams);
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" />
          Exams & Assessments
        </h2>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl text-sm font-bold"
        >
          <Plus size={16} /> Schedule Exam
        </button>
      </div>

      <div className="grid gap-4">
        {exams.length > 0 ? (
          exams.map((exam) => (
            <div
              key={exam.id}
              className="p-4 border rounded-2xl bg-muted/30 flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-lg">{exam.title}</div>
                <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />{" "}
                    {exam.date
                      ? new Date(exam.date).toLocaleDateString()
                      : "TBD"}
                  </span>
                  <span className="flex items-center gap-1 uppercase">
                    <FileText size={14} /> {exam.type}
                  </span>
                  <span className="flex items-center gap-1">
                    Max Marks: {exam.maxMarks}
                  </span>
                </div>
              </div>
              <button className="px-4 py-2 text-sm font-bold hover:bg-muted rounded-lg transition-colors">
                View Results
              </button>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-muted-foreground italic border-2 border-dashed rounded-2xl">
            No exams scheduled yet for this course.
          </div>
        )}
      </div>
    </div>
  );
}
