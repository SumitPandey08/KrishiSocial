'use client';

import React from 'react';
import { useUser } from '@/context/AuthContext';
import { Sun, Bell, Search, Sprout, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  const { user } = useUser();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-emerald-100/60 shadow-xs">
      <div className="max-w-screen-md mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
            <Sprout size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-slate-900 tracking-tighter flex items-center gap-1">
              Krishi<span className="text-emerald-600">Social</span>
            </span>
            {user && (
              <span className="text-[10px] font-bold text-slate-400 -mt-1 tracking-tight">
                Namaste, {user.name.split(' ')[0]} 👋
              </span>
            )}
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/disease-detector" className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-all border border-emerald-200/60 active:scale-95">
            <Sparkles size={14} className="text-emerald-600 animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-wider">AI Doctor</span>
          </Link>

          <Link href="/search" className="p-2 rounded-xl bg-slate-100/80 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 transition-colors active:scale-95">
            <Search size={18} />
          </Link>

          <Link href="/weather" className="p-2 rounded-xl bg-slate-100/80 hover:bg-amber-50 hover:text-amber-600 text-slate-600 transition-colors active:scale-95">
            <Sun size={18} />
          </Link>

          <Link href="/notifications" className="p-2 rounded-xl bg-slate-100/80 hover:bg-rose-50 hover:text-rose-600 text-slate-600 transition-colors relative active:scale-95">
            <Bell size={18} />
            <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </Link>
        </div>
      </div>
    </header>
  );
}
