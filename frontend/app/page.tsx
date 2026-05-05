'use client';

import React, { useState, useEffect } from 'react';
import StatusList from '@/components/StatusList';
import Posts from '@/components/Posts';
import AppLayout from '@/components/AppLayout';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { MapPin, ChevronRight } from 'lucide-react';
import { getWeather } from '@/services/farmerService';
import Link from 'next/link';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const FILTERS = ['All', 'Posts', 'Questions', 'My Crops', 'Nearby'];

function HomeContent() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [weather, setWeather] = useState<{ temp: number; location: string; humidity: number; rainChance: number } | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);

  useEffect(() => {
    if ("geolocation" in navigator) {
      setLoadingWeather(true);
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const data = await getWeather(latitude, longitude);
          setWeather({
            temp: Math.round(data.temperature),
            location: data.location,
            humidity: data.humidity,
            rainChance: 10
          });
        } catch (error) {
          console.error("Failed to fetch weather:", error);
          setWeather({ temp: 28, location: "Bhopal, MP", humidity: 45, rainChance: 10 });
        } finally {
          setLoadingWeather(false);
        }
      }, (error) => {
        setWeather({ temp: 28, location: "Bhopal, MP", humidity: 45, rainChance: 10 });
        setLoadingWeather(false);
      });
    }
  }, []);

  return (
    <div className="w-full bg-white">
      {/* Today's Weather Card - Mobile Only */}
      <div className="px-4 pt-4 pb-2 xl:hidden">
        <div className="bg-gradient-to-br from-[#2E7D32] to-[#43A047] rounded-[32px] p-6 text-white shadow-xl shadow-green-900/20 relative overflow-hidden min-h-[200px] flex flex-col justify-between">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <h3 className="text-[10px] font-black opacity-80 uppercase tracking-widest mb-4">Today's Weather</h3>
            
            <div className="flex justify-between items-end">
              <div>
                <span className="text-5xl font-black tracking-tighter">
                  {loadingWeather ? "--" : (weather ? `${weather.temp}°C` : "28°C")}
                </span>
                <div className="flex items-center gap-1 mt-2 opacity-90">
                  <MapPin size={12} />
                  <span className="text-xs font-bold truncate max-w-[150px]">
                    {loadingWeather ? "Finding..." : (weather?.location || "Bhopal, MP")}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 text-right">
                <div>
                  <p className="text-[9px] font-black opacity-60 uppercase tracking-tighter">Humidity</p>
                  <p className="text-base font-black">{loadingWeather ? "--" : (weather?.humidity || "45")}%</p>
                </div>
                <div>
                  <p className="text-[9px] font-black opacity-60 uppercase tracking-tighter">Rain Chance</p>
                  <p className="text-base font-black">{loadingWeather ? "--" : (weather?.rainChance || "10")}%</p>
                </div>
              </div>
            </div>

            <Link 
              href="/weather" 
              className="mt-6 flex items-center justify-between bg-white/20 hover:bg-white/30 transition-colors rounded-2xl px-5 py-3.5 group border border-white/10 backdrop-blur-sm"
            >
              <span className="text-[10px] font-black uppercase tracking-widest">View Full Forecast</span>
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Filter Bar - Instagram Style Pills */}
      <div className="bg-white py-4 overflow-x-auto no-scrollbar border-b border-gray-50 sticky top-0 z-30">
        <div className="flex gap-2 px-4 min-w-max">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "px-5 py-2 rounded-full text-[13px] font-bold transition-all border",
                activeFilter === filter 
                  ? "bg-[#2E7D32] text-white border-[#2E7D32] shadow-md shadow-green-900/10" 
                  : "bg-white text-gray-500 border-gray-100 hover:border-gray-300 hover:text-gray-900"
              )}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Stories/Status */}
      <div className="py-2">
        <StatusList />
      </div>

      {/* Feed Area */}
      <div className="md:px-4 lg:px-6">
        <Posts activeFilter={activeFilter} />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <AppLayout>
      <HomeContent />
    </AppLayout>
  );
}
