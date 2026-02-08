// src/app/admin/academics/courses/[slug]/_components/AssignmentManager.tsx
"use client";

import { CheckCircle, Clock, FileText, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { createAssignmentAction } from "@/app/actions/assignments";

interface AssignmentManagerProps {
  courseId: string;
  initialAssignments: any[];
}

export default function AssignmentManager({
  courseId,
  initialAssignments,
}: AssignmentManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await createAssignmentAction(formData, courseId);
    setLoading(false);

    if (res.success) {
      toast.success(res.message);
      setShowAddForm(false);
    } else {
      toast.error(res.message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Course Assignments
        </h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Create New
        </button>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-card p-6 rounded-xl border border-border shadow-sm space-y-4 animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Assignment Title</label>
              <input
                required
                name="title"
                className="w-full p-2 rounded-lg bg-background border border-border"
                placeholder="e.g., Final Research Project"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Maximum Points</label>
              <input
                required
                type="number"
                name="points"
                className="w-full p-2 rounded-lg bg-background border border-border"
                placeholder="100"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Due Date</label>
            <input
              required
              type="datetime-local"
              name="dueDate"
              className="w-full p-2 rounded-lg bg-background border border-border"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Instructions</label>
            <textarea
              name="description"
              className="w-full p-2 rounded-lg bg-background border border-border h-24"
              placeholder="Enter detailed instructions..."
            ></textarea>
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-sm"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              type="submit"
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg text-sm"
            >
              {loading ? "Creating..." : "Create Assignment"}
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-4">
        {initialAssignments.length > 0 ? (
          initialAssignments.map((assignment) => (
            <div
              key={assignment.id}
              className="bg-card p-4 rounded-xl border border-border flex justify-between items-center hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">{assignment.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Due {new Date(assignment.dueDate).toLocaleDateString()}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      {assignment.points} Points
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                  {assignment.submissions?.length || 0} Submissions
                </span>
                <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                  <Plus className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
            <p className="text-muted-foreground">
              No assignments created yet for this course.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
