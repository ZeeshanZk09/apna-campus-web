"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ui/ProtectedRoute";
import UsersTable from "@/components/admin/Users.Table";
import Loader from "@/components/ui/Loader";

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `/api/admin/users/?q=${encodeURIComponent(query)}`
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "No users found");

        setResults(null);
      } else {
        setResults(data.users);
      }
    } catch (err) {
      setError("Failed to search");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const response = await fetch("/api/auth/current-user");

        if (!response.ok) {
          throw new Error("Failed to verify admin status");
        }

        const data = await response.json();

        if (!data.user?.isAdmin) {
          router.push("/profile");
          return;
        }

        // If admin, fetch users
        const usersResponse = await fetch("/api/admin/users");

        if (!usersResponse.ok) {
          throw new Error("Failed to fetch users");
        }

        const usersData = await usersResponse.json();
        setUsers(usersData.users);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Access denied");
        router.push("/profile");
      } finally {
        setLoading(false);
      }
    };

    verifyAdmin();
  }, [router]);

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      setUsers(users.filter((user) => user._id !== userId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user");
    }
  };

  const handleToggleAdmin = async (userId: string, isAdmin: boolean) => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, isAdmin: !isAdmin }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, isAdmin: !isAdmin } : user
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user");
    }
  };

  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white shadow overflow-hidden sm:rounded-lg px-2">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Users Management
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Manage all registered users in the system
              </p>
            </div>
            <div className="w-full rounded py-2 px-4 bg-blue-300 flex justify-between text-black">
              <input
                className="w-full"
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (!e.target.value.trim()) {
                    setResults(null); // Clear results when input is cleared
                  }
                }}
                placeholder="Search by ID, email or username"
              />
              <button
                className="rounded-full bg-blue-700 py-1 px-2"
                onClick={handleSearch}
                disabled={loading}
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
            {loading ? (
              <Loader />
            ) : (
              <UsersTable
                users={results !== null ? results : users}
                onDeleteUser={handleDeleteUser}
                onToggleAdmin={handleToggleAdmin}
              />
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
