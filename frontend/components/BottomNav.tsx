'use client';

import React from 'react';
import { Home, Store, Plus, MessageSquare, User, ShieldCheck } from 'lucide-react';
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
    { name: 'Create', icon: Plus, path: '/create', isCenter: true },
    { name: 'Charcha', icon: MessageSquare, path: '/charcha' },
    ...(user?.role === 'admin' 
      ? [{ name: 'Admin', icon: ShieldCheck, path: '/admin/dashboard' }] 
      : [{ name: 'Profile', icon: User, path: `/profile/${user?.username || ''}` }]),
  ];

  return (
    <nav className="fixed bottom-5 left-5 right-5 h-[70px] bg-white rounded-[25px] shadow-2xl border-t border-gray-100 flex items-center justify-around px-2 z-50 md:max-w-screen-sm md:mx-auto">
      {navItems.map((item) => {
        const Icon = item.icon || User; // Default icon
        const path = item.path || '/profile';
        const name = item.name;
        const isCenter = item.isCenter;
        
        const isActive = pathname === path || (name === 'Profile' && pathname.startsWith('/profile'));

        if (isCenter) {
          return (
            <Link key={name} href={path} className="relative -top-4 group">
               <div className="w-[52px] h-[54px] bg-[#2E7D32] rounded-[18px] rotate-45 flex items-center justify-center shadow-lg shadow-[#2E7D32]/30 transition-transform group-active:scale-90">
                  <div className="-rotate-45">
                    <Plus size={32} className="text-white" />
                  </div>
               </div>
            </Link>
          );
        }

        return (
          <Link 
            key={name} 
            href={path}
            className="flex flex-col items-center gap-1 transition-colors active:scale-95"
          >
            <Icon 
              size={22} 
              className={isActive ? "text-[#2E7D32]" : "text-[#94A3B8]"} 
              strokeWidth={isActive ? 2.5 : 2}
            />
            <span className={cn(
              "text-[10px] font-bold uppercase",
              isActive ? "text-[#2E7D32]" : "text-[#94A3B8]"
            )}>
              {name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
