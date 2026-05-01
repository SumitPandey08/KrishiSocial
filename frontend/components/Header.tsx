'use client';

import React from 'react';
import { useUser } from '@/context/AuthContext';
import { Sun, Bell, Search } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  const { user } = useUser();

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-[#F1F8F1]">
      <div className="max-w-screen-md mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex flex-col">
          <Link href="/" className="text-2xl font-black text-[#2E7D32] tracking-tighter">
            KrishiSocial
          </Link>
          {user && (
            <span className="text-xs font-semibold text-gray-500 -mt-1">
              Namaste, {user.name.split(' ')[0]}
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Link href="/search" className="flex flex-col items-center group">
            <div className="w-10 h-10 rounded-full bg-[#F1F8F1] flex items-center justify-center text-[#2E7D32] group-active:scale-90 transition-transform">
              <Search size={20} />
            </div>
            <span className="text-[10px] font-extrabold text-[#2E7D32] mt-1 uppercase">Search</span>
          </Link>

          <Link href="/weather" className="flex flex-col items-center group">
            <div className="w-10 h-10 rounded-full bg-[#F1F8F1] flex items-center justify-center text-[#2E7D32] group-active:scale-90 transition-transform">
              <Sun size={20} />
            </div>
            <span className="text-[10px] font-extrabold text-[#2E7D32] mt-1 uppercase">Weather</span>
          </Link>

          <Link href="/notifications" className="flex flex-col items-center relative group">
            <div className="w-10 h-10 rounded-full bg-[#F1F8F1] flex items-center justify-center text-[#2E7D32] group-active:scale-90 transition-transform">
              <Bell size={20} />
              <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#FF5252] border-2 border-white" />
            </div>
            <span className="text-[10px] font-extrabold text-[#2E7D32] mt-1 uppercase">Alerts</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
