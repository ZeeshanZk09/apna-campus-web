// src/app/admin/monitoring/news/_components/PostManager.tsx
"use client";

import {
  Calendar,
  ExternalLink,
  MessageCircle,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { createPostAction, deletePostAction } from "@/app/actions/posts";

export default function PostManager({
  initialPosts,
  adminId,
}: {
  initialPosts: any[];
  adminId: string;
}) {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await createPostAction(formData, adminId);
    setLoading(false);

    if (res.success) {
      toast.success(res.message);
      setShowForm(false);
    } else {
      toast.error(res.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    const res = await deletePostAction(id);
    if (res.success) toast.success(res.message);
    else toast.error(res.message);
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => setShowForm(!showForm)}
        className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm hover:opacity-90 transition-opacity"
      >
        <Plus className="w-4 h-4" />
        {showForm ? "Cancel" : "Create New Post"}
      </button>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-card p-6 rounded-xl border border-border shadow-sm space-y-4 animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium">Post Title</label>
            <input
              required
              name="title"
              className="w-full p-2 rounded-lg bg-background border border-border"
              placeholder="e.g., Campus Reopening Date 2024"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Body Content</label>
            <textarea
              required
              name="content"
              className="w-full p-2 rounded-lg bg-background border border-border h-40"
              placeholder="Write your announcement content here..."
            ></textarea>
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg text-sm"
            >
              {loading ? "Publishing..." : "Publish Post"}
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {initialPosts.map((post) => (
          <div
            key={post.id}
            className="bg-card rounded-xl border border-border overflow-hidden flex flex-col hover:shadow-md transition-shadow"
          >
            <div className="p-5 flex-1">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-lg line-clamp-1">{post.title}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="p-1.5 hover:bg-red-500/10 rounded-md transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                {post.content}
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  {post._count.comments} Comments
                </span>
                <span className="flex items-center gap-1 text-primary">
                  <ExternalLink className="w-3 h-3" />
                  View Public
                </span>
              </div>
            </div>
          </div>
        ))}

        {initialPosts.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed border-border rounded-xl">
            No posts found. Start by creating an announcement.
          </div>
        )}
      </div>
    </div>
  );
}
