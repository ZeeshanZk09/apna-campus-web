"use client";

import { Award, FileText, Layers } from "lucide-react";
import type React from "react";
import { useState } from "react";
import AssignmentManager from "./AssignmentManager";
import ExamManager from "./ExamManager";

interface CourseTabsProps {
  course: any;
  curriculumContent: React.ReactNode;
}

export default function CourseTabs({
  course,
  curriculumContent,
}: CourseTabsProps) {
  const [activeTab, setActiveTab] = useState<
    "curriculum" | "assignments" | "exams"
  >("curriculum");

  const tabs = [
    { id: "curriculum", label: "Curriculum", icon: <Layers size={18} /> },
    { id: "assignments", label: "Assignments", icon: <FileText size={18} /> },
    { id: "exams", label: "Exams & Results", icon: <Award size={18} /> },
  ];

  return (
    <div className="lg:col-span-8 space-y-8">
      {/* Tab Switcher */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all ${
              activeTab === tab.id
                ? "bg-white dark:bg-slate-900 text-blue-600 shadow-sm"
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-8">
        {activeTab === "curriculum" && curriculumContent}
        {activeTab === "assignments" && (
          <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 p-8">
            <AssignmentManager
              courseId={course.id}
              initialAssignments={course.assignments}
            />
          </div>
        )}
        {activeTab === "exams" && (
          <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 p-8">
            <ExamManager courseId={course.id} initialExams={course.exams} />
          </div>
        )}
      </div>
    </div>
  );
}
