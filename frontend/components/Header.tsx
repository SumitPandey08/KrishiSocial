'use client';

import React from 'react';
import { useUser } from '@/context/AuthContext';
import { Sun, Bell, Search, Sprout, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  const { user } = useUser();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-emerald-100/60 shadow-xs">
      <div className="w-full max-w-screen-md mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2">
        <Link href="/" className="flex items-center gap-2 group min-w-0 shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform shrink-0">
            <Sprout size={18} className="sm:w-5 sm:h-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-lg sm:text-xl font-black text-slate-900 tracking-tighter flex items-center gap-0.5">
              Krishi<span className="text-emerald-600">Social</span>
            </span>
            {user && (
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 -mt-1 tracking-tight truncate max-w-[120px] sm:max-w-[160px]">
                Namaste, {user.name?.split(' ')[0] || 'Farmer'} 👋
              </span>
            )}
          </div>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <Link 
            href="/disease-detector" 
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-all border border-emerald-200/60 active:scale-95 text-[10px] sm:text-[11px] font-black uppercase tracking-wider"
          >
            <Sparkles size={13} className="text-emerald-600 animate-pulse shrink-0" />
            <span className="hidden min-[380px]:inline">AI Doctor</span>
          </Link>

          <Link 
            href="/search" 
            aria-label="Search"
            className="p-1.5 sm:p-2 rounded-xl bg-slate-100/80 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 transition-colors active:scale-95"
          >
            <Search size={16} className="sm:w-[18px] sm:h-[18px]" />
          </Link>

          <Link 
            href="/weather" 
            aria-label="Weather"
            className="p-1.5 sm:p-2 rounded-xl bg-slate-100/80 hover:bg-amber-50 hover:text-amber-600 text-slate-600 transition-colors active:scale-95"
          >
            <Sun size={16} className="sm:w-[18px] sm:h-[18px]" />
          </Link>

          <Link 
            href="/notifications" 
            aria-label="Notifications"
            className="p-1.5 sm:p-2 rounded-xl bg-slate-100/80 hover:bg-rose-50 hover:text-rose-600 text-slate-600 transition-colors relative active:scale-95"
          >
            <Bell size={16} className="sm:w-[18px] sm:h-[18px]" />
            <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </Link>
        </div>
      </div>
    </header>
  );
}
