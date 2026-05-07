'use client';

import React from 'react';
import { Home, Store, PlusSquare, MessageSquare, User, Sun, Bell, Search, Menu, Sprout, ShieldCheck, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '@/context/AuthContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const navItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Search', icon: Search, path: '/search' },
    { name: 'Mandi', icon: Store, path: '/mandi' },
    { name: 'Charcha', icon: MessageSquare, path: '/charcha' },
    { name: 'Crop Advisor', icon: Sprout, path: '/crop-advisor' },
    { name: 'Weather', icon: Sun, path: '/weather' },
    { name: 'Notifications', icon: Bell, path: '/notifications' },
    { name: 'Create', icon: PlusSquare, path: '/create' },
    ...(user?.role === 'admin' ? [{ name: 'Admin', icon: ShieldCheck, path: '/admin/dashboard' }] : []),
    { name: 'Profile', icon: User, path: `/profile/${user?.username || ''}` },
  ];

  return (
    <aside className="hidden md:flex flex-col w-[240px] xl:w-[280px] h-screen sticky top-0 bg-white border-r border-gray-100 px-3 py-8 flex-shrink-0">
      {/* Logo */}
      <div className="px-4 mb-10">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-[#2E7D32] rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-900/20 group-hover:rotate-6 transition-transform">
             <Sprout size={24} />
          </div>
          <span className="text-2xl font-black text-gray-900 tracking-tighter">
            Krishi<span className="text-[#2E7D32]">Social</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.path || (item.name === 'Profile' && pathname.startsWith('/profile'));
          return (
            <Link
              key={item.name}
              href={item.path}
              className={cn(
                "flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-gray-50 text-gray-900" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon 
                size={26} 
                className={cn(
                  "transition-transform group-hover:scale-105",
                  isActive ? "text-gray-900" : "text-gray-600"
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={cn(
                "text-[15px] xl:text-base",
                isActive ? "font-bold" : "font-medium"
              )}>
                {item.name}
              </span>
              {item.name === 'Notifications' && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#2E7D32]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Profile/More */}
      <div className="mt-auto pt-4">
        <div className="space-y-1">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-red-600 hover:bg-red-50 transition-all group"
          >
            <LogOut size={26} className="group-hover:scale-105 transition-transform" />
            <span className="text-[15px] xl:text-base font-medium">Logout</span>
          </button>
          
          <button 
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all group"
          >
            <Menu size={26} className="group-hover:scale-105 transition-transform" />
            <span className="text-[15px] xl:text-base font-medium">More</span>
          </button>
          
          {user && (
            <Link 
              href={`/profile/${user.username}`}
              className="flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-gray-50 transition-all mt-2"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#2E7D32] to-[#43A047] flex items-center justify-center text-white font-bold text-sm shadow-md shadow-green-900/10">
                {user.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                <p className="text-[11px] font-medium text-gray-400 truncate">@{user.username}</p>
              </div>
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}
