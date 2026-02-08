"use client";

import axios from "axios";
import {
  Ban,
  Filter,
  MoreVertical,
  Search,
  Trash2,
  UserCheck,
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import type { User } from "@/app/generated/prisma/browser";

interface UsersTableProps {
  initialUsers: User[];
}

export default function UsersTable({ initialUsers }: UsersTableProps) {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, _setSearchTerm] = useState("");

  const handleToggleBlock = async (user: User) => {
    try {
      const response = await axios.put(`/api/admin/users/${user.id}`, {
        isBlocked: !user.isBlocked,
      });
      if (response.data.success) {
        toast.success(
          `User ${!user.isBlocked ? "blocked" : "unblocked"} successfully`,
        );
        setUsers(
          users.map((u) =>
            u.id === user.id ? { ...u, isBlocked: !user.isBlocked } : u,
          ),
        );
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Operation failed");
    }
  };

  const handleDelete = async (userId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this user? This will be a soft delete.",
      )
    )
      return;
    try {
      const response = await axios.delete(`/api/admin/users/${userId}`);
      if (response.data.success) {
        toast.success("User deleted successfully");
        setUsers(users.filter((u) => u.id !== userId));
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to delete");
    }
  };

  const _filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-gray-50 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="text-lg font-bold dark:text-white">System Users</h3>
        <div className="flex gap-3">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white w-64"
            />
          </div>
          <button className="p-2 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-500 hover:text-indigo-600 transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-950/50 text-[10px] uppercase text-gray-400 font-bold tracking-widest">
            <tr>
              <th className="px-6 py-4">User Details</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Registration Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      <img
                        className="h-10 w-10 rounded-full object-cover border-2 border-white dark:border-gray-700"
                        src={user.profilePic || "/images/default-avatar.png"}
                        alt={user.username}
                      />
                      <div
                        className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 border-2 border-white dark:border-gray-800 rounded-full ${user.isBlocked ? "bg-red-500" : "bg-green-500"}`}
                      ></div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900 dark:text-white">
                        {user.username}
                      </div>
                      <div className="text-xs text-gray-400">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                      (user.role as string) === "ADMIN"
                        ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
                        : (user.role as string) === "TEACHER"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`text-xs font-bold ${user.isBlocked ? "text-red-500" : "text-green-500"}`}
                  >
                    {user.isBlocked ? "Blocked" : "Active"}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs dark:text-gray-400">
                  {new Date(user.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleToggleBlock(user)}
                      title={user.isBlocked ? "Unblock User" : "Block User"}
                      className={`p-2 rounded-xl transition-colors ${user.isBlocked ? "text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20" : "text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20"}`}
                    >
                      {user.isBlocked ? (
                        <UserCheck size={18} />
                      ) : (
                        <Ban size={18} />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                      title="Delete Permanently"
                    >
                      <Trash2 size={18} />
                    </button>
                    <button className="p-2 text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
