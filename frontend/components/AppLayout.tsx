'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '@/context/AuthContext';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import Sidebar from '@/components/Sidebar';
import RightSidebar from '@/components/RightSidebar';

function AppContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useUser();
  const isAuthPage = pathname === '/login' || pathname === '/register';

  useEffect(() => {
    if (!loading && !user && !isAuthPage) {
      router.push('/login');
    }
  }, [user, loading, isAuthPage, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F0F9F0]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2E7D32]"></div>
      </div>
    );
  }

  if (isAuthPage) {
    return <>{children}</>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex justify-center xl:gap-4 2xl:gap-8 max-w-[1600px] mx-auto min-h-screen px-4 xl:px-6 2xl:px-0">
      {/* Left Sidebar - Desktop only */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 max-w-[700px] 2xl:max-w-[800px] border-x border-gray-100 bg-white min-h-screen relative shadow-sm flex flex-col">
        <div className="md:hidden">
          {pathname !== '/weather' && <Header />}
        </div>
        <main className="flex-1 pb-24 md:pb-0">{children}</main>
        <div className="md:hidden">
          <BottomNav />
        </div>
      </div>

      {/* Right Sidebar - Desktop only */}
      <RightSidebar />
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppContent>{children}</AppContent>
  );
}
