'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider, useUser } from "@/context/AuthContext";
import { PostProvider } from "@/context/PostContext";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import Sidebar from "@/components/Sidebar";
import RightSidebar from "@/components/RightSidebar";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    return (
      <div className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#F0F9F0] min-h-screen`}>
        {children}
      </div>
    );
  }

  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#F8FBF8] min-h-screen`}>
      <div className="flex justify-center xl:gap-8 lg:gap-4 max-w-[1600px] mx-auto min-h-screen px-0 md:px-4 lg:px-8">
        {/* Left Sidebar - Desktop only */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 max-w-[800px] border-x border-gray-100 bg-white min-h-screen relative shadow-sm">
          <div className="md:hidden">
            <Header />
          </div>
          <main className="pb-24 md:pb-0">
            {children}
          </main>
          <div className="md:hidden">
            <BottomNav />
          </div>
        </div>

        {/* Right Sidebar - Desktop only */}
        <RightSidebar />
      </div>
    </div>
  );
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <PostProvider>
            <AppContent>{children}</AppContent>
          </PostProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
