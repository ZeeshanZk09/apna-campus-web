// src/app/admin/users/page.tsx

import { UserPlus } from "lucide-react";
// import { Button } from '@/components/ui/Button'; // Assuming a generic Button component exist or I create one
import Link from "next/link";
import UsersTable from "@/components/admin/UsersTable";
import { Button } from "@/components/ui/button";
import { getAllUsers } from "@/lib/queries/userQueries";

export default async function UsersPage() {
  const users = await getAllUsers();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage students, teachers, parents, and staff members.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/users/new">
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Link>
        </Button>
      </div>

      <div className="bg-card rounded-lg border shadow-sm">
        <UsersTable initialUsers={users} />
      </div>
    </div>
  );
}
