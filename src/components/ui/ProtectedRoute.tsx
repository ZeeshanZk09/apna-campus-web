'use client';

import { User } from '@/app/generated/prisma/browser';
// import { User } from "@/app/lib/models/User";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProtectedRoute({
  children,
  adminOnly = false,
}: {
  children: React.ReactNode;
  adminOnly?: boolean;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/current-user');
        const data = await response.json();

        if (!data.user) {
          router.push('/login');
          return;
        }

        if (adminOnly && !data.user.isAdmin) {
          router.push('/profile');
          return;
        }

        setUser(data.user);
      } catch (error) {
        console.error('Auth check failed', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, adminOnly]);

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
