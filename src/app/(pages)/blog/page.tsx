import {
  ArrowRight,
  BookOpen,
  Calendar,
  MessageSquare,
  User,
} from "lucide-react";
import Link from "next/link";
import { getAllPosts } from "@/lib/queries/blogQueries";

export const dynamic = "force-dynamic";

export default async function BlogPage(_props) {
  const posts = await getAllPosts();

  const featuredPost = posts[0] ?? null;
  const remainingPosts = posts.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      {/* ── Header ── */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-6">
          <BookOpen size={16} />
          <span>Our Blog</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Latest Stories &amp; Insights
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Explore articles, tutorials, and updates from our campus community.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-24 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50">
          <BookOpen
            size={48}
            className="mx-auto mb-4 text-gray-300 dark:text-gray-600"
          />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No posts yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Check back soon for new articles and insights!
          </p>
        </div>
      ) : (
        <>
          {/* ── Featured Post ── */}
          {featuredPost && (
            <Link
              href={`/blog/${featuredPost.slug}`}
              className="group block mb-16"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white dark:bg-gray-800/50 rounded-3xl border border-gray-100 dark:border-gray-700/50 overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="aspect-video lg:aspect-auto bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
                  {featuredPost.images && featuredPost.images.length > 0 ? (
                    <img
                      src={featuredPost.images[0]}
                      alt={featuredPost.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600">
                      <BookOpen size={64} />
                    </div>
                  )}
                </div>
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-full uppercase">
                      Featured
                    </span>
                    <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar size={14} />
                      {new Date(featuredPost.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        },
                      )}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight">
                    {featuredPost.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed mb-6">
                    {featuredPost.content.substring(0, 250)}...
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold overflow-hidden">
                        {featuredPost.user?.profilePic ||
                        featuredPost.admin?.profilePic ? (
                          <img
                            src={
                              featuredPost.user?.profilePic ||
                              featuredPost.admin?.profilePic ||
                              ""
                            }
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User size={18} />
                        )}
                      </div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {featuredPost.user?.username ||
                          featuredPost.admin?.firstName ||
                          "Anonymous"}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold group-hover:gap-2 transition-all">
                      Read Article <ArrowRight size={16} />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* ── Posts Grid ── */}
          {remainingPosts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                All Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {remainingPosts.map((post) => (
                  <article
                    key={post.id}
                    className="group flex flex-col bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    <div className="aspect-video bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
                      {post.images && post.images.length > 0 ? (
                        <img
                          src={post.images[0]}
                          alt={post.title}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-600">
                          <BookOpen size={40} />
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-3 mb-3 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(post.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare size={14} />
                          {post._count.comments}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>

                      <p className="text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed mb-4 text-sm">
                        {post.content.substring(0, 150)}...
                      </p>

                      <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xs overflow-hidden">
                            {post.user?.profilePic || post.admin?.profilePic ? (
                              <img
                                src={
                                  post.user?.profilePic ||
                                  post.admin?.profilePic ||
                                  ""
                                }
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User size={14} />
                            )}
                          </div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {post.user?.username ||
                              post.admin?.firstName ||
                              "Anonymous"}
                          </span>
                        </div>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="text-indigo-600 dark:text-indigo-400 font-bold text-sm group-hover:translate-x-1 transition-transform inline-flex items-center gap-1"
                        >
                          Read More <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
