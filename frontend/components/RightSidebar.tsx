'use client';

import React from 'react';
import { TrendingUp, Users, ChevronRight } from 'lucide-react';
import WeatherCard from './WeatherCard';
import { useUser } from '@/context/AuthContext';
import Link from 'next/link';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function RightSidebar() {
  const { user } = useUser();

  return (
    <aside className="hidden xl:flex flex-col w-[320px] 2xl:w-[380px] h-screen sticky top-0 px-6 py-8 space-y-8 overflow-y-auto no-scrollbar flex-shrink-0 bg-white">
      {/* User Quick Profile (Instagram Style) */}
      {user && (
        <div className="flex items-center justify-between px-2">
            <Link href={`/profile/${user.username}`} className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#2E7D32] to-[#43A047] flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-105 transition-transform">
                    {user.name[0]}
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900 group-hover:underline">@{user.username}</span>
                    <span className="text-xs text-gray-500 font-medium">{user.name}</span>
                </div>
            </Link>
            <button className="text-[11px] font-black text-[#2E7D32] uppercase tracking-wider hover:text-green-800 transition-colors">
                Switch
            </button>
        </div>
      )}

      {/* Weather Quick View */}
      <WeatherCard />

      {/* Suggested Farmers (Instagram Style) */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-4 px-2">
          <h3 className="text-sm font-bold text-gray-500">Suggestions For You</h3>
          <button className="text-[11px] font-black text-gray-900 uppercase tracking-tight hover:opacity-70 transition-opacity">See All</button>
        </div>
        <div className="space-y-4">
          {[
            { name: 'Rajesh Kumar', crop: 'Rice Specialist', initial: 'R', followedBy: 'Amit Singh' },
            { name: 'Savitri Devi', crop: 'Organic Expert', initial: 'S', followedBy: 'Rajesh Kumar' },
            { name: 'Amit Singh', crop: 'Modern Tech', initial: 'A', followedBy: 'You' },
          ].map((farmer) => (
            <div key={farmer.name} className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center font-bold text-[#2E7D32] text-sm border border-gray-100">
                    {farmer.initial}
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-gray-900 truncate">{farmer.name}</span>
                    <span className="text-[10px] text-gray-400 font-medium truncate">Followed by {farmer.followedBy}</span>
                </div>
              </div>
              <button className="text-[11px] font-black text-[#2E7D32] hover:text-green-800 transition-colors">Follow</button>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Topics (Reddit Style) */}
      <div className="bg-gray-50/50 rounded-3xl p-6 border border-gray-100 shadow-sm w-full">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp size={18} className="text-[#2E7D32]" />
          <h3 className="text-base font-black text-gray-900">Trending Now</h3>
        </div>
        <div className="space-y-5">
          {[
            { tag: '#OrganicWheat', posts: '2.5k posts', category: 'Farming' },
            { tag: '#MonsoonTips', posts: '1.8k posts', category: 'Weather' },
            { tag: '#MandiRates', posts: '5.2k posts', category: 'Business' },
            { tag: '#SmartFarming', posts: '950 posts', category: 'Tech' },
          ].map((item) => (
            <div key={item.tag} className="group cursor-pointer flex justify-between items-start">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-0.5">{item.category} • Trending</p>
                <p className="text-sm font-black text-gray-800 group-hover:text-[#2E7D32] transition-colors">{item.tag}</p>
                <p className="text-[11px] font-medium text-gray-500 mt-0.5">{item.posts}</p>
              </div>
              <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                 <ChevronRight size={14} className="text-gray-400" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Links */}
      <div className="px-2 pb-8 text-[10px] font-bold text-gray-400 uppercase tracking-widest flex flex-wrap gap-x-4 gap-y-2 opacity-60">
        <Link href="/about" className="hover:underline">About</Link>
        <Link href="/privacy" className="hover:underline">Privacy</Link>
        <Link href="/terms" className="hover:underline">Terms</Link>
        <Link href="/help" className="hover:underline">Help</Link>
        <span>© 2026 KrishiSocial</span>
      </div>
    </aside>
  );
}
