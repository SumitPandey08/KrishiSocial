'use client';

import React from 'react';
import { Home, Store, MessageSquare, User, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@/context/AuthContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function BottomNav() {
  const pathname = usePathname();
  const { user } = useUser();

  const navItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Mandi', icon: Store, path: '/mandi' },
    { name: 'AI Doctor', icon: Sparkles, path: '/disease-detector', isCenter: true },
    { name: 'Charcha', icon: MessageSquare, path: '/charcha' },
    { name: 'Profile', icon: User, path: `/profile/${user?.username || ''}` },
  ];

  return (
    <nav className="fixed bottom-2.5 sm:bottom-3 left-3 right-3 sm:left-4 sm:right-4 max-w-lg mx-auto h-[64px] sm:h-[68px] bg-slate-950/95 backdrop-blur-xl rounded-full shadow-2xl border border-slate-800 flex items-center justify-around px-2 sm:px-3 z-40 md:hidden safe-area-bottom">
      {navItems.map((item) => {
        const Icon = item.icon;
        const path = item.path;
        const name = item.name;
        const isCenter = item.isCenter;
        
        const isActive = pathname === path || (name === 'Profile' && pathname.startsWith('/profile'));

        if (isCenter) {
          return (
            <Link key={name} href={path} className="relative -top-4 sm:-top-5 group shrink-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/40 border-2 sm:border-4 border-slate-950 transition-transform group-active:scale-95">
                <Sparkles size={20} className="text-slate-950 sm:w-6 sm:h-6" />
              </div>
            </Link>
          );
        }

        return (
          <Link 
            key={name} 
            href={path}
            className="flex-1 flex flex-col items-center gap-0.5 transition-all active:scale-90 min-w-0"
          >
            <Icon 
              size={18} 
              className={cn("sm:w-5 sm:h-5", isActive ? "text-emerald-400" : "text-slate-400")} 
              strokeWidth={isActive ? 2.5 : 2}
            />
            <span className={cn(
              "text-[8.5px] sm:text-[9px] font-black uppercase tracking-wider truncate max-w-full px-0.5",
              isActive ? "text-emerald-400" : "text-slate-400"
            )}>
              {name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
