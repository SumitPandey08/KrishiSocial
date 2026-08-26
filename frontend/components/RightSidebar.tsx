'use client';

import React, { useState } from 'react';
import { 
  TrendingUp, Sparkles, ChevronRight, Stethoscope, 
  Store, ArrowUpRight, ArrowDownRight, CheckCircle2, 
  Search, ShieldCheck, Check
} from 'lucide-react';
import WeatherCard from './WeatherCard';
import { useUser } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RightSidebar() {
  const { user } = useUser();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [followingState, setFollowingState] = useState<Record<string, boolean>>({});

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const toggleFollow = (name: string) => {
    setFollowingState(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const mandiTicker = [
    { crop: 'Wheat (Sarbati)', price: '₹2,480', change: '+2.4%', isUp: true, market: 'Indore APMC' },
    { crop: 'Basmati Rice', price: '₹3,950', change: '+1.1%', isUp: true, market: 'Karnal Mandi' },
    { crop: 'Cotton (Medium)', price: '₹7,100', change: '-0.8%', isUp: false, market: 'Rajkot APMC' },
  ];

  const suggestedExperts = [
    { name: 'Dr. Rajesh Kumar', crop: 'Agronomist • Rice', initial: 'R', color: 'from-emerald-600 to-teal-500' },
    { name: 'Savitri Devi', crop: 'Organic Soil Expert', initial: 'S', color: 'from-green-600 to-emerald-500' },
    { name: 'Amit Singh', crop: 'Precision Agri-Tech', initial: 'A', color: 'from-teal-600 to-cyan-500' },
  ];

  const trendingTopics = [
    { tag: 'OrganicWheat', display: '#OrganicWheat', posts: '2.5k posts', category: 'Farming' },
    { tag: 'MonsoonTips', display: '#MonsoonTips', posts: '1.8k posts', category: 'Weather' },
    { tag: 'MandiRates', display: '#MandiRates', posts: '5.2k posts', category: 'Market' },
  ];

  return (
    <aside className="hidden xl:flex flex-col w-[310px] 2xl:w-[350px] h-screen sticky top-0 px-3 2xl:px-4 py-5 space-y-4.5 overflow-y-auto no-scrollbar flex-shrink-0 select-none pb-20 z-30">
      {/* Top Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative w-full">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search KrishiSocial..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white hover:bg-slate-50 focus:bg-white text-xs font-semibold text-slate-900 placeholder:text-slate-400 pl-10 pr-4 py-3 rounded-2xl border border-slate-200/80 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 outline-none shadow-xs transition-all"
        />
      </form>

      {/* Featured RAG AI Doctor Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-emerald-950 to-teal-950 rounded-3xl p-6 text-white shadow-lg shadow-emerald-950/15 border border-emerald-500/20 group hover:border-emerald-500/35 transition-all min-h-[235px] flex flex-col justify-between">
        <div className="absolute -top-6 -right-6 w-40 h-40 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-black uppercase tracking-wider">
              <Sparkles size={12} className="animate-pulse" /> RAG Vision AI
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
              <Stethoscope size={20} />
            </div>
          </div>

          <div>
            <h4 className="text-base font-black text-white tracking-tight">AI Crop Disease Doctor</h4>
            <p className="text-xs text-emerald-100/80 font-medium leading-relaxed mt-1.5">
              Upload leaf photos for instant diagnosis & scientific cures cited from ICAR/FAO research PDFs.
            </p>
          </div>

          <Link
            href="/disease-detector"
            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 text-slate-950 py-3 rounded-2xl font-black text-xs uppercase tracking-wider shadow-md hover:brightness-105 active:scale-95 transition-all"
          >
            Launch Photo Scanner <ChevronRight size={15} strokeWidth={3} />
          </Link>
        </div>
      </div>

      {/* Weather Quick View Widget */}
      <WeatherCard />

      {/* Live Mandi Ticker Widget */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
              <Store size={15} />
            </div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Live Mandi Ticker</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Live updates" />
            </div>
          </div>
          <Link href="/mandi" className="text-[10px] font-black text-emerald-700 uppercase tracking-tight hover:underline">
            All Rates
          </Link>
        </div>

        <div className="space-y-2.5">
          {mandiTicker.map((item, idx) => (
            <div key={idx} className="bg-slate-50/70 hover:bg-slate-50 p-3 rounded-2xl border border-slate-100/80 flex items-center justify-between transition-colors">
              <div className="min-w-0 pr-2">
                <h5 className="text-xs font-black text-slate-900 leading-tight truncate">{item.crop}</h5>
                <span className="text-[10px] font-bold text-slate-400 block truncate mt-0.5">{item.market}</span>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs font-black text-slate-900 block">{item.price}</span>
                <span className={`text-[10px] font-black inline-flex items-center gap-0.5 mt-0.5 ${
                  item.isUp ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {item.isUp ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                  {item.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Agricultural Experts */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700">
              <ShieldCheck size={15} />
            </div>
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Verified Experts</h3>
          </div>
          <Link href="/search" className="text-[10px] font-black text-emerald-700 uppercase tracking-tight hover:underline">
            Explore
          </Link>
        </div>

        <div className="space-y-2.5">
          {suggestedExperts.map((expert) => {
            const isFollowing = !!followingState[expert.name];
            return (
              <div key={expert.name} className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50/80 transition-colors">
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-tr ${expert.color} text-white flex items-center justify-center font-black text-xs shrink-0 relative shadow-xs`}>
                    {expert.initial}
                    <CheckCircle2 size={12} className="absolute -bottom-0.5 -right-0.5 text-emerald-600 fill-white" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-black text-slate-900 truncate leading-tight">{expert.name}</span>
                    <span className="text-[10px] text-slate-400 font-semibold truncate mt-0.5">{expert.crop}</span>
                  </div>
                </div>
                <button 
                  onClick={() => toggleFollow(expert.name)}
                  className={`text-[10px] font-black px-3 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1 ${
                    isFollowing 
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' 
                      : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <Check size={11} strokeWidth={3} /> Following
                    </>
                  ) : (
                    'Follow'
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trending Topics */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3.5">
        <div className="flex items-center gap-2 px-0.5">
          <div className="w-7 h-7 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
            <TrendingUp size={15} />
          </div>
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Trending in Agri</h3>
        </div>
        <div className="space-y-2">
          {trendingTopics.map((item) => (
            <Link 
              key={item.tag} 
              href={`/search?q=${encodeURIComponent(item.tag)}`}
              className="group flex justify-between items-center p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <div className="min-w-0 pr-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{item.category}</p>
                <p className="text-xs font-black text-slate-800 group-hover:text-emerald-600 transition-colors truncate mt-0.5">{item.display}</p>
                <p className="text-[10px] font-semibold text-slate-400 mt-0.5">{item.posts}</p>
              </div>
              <ChevronRight size={14} className="text-slate-300 group-hover:translate-x-0.5 group-hover:text-emerald-600 transition-all shrink-0" />
            </Link>
          ))}
        </div>
      </div>

      {/* Footer Links */}
      <div className="px-2 pt-2 pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex flex-wrap gap-x-3 gap-y-1.5 opacity-70">
        <Link href="/welcome" className="hover:text-emerald-700 transition-colors">About</Link>
        <Link href="/welcome" className="hover:text-emerald-700 transition-colors">Privacy</Link>
        <Link href="/welcome" className="hover:text-emerald-700 transition-colors">Terms</Link>
        <Link href="/search" className="hover:text-emerald-700 transition-colors">Explore</Link>
        <span className="w-full text-[9px] font-semibold text-slate-400/80 mt-1">© 2026 KrishiSocial • Empowering Farmers</span>
      </div>
    </aside>
  );
}
