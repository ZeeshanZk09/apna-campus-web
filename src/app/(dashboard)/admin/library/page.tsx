// src/app/(dashboard)/admin/library/page.tsx

import {
  Book,
  File,
  FileText,
  Image,
  Library as LibraryIcon,
  Plus,
  Video,
} from "lucide-react";
import Link from "next/link";
import ProtectedRoute from "@/components/ui/ProtectedRoute";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

function getAssetIcon(mimeType: string | null) {
  if (!mimeType) return File;
  if (mimeType.startsWith("image/")) return Image;
  if (mimeType.startsWith("video/")) return Video;
  if (mimeType.includes("pdf") || mimeType.includes("document"))
    return FileText;
  return Book;
}

function formatFileSize(bytes: number | null): string {
  if (!bytes) return "Unknown size";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function LibraryPage() {
  const [assets, totalCount] = await Promise.all([
    prisma.asset.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
      include: {
        createdBy: { select: { username: true } },
      },
    }),
    prisma.asset.count(),
  ]);

  const imageCount = assets.filter((a) =>
    a.mimeType?.startsWith("image/"),
  ).length;
  const docCount = assets.filter(
    (a) => a.mimeType?.includes("pdf") || a.mimeType?.includes("document"),
  ).length;

  return (
    <ProtectedRoute adminOnly>
      <div className="p-6 space-y-8">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Library & Resources
            </h1>
            <p className="text-muted-foreground">
              Manage digital assets, documents, and media files.
            </p>
          </div>
          <Link
            href="/admin/library/upload"
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all"
          >
            <Plus size={18} /> Upload Resource
          </Link>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card p-5 rounded-2xl border border-border">
            <p className="text-xs font-medium text-muted-foreground">
              Total Resources
            </p>
            <p className="text-2xl font-black">{totalCount}</p>
          </div>
          <div className="bg-card p-5 rounded-2xl border border-border">
            <p className="text-xs font-medium text-muted-foreground">Images</p>
            <p className="text-2xl font-black">{imageCount}</p>
          </div>
          <div className="bg-card p-5 rounded-2xl border border-border">
            <p className="text-xs font-medium text-muted-foreground">
              Documents
            </p>
            <p className="text-2xl font-black">{docCount}</p>
          </div>
        </div>

        {/* Resources Grid */}
        {assets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {assets.map((asset) => {
              const IconComponent = getAssetIcon(asset.mimeType);
              return (
                <div
                  key={asset.id}
                  className="bg-card p-6 rounded-3xl border border-border shadow-sm flex flex-col items-center text-center space-y-3 hover:border-primary/30 transition-all"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <IconComponent size={24} />
                  </div>
                  <div className="font-bold text-sm truncate max-w-full">
                    {asset.key || "Untitled Resource"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {asset.mimeType?.split("/")[1]?.toUpperCase() || "File"} •{" "}
                    {formatFileSize(asset.size)}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    by {asset.createdBy?.username || "System"} •{" "}
                    {new Date(asset.createdAt).toLocaleDateString()}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <LibraryIcon className="mx-auto h-12 w-12 mb-4 opacity-30" />
            <p className="text-lg font-bold">No resources yet</p>
            <p className="text-sm">
              Upload your first resource to get started.
            </p>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
