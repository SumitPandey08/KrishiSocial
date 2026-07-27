'use client';

import React from 'react';
import { TrendingUp, Sparkles, ChevronRight, Stethoscope, Store, ArrowUpRight, ArrowDownRight, CheckCircle2 } from 'lucide-react';
import WeatherCard from './WeatherCard';
import { useUser } from '@/context/AuthContext';
import Link from 'next/link';

export default function RightSidebar() {
  const { user } = useUser();

  const mandiTicker = [
    { crop: 'Wheat (Sarbati)', price: '₹2,480', change: '+2.4%', isUp: true, market: 'Indore APMC' },
    { crop: 'Basmati Rice', price: '₹3,950', change: '+1.1%', isUp: true, market: 'Karnal Mandi' },
    { crop: 'Cotton (Medium)', price: '₹7,100', change: '-0.8%', isUp: false, market: 'Rajkot APMC' },
  ];

  return (
    <aside className="hidden xl:flex flex-col w-[320px] 2xl:w-[360px] h-screen sticky top-0 px-5 py-6 space-y-6 overflow-y-auto no-scrollbar flex-shrink-0 bg-white border-l border-slate-100 select-none">
      {/* Featured RAG AI Doctor Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-emerald-950 to-teal-950 rounded-3xl p-5 text-white shadow-xl shadow-emerald-950/20 border border-emerald-500/20 group hover:scale-[1.01] transition-all">
        <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-black uppercase tracking-wider">
              <Sparkles size={12} className="animate-pulse" /> RAG Vision AI
            </span>
            <Stethoscope size={22} className="text-emerald-400" />
          </div>

          <div>
            <h4 className="text-base font-black text-white tracking-tight">AI Crop Disease Doctor</h4>
            <p className="text-[11px] text-emerald-100/70 font-medium leading-relaxed">
              Upload leaf photos for instant diagnosis & scientific cures cited from research PDFs.
            </p>
          </div>

          <Link
            href="/disease-detector"
            className="block w-full text-center bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 text-slate-950 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-md hover:brightness-110 active:scale-95 transition-all"
          >
            Launch Photo Scanner
          </Link>
        </div>
      </div>

      {/* Live Mandi Ticker Widget */}
      <div className="bg-slate-50/80 rounded-3xl p-4 border border-slate-200/60 space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Store size={16} className="text-emerald-600" />
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Live Mandi Ticker</h3>
          </div>
          <Link href="/mandi" className="text-[10px] font-black text-emerald-700 uppercase hover:underline">
            All Rates
          </Link>
        </div>

        <div className="space-y-2">
          {mandiTicker.map((item, idx) => (
            <div key={idx} className="bg-white p-3 rounded-2xl border border-slate-100 flex items-center justify-between shadow-xs">
              <div>
                <h5 className="text-xs font-black text-slate-900 leading-tight">{item.crop}</h5>
                <span className="text-[9px] font-bold text-slate-400">{item.market}</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-slate-900 block">{item.price}</span>
                <span className={`text-[9px] font-black inline-flex items-center gap-0.5 ${
                  item.isUp ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {item.isUp ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                  {item.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weather Quick View */}
      <WeatherCard />

      {/* Suggested Agricultural Experts */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Verified Experts</h3>
          <button className="text-[10px] font-black text-emerald-700 uppercase tracking-tight hover:underline">See All</button>
        </div>
        <div className="space-y-2.5">
          {[
            { name: 'Dr. Rajesh Kumar', crop: 'Agronomist • Rice', initial: 'R' },
            { name: 'Savitri Devi', crop: 'Organic Soil Expert', initial: 'S' },
            { name: 'Amit Singh', crop: 'Precision Tech', initial: 'A' },
          ].map((expert) => (
            <div key={expert.name} className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xs shrink-0 relative">
                  {expert.initial}
                  <CheckCircle2 size={12} className="absolute -bottom-0.5 -right-0.5 text-emerald-600 fill-white" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-black text-slate-900 truncate">{expert.name}</span>
                  <span className="text-[10px] text-slate-400 font-semibold truncate">{expert.crop}</span>
                </div>
              </div>
              <button className="text-[10px] font-black text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-xl transition-colors">
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Topics */}
      <div className="bg-slate-50/80 rounded-3xl p-4 border border-slate-100 shadow-xs w-full space-y-3">
        <div className="flex items-center gap-2 px-1">
          <TrendingUp size={16} className="text-emerald-600" />
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Trending Topics</h3>
        </div>
        <div className="space-y-3">
          {[
            { tag: '#OrganicWheat', posts: '2.5k posts', category: 'Farming' },
            { tag: '#MonsoonTips', posts: '1.8k posts', category: 'Weather' },
            { tag: '#MandiRates', posts: '5.2k posts', category: 'Business' },
          ].map((item) => (
            <div key={item.tag} className="group cursor-pointer flex justify-between items-center p-2 rounded-xl hover:bg-white transition-colors">
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{item.category}</p>
                <p className="text-xs font-black text-slate-800 group-hover:text-emerald-600 transition-colors">{item.tag}</p>
                <p className="text-[10px] font-semibold text-slate-400">{item.posts}</p>
              </div>
              <ChevronRight size={14} className="text-slate-300 group-hover:translate-x-0.5 transition-transform" />
            </div>
          ))}
        </div>
      </div>

      {/* Footer Links */}
      <div className="px-1 pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex flex-wrap gap-3 opacity-60">
        <Link href="/" className="hover:underline">About</Link>
        <Link href="/" className="hover:underline">Privacy</Link>
        <Link href="/" className="hover:underline">Terms</Link>
        <span>© 2026 KrishiSocial</span>
      </div>
    </aside>
  );
}
