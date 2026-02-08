import { Calendar, ChevronLeft, MessageSquare, User } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/queries/blogQueries";

interface BlogComment {
  id: string;
  content: string;
  createdAt: string;
  user?: { username: string; profilePic: string | null } | null;
}

interface BlogPost {
  title: string;
  content: string;
  createdAt: string;
  images?: string[];
  user?: { username: string; profilePic: string | null } | null;
  admin?: { firstName: string; profilePic: string | null } | null;
  comments: BlogComment[];
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const { slug } = await params;
  const post = (await getPostBySlug(slug)) as BlogPost | null;

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Link
        href="/blog"
        className="inline-flex items-center text-indigo-600 dark:text-indigo-400 mb-10 hover:gap-2 transition-all"
      >
        <ChevronLeft size={20} />
        <span>Back to Blog</span>
      </Link>

      <header className="mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 overflow-hidden font-bold">
              {post.user?.profilePic || post.admin?.profilePic ? (
                <img
                  src={post.user?.profilePic || post.admin?.profilePic || ""}
                  alt=""
                />
              ) : (
                <User size={20} />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {post.user?.username || post.admin?.firstName || "Anonymous"}
              </span>
              <span className="text-xs">Author</span>
            </div>
          </div>

          <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block" />

          <div className="flex items-center gap-2">
            <Calendar size={18} />
            <span className="text-sm font-medium">
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <MessageSquare size={18} />
            <span className="text-sm font-medium">
              {post.comments.length} Comments
            </span>
          </div>
        </div>
      </header>

      {post.images && post.images.length > 0 && (
        <div className="mb-12 rounded-3xl overflow-hidden shadow-2xl">
          <img
            src={post.images[0]}
            alt={post.title}
            className="w-full object-cover"
          />
        </div>
      )}

      <div className="prose prose-lg dark:prose-invert max-w-none mb-16 text-gray-700 dark:text-gray-300 leading-relaxed space-y-6">
        {post.content.split("\n").map((para: string, i: number) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      <section className="border-t border-gray-100 dark:border-gray-800 pt-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-10">
          Comments ({post.comments.length})
        </h2>
        <div className="space-y-8">
          {post.comments.map((comment: BlogComment) => (
            <div key={comment.id} className="flex gap-4">
              <div className="shrink-0">
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 overflow-hidden">
                  {comment.user?.profilePic ? (
                    <img src={comment.user.profilePic} alt="" />
                  ) : (
                    <User size={24} />
                  )}
                </div>
              </div>
              <div className="flex-1 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-gray-900 dark:text-white">
                    {comment.user?.username || "Guest"}
                  </h4>
                  <span className="text-xs text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {comment.content}
                </p>
              </div>
            </div>
          ))}
          {post.comments.length === 0 && (
            <div className="text-center py-10 bg-gray-50 dark:bg-gray-800/30 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
              <p className="text-gray-500">
                No comments yet. Be the first to share your thoughts!
              </p>
            </div>
          )}
        </div>
      </section>
    </article>
  );
}
