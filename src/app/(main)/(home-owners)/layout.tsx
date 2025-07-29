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
    <div style={{ display: 'flex', height: '100vh' }}>
      <HostSidebar />
      <main style={{ flex: 1, padding: '1rem' }}>
        {children}
      </main>
    </div>
  );
}