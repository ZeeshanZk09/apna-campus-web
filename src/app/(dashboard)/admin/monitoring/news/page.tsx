// src/app/admin/monitoring/news/page.tsx

import { Newspaper } from "lucide-react";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/authHelpers";
import { getAllPosts } from "@/lib/queries/blogQueries";
import PostManager from "./_components/PostManager";

export default async function NewsManagementPage() {
  const session = await getSessionUser();
  if (!session) redirect("/login");

  const posts = await getAllPosts();

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Newspaper className="w-6 h-6 text-primary" />
            Announcement & News
          </h1>
          <p className="text-muted-foreground">
            Manage public and internal blog posts and updates.
          </p>
        </div>
      </div>

      <PostManager initialPosts={posts} adminId={session.id} />
    </div>
  );
}
