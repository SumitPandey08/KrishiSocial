'use client';

import React from 'react';
import { Sun, CloudRain, TrendingUp, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function RightSidebar() {
  return (
    <aside className="hidden xl:flex flex-col w-80 xl:w-96 h-screen sticky top-0 p-8 space-y-8 overflow-y-auto no-scrollbar">
      {/* Weather Quick View */}
      <div className="bg-gradient-to-br from-[#2E7D32] to-[#43A047] rounded-[32px] p-8 text-white shadow-2xl shadow-[#2E7D32]/20">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-xs lg:text-sm font-bold opacity-80 uppercase tracking-wider mb-1">Today's Weather</p>
            <h3 className="text-4xl lg:text-5xl font-black">28°C</h3>
            <p className="text-xs lg:text-sm font-bold opacity-90 uppercase mt-1">Bhopal, MP</p>
          </div>
          <Sun size={48} className="text-yellow-300 drop-shadow-lg" />
        </div>
        <div className="flex gap-6 border-t border-white/20 pt-6 mt-6">
          <div className="flex-1">
            <p className="text-[11px] font-bold opacity-70 uppercase tracking-tight">Humidity</p>
            <p className="text-base font-black">45%</p>
          </div>
          <div className="flex-1">
            <p className="text-[11px] font-bold opacity-70 uppercase tracking-tight">Rain Chance</p>
            <p className="text-base font-black">10%</p>
          </div>
        </div>
        <Link href="/weather" className="mt-6 flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 py-3 rounded-2xl transition-all text-xs lg:text-sm font-bold uppercase tracking-wide active:scale-95">
          Full Forecast <ArrowRight size={16} />
        </Link>
      </div>

      {/* Trending Topics */}
      <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp size={24} className="text-[#2E7D32]" />
          <h3 className="text-xl font-black text-gray-900">Trending in Krishi</h3>
        </div>
        <div className="space-y-6">
          {[
            { tag: '#OrganicWheat', posts: '2.5k posts', trend: 'up' },
            { tag: '#MonsoonTips', posts: '1.8k posts', trend: 'up' },
            { tag: '#MandiRates', posts: '5.2k posts', trend: 'down' },
            { tag: '#SmartFarming', posts: '950 posts', trend: 'up' },
          ].map((item) => (
            <div key={item.tag} className="group cursor-pointer">
              <p className="text-base font-black text-gray-800 group-hover:text-[#2E7D32] transition-colors">{item.tag}</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-tight mt-0.5">{item.posts}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Farmers */}
      <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Users size={24} className="text-[#2E7D32]" />
          <h3 className="text-xl font-black text-gray-900">Farmers to Follow</h3>
        </div>
        <div className="space-y-5">
          {[
            { name: 'Rajesh Kumar', crop: 'Rice Specialist', initial: 'R' },
            { name: 'Savitri Devi', crop: 'Organic Expert', initial: 'S' },
            { name: 'Amit Singh', crop: 'Modern Tech', initial: 'A' },
          ].map((farmer) => (
            <div key={farmer.name} className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center font-black text-lg text-[#2E7D32] shadow-inner">
                {farmer.initial}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-black text-gray-900 truncate">{farmer.name}</p>
                <p className="text-[11px] font-bold text-gray-400 uppercase">{farmer.crop}</p>
              </div>
              <button className="text-xs font-black text-[#2E7D32] hover:bg-[#E8F5E9] px-4 py-2 rounded-xl transition-colors border border-transparent hover:border-[#2E7D32]/10">
                Follow
              </button>
            </div>
          ))}
        </div>
        <button className="w-full mt-8 text-sm font-black text-gray-400 hover:text-[#2E7D32] transition-colors uppercase tracking-widest">
          Show More
        </button>
      </div>

      {/* Footer Links */}
      <div className="px-6 pb-8 text-[11px] font-bold text-gray-400 uppercase tracking-widest flex flex-wrap gap-x-5 gap-y-3">
        <span className="hover:text-gray-600 cursor-pointer transition-colors">About</span>
        <span className="hover:text-gray-600 cursor-pointer transition-colors">Privacy</span>
        <span className="hover:text-gray-600 cursor-pointer transition-colors">Terms</span>
        <span className="hover:text-gray-600 cursor-pointer transition-colors">Cookies</span>
        <span className="w-full pt-2">© 2026 KrishiSocial</span>
      </div>
    </aside>
  );
}
