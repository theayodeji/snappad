"use client"
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import HostSidebar from './_components/HostSidebar';

export default function HomeOwnersLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user?.role === 'guest') {
      router.push('/');
    }
  }, [user, loading, router]);

  return (
    <div className="flex items-start">
      <HostSidebar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}