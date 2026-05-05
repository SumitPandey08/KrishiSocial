'use client';

import React, { useState, useEffect } from 'react';
import { CloudRain, Droplets, ArrowRight, MapPin } from 'lucide-react';
import Link from 'next/link';
import { getWeather } from '@/services/farmerService';

export default function WeatherCard() {
  const [weather, setWeather] = useState<{ temp: number; location: string; humidity: number; rainChance: number; icon: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if ("geolocation" in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const data = await getWeather(latitude, longitude);
          setWeather({
            temp: Math.round(data.temperature),
            location: data.location,
            humidity: data.humidity,
            rainChance: 10,
            icon: data.icon
          });
        } catch (error) {
          console.error("Failed to fetch weather:", error);
          setWeather({ temp: 28, location: "Bhopal, MP", humidity: 45, rainChance: 10, icon: "01d" });
        } finally {
          setLoading(false);
        }
      }, (error) => {
        setWeather({ temp: 28, location: "Bhopal, MP", humidity: 45, rainChance: 10, icon: "01d" });
        setLoading(false);
      });
    } else {
      setWeather({ temp: 28, location: "Bhopal, MP", humidity: 45, rainChance: 10, icon: "01d" });
    }
  }, []);

  if (loading && !weather) {
    return (
      <div className="w-full h-[280px] bg-[#2E7D32] rounded-[32px] p-6 text-white animate-pulse flex items-center justify-center">
        <span className="text-xs font-black opacity-50 uppercase tracking-widest">Loading...</span>
      </div>
    );
  }

  const displayWeather = weather || { temp: 28, location: "Bhopal, MP", humidity: 45, rainChance: 10, icon: "01d" };

  return (
    <div className="w-full min-h-[280px] bg-gradient-to-br from-[#2E7D32] to-[#43A047] rounded-[32px] p-6 text-white shadow-xl shadow-green-900/10 relative overflow-hidden group border border-white/10 flex flex-col justify-between">
      {/* Decorative Elements */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700" />
      
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 min-w-0 pr-2">
            <p className="text-[10px] font-black opacity-70 uppercase tracking-widest mb-1">Today's Weather</p>
            <div className="flex items-baseline gap-1">
              <h3 className="text-4xl lg:text-5xl font-black tracking-tighter leading-none">{displayWeather.temp}</h3>
              <span className="text-xl font-black">°C</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2 opacity-90">
              <MapPin size={12} className="flex-shrink-0" />
              <p className="text-xs font-bold uppercase truncate">{displayWeather.location}</p>
            </div>
          </div>
          <div className="relative flex-shrink-0 -mt-2 -mr-2">
            <img 
              src={`https://openweathermap.org/img/wn/${displayWeather.icon}@2x.png`} 
              alt="weather"
              className="w-16 h-16 lg:w-20 lg:h-20 drop-shadow-2xl relative z-10"
            />
            <div className="absolute inset-0 bg-yellow-400/20 blur-2xl rounded-full" />
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-2 mt-auto">
          <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-md border border-white/5 flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-1.5 mb-1 opacity-70">
              <Droplets size={12} className="text-blue-200" />
              <span className="text-[8px] font-black uppercase tracking-tighter">Humidity</span>
            </div>
            <p className="text-base font-black">{displayWeather.humidity}%</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-md border border-white/5 flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-1.5 mb-1 opacity-70">
              <CloudRain size={12} className="text-blue-200" />
              <span className="text-[8px] font-black uppercase tracking-tighter">Rain Chance</span>
            </div>
            <p className="text-base font-black">{displayWeather.rainChance}%</p>
          </div>
        </div>

        {/* Link Button */}
        <Link href="/weather" className="mt-4 flex items-center justify-between bg-white hover:bg-white/90 px-4 py-3 rounded-2xl transition-all text-[#2E7D32] group/btn shadow-lg shadow-green-900/20 active:scale-95">
          <span className="text-[10px] font-black uppercase tracking-widest">Full Forecast</span>
          <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
