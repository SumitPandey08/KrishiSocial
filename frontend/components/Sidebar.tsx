'use client';

import React from 'react';
import { 
  Home, Store, PlusSquare, MessageSquare, User, Sun, 
  Bell, Search, Sprout, ShieldCheck, LogOut, Stethoscope, 
  Sparkles, Compass, ChevronRight 
} from 'lucide-react';
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

  const navSections = [
    {
      title: 'FEED & MARKET',
      items: [
        { name: 'Home Feed', icon: Home, path: '/' },
        { name: 'Discover & Search', icon: Search, path: '/search' },
        { name: 'APMC Mandi Rates', icon: Store, path: '/mandi' },
        { name: 'Charcha Forums', icon: MessageSquare, path: '/charcha' },
      ]
    },
    {
      title: 'AI & ADVISORY',
      items: [
        { name: 'AI Disease Doctor', icon: Stethoscope, path: '/disease-detector', badge: 'RAG AI', badgeColor: 'bg-emerald-500 text-white' },
        { name: 'Soil Crop Planner', icon: Sprout, path: '/crop-advisor', badge: 'V2.2', badgeColor: 'bg-teal-100 text-teal-800' },
        { name: 'Weather Forecast', icon: Sun, path: '/weather' },
      ]
    },
    {
      title: 'PERSONAL',
      items: [
        { name: 'Notifications', icon: Bell, path: '/notifications', badge: '3', badgeColor: 'bg-rose-500 text-white' },
        { name: 'Create Post', icon: PlusSquare, path: '/create' },
        ...(user?.role === 'admin' ? [{ name: 'Admin Dashboard', icon: ShieldCheck, path: '/admin/dashboard' }] : []),
        { name: 'My Profile', icon: User, path: `/profile/${user?.username || ''}` },
      ]
    }
  ];

  return (
    <aside className="hidden md:flex flex-col w-[250px] xl:w-[280px] h-screen sticky top-0 bg-white border-r border-slate-100 px-4 py-6 flex-shrink-0 z-30 select-none">
      {/* Brand Logo Header */}
      <div className="px-2 mb-6">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-700/25 group-hover:scale-105 transition-transform duration-300">
            <Sprout size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-slate-900 tracking-tighter leading-none flex items-center gap-1">
              Krishi<span className="text-emerald-600">Social</span>
            </span>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-1">
              Agri AI Ecosystem
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 space-y-6 overflow-y-auto no-scrollbar pr-1">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1.5">
            <h4 className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {section.title}
            </h4>
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.path || (item.name === 'My Profile' && pathname.startsWith('/profile'));
                return (
                  <Link
                    key={item.name}
                    href={item.path}
                    className={cn(
                      "group relative flex items-center justify-between px-3 py-3 rounded-2xl transition-all duration-200",
                      isActive 
                        ? "bg-slate-900 text-white font-black shadow-md shadow-slate-950/10" 
                        : "text-slate-600 font-bold hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-emerald-500 rounded-r-full" />
                    )}

                    <div className="flex items-center gap-3 min-w-0">
                      <item.icon 
                        size={20} 
                        className={cn(
                          "transition-transform group-hover:scale-110 shrink-0",
                          isActive ? "text-emerald-400" : "text-slate-500 group-hover:text-slate-900"
                        )}
                        strokeWidth={isActive ? 2.5 : 2}
                      />
                      <span className="text-xs tracking-tight truncate">
                        {item.name}
                      </span>
                    </div>

                    {item.badge && (
                      <span className={cn(
                        "px-2 py-0.5 text-[9px] font-black rounded-full uppercase tracking-wider shrink-0 ml-2",
                        item.badgeColor || "bg-emerald-100 text-emerald-800"
                      )}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Profile & Logout Card */}
      <div className="mt-auto pt-4 border-t border-slate-100 space-y-2">
        {user ? (
          <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between group">
            <Link href={`/profile/${user.username}`} className="flex items-center gap-3 min-w-0 flex-1">
              <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-black text-xs shadow-xs">
                  {user.name[0]}
                </div>
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-black text-slate-900 truncate group-hover:underline">{user.name}</span>
                <span className="text-[10px] font-bold text-slate-400 truncate">@{user.username}</span>
              </div>
            </Link>

            <button 
              onClick={handleLogout}
              title="Logout"
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="w-full py-3 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all"
          >
            Sign In Account <ChevronRight size={14} />
          </Link>
        )}
      </div>
    </aside>
  );
}
