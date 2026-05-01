'use client';

import React from 'react';
import { Home, Store, Plus, MessageSquare, User, Sun, Bell, Search, Settings, LogOut, Sprout } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@/context/AuthContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useUser();

  const navItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Mandi', icon: Store, path: '/mandi' },
    { name: 'Charcha', icon: MessageSquare, path: '/charcha' },
    { name: 'Search', icon: Search, path: '/search' },
    { name: 'Weather', icon: Sun, path: '/weather' },
    { name: 'Crop Advisor', icon: Sprout, path: '/crop-advisor' },
    { name: 'Notifications', icon: Bell, path: '/notifications' },
    { name: 'Profile', icon: User, path: `/profile/${user?.id || ''}` },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 lg:w-72 xl:w-80 h-screen sticky top-0 bg-white border-r border-gray-100 p-8 lg:p-10">
      <div className="mb-12">
        <Link href="/" className="text-3xl lg:text-4xl font-black text-[#2E7D32] tracking-tighter">
          KrishiSocial
        </Link>
        <p className="text-[10px] lg:text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">
          Farmer's Digital Community
        </p>
      </div>

      <nav className="flex-1 space-y-3">
        {navItems.map((item) => {
          const isActive = pathname === item.path || (item.name === 'Profile' && pathname.startsWith('/profile'));
          return (
            <Link
              key={item.name}
              href={item.path}
              className={cn(
                "flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 group",
                isActive 
                  ? "bg-[#E8F5E9] text-[#2E7D32]" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon 
                size={24} 
                className={cn(
                  "transition-transform group-hover:scale-110",
                  isActive ? "text-[#2E7D32]" : "text-gray-400"
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={cn(
                "font-bold text-base lg:text-lg",
                isActive ? "text-[#2E7D32]" : "text-gray-600"
              )}>
                {item.name}
              </span>
              {item.name === 'Notifications' && (
                <div className="ml-auto w-2.5 h-2.5 rounded-full bg-red-500" />
              )}
            </Link>
          );
        })}

        <button 
          className="w-full flex items-center justify-center gap-4 px-4 py-5 mt-6 bg-[#2E7D32] text-white rounded-2xl shadow-xl shadow-[#2E7D32]/20 hover:bg-[#256629] transition-all active:scale-95 group"
        >
          <div className="bg-white/20 p-2 rounded-lg group-hover:rotate-12 transition-transform">
             <Plus size={24} />
          </div>
          <span className="font-black text-base lg:text-lg uppercase tracking-wide">New Post</span>
        </button>
      </nav>

      <div className="mt-auto pt-8 border-t border-gray-100">
        {user && (
          <div className="flex items-center gap-4 mb-8 px-2">
            <div className="w-12 h-12 rounded-full bg-[#2E7D32] flex items-center justify-center text-white font-black text-xl shadow-inner">
              {user.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-black text-gray-900 truncate">{user.name}</p>
              <p className="text-xs font-bold text-gray-400 truncate uppercase">{user.username}</p>
            </div>
          </div>
        )}
        
        <div className="space-y-2">
          <Link 
            href="/settings" 
            className="flex items-center gap-4 px-5 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <Settings size={20} />
            <span className="text-sm lg:text-base font-bold">Settings</span>
          </Link>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-4 px-5 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            <span className="text-sm lg:text-base font-bold">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
