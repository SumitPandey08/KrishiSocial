'use client';

import React, { useState, useEffect } from 'react';
import { CloudRain, Droplets, ArrowRight, MapPin, CloudSun } from 'lucide-react';
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
      }, () => {
        setWeather({ temp: 28, location: "Bhopal, MP", humidity: 45, rainChance: 10, icon: "01d" });
        setLoading(false);
      });
    } else {
      setWeather({ temp: 28, location: "Bhopal, MP", humidity: 45, rainChance: 10, icon: "01d" });
    }
  }, []);

  if (loading && !weather) {
    return (
      <div className="w-full h-[240px] bg-emerald-900 rounded-3xl p-6 text-white animate-pulse flex items-center justify-center">
        <span className="text-xs font-black opacity-50 uppercase tracking-widest">Loading Weather...</span>
      </div>
    );
  }

  const displayWeather = weather || { temp: 28, location: "Bhopal, MP", humidity: 45, rainChance: 10, icon: "01d" };

  return (
    <div className="w-full bg-gradient-to-br from-emerald-900 via-green-800 to-slate-900 rounded-3xl p-5 text-white shadow-xl shadow-emerald-950/20 relative overflow-hidden group border border-emerald-500/20 flex flex-col justify-between">
      {/* Decorative Blur */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-400/20 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700 pointer-events-none" />

      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-emerald-300 uppercase tracking-widest flex items-center gap-1">
              <CloudSun size={12} /> Today's Forecast
            </span>
            <div className="flex items-baseline gap-1">
              <h3 className="text-4xl font-black tracking-tighter text-white">{displayWeather.temp}</h3>
              <span className="text-lg font-black text-emerald-300">°C</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-100/80">
              <MapPin size={12} /> {displayWeather.location}
            </div>
          </div>

          <div className="shrink-0 -mt-2 -mr-2">
            <img 
              src={`https://openweathermap.org/img/wn/${displayWeather.icon}@2x.png`} 
              alt="weather"
              className="w-16 h-16 drop-shadow-md"
            />
          </div>
        </div>

        {/* Info Metrics */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-xl border border-white/10 text-center">
            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-200 block mb-0.5">Humidity</span>
            <span className="text-sm font-black text-white">{displayWeather.humidity}%</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-xl border border-white/10 text-center">
            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-200 block mb-0.5">Rain Chance</span>
            <span className="text-sm font-black text-white">{displayWeather.rainChance}%</span>
          </div>
        </div>

        {/* Link Button */}
        <Link href="/weather" className="flex items-center justify-between bg-white/20 hover:bg-white/30 px-4 py-2.5 rounded-xl transition-all text-white text-xs font-black uppercase tracking-wider backdrop-blur-md border border-white/10 group/btn active:scale-95">
          <span>Full Forecast & Spray Advisory</span>
          <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
