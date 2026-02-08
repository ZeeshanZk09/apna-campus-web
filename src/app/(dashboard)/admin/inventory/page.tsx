// src/app/(dashboard)/admin/inventory/page.tsx

import { Archive, Plus } from "lucide-react";
import Link from "next/link";
import ProtectedRoute from "@/components/ui/ProtectedRoute";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function InventoryPage() {
  const [assets, totalCount] = await Promise.all([
    prisma.asset.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        createdBy: { select: { username: true } },
      },
    }),
    prisma.asset.count(),
  ]);

  // Group by mimeType category
  const categories = assets.reduce<Record<string, number>>((acc, asset) => {
    const category = asset.mimeType?.split("/")[0] || "other";
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  return (
    <ProtectedRoute adminOnly>
      <div className="p-6 space-y-8">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Inventory & Assets
            </h1>
            <p className="text-muted-foreground">
              Track campus digital assets and resource allocation.
            </p>
          </div>
          <Link
            href="/admin/inventory/new"
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all"
          >
            <Plus size={18} /> New Entry
          </Link>
        </header>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-card p-5 rounded-2xl border border-border">
            <p className="text-xs font-medium text-muted-foreground">
              Total Assets
            </p>
            <p className="text-2xl font-black">{totalCount}</p>
          </div>
          {Object.entries(categories)
            .slice(0, 3)
            .map(([category, count]) => (
              <div
                key={category}
                className="bg-card p-5 rounded-2xl border border-border"
              >
                <p className="text-xs font-medium text-muted-foreground capitalize">
                  {category}
                </p>
                <p className="text-2xl font-black">{count}</p>
              </div>
            ))}
        </div>

        {/* Assets Table */}
        <div className="bg-card rounded-3xl border shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-muted/50 text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
              <tr>
                <th className="px-6 py-4">Asset Name</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Size</th>
                <th className="px-6 py-4">Uploaded By</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {assets.length > 0 ? (
                assets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-muted/30">
                    <td className="px-6 py-4 font-medium truncate max-w-50">
                      {asset.key || "Untitled"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {asset.mimeType?.split("/")[1]?.toUpperCase() ||
                        "Unknown"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {asset.size
                        ? `${(asset.size / 1024).toFixed(1)} KB`
                        : "—"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {asset.createdBy?.username || "System"}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(asset.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-muted-foreground"
                  >
                    <Archive className="mx-auto h-8 w-8 mb-2 opacity-30" />
                    <p className="font-medium">No assets found</p>
                    <p className="text-sm">
                      Start by uploading your first asset.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ProtectedRoute>
  );
}
