'use client';

import React, { useState, useEffect } from 'react';
import { CloudRain, Droplets, ArrowRight, MapPin, CloudSun } from 'lucide-react';
import Link from 'next/link';
import { getWeather } from '@/services/farmerService';
import { getLastCachedWeather } from '@/utils/weatherCache';

export default function WeatherCard() {
  const [weather, setWeather] = useState<{ temp: number; location: string; humidity: number; rainChance: number; icon: string } | null>(() => {
    const cached = getLastCachedWeather();
    if (cached?.data) {
      return {
        temp: Math.round(cached.data.temperature),
        location: cached.data.location,
        humidity: cached.data.humidity,
        rainChance: 10,
        icon: cached.data.icon || "01d",
      };
    }
    return null;
  });
  const [loading, setLoading] = useState(!weather);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const data = await getWeather(latitude, longitude);
            setWeather({
              temp: Math.round(data.temperature),
              location: data.location,
              humidity: data.humidity,
              rainChance: 10,
              icon: data.icon || "01d"
            });
          } catch (error) {
            console.error("Failed to fetch weather:", error);
            if (!weather) {
              setWeather({ temp: 28, location: "Bhopal, MP", humidity: 45, rainChance: 10, icon: "01d" });
            }
          } finally {
            setLoading(false);
          }
        },
        () => {
          if (!weather) {
            setWeather({ temp: 28, location: "Bhopal, MP", humidity: 45, rainChance: 10, icon: "01d" });
          }
          setLoading(false);
        },
        { timeout: 8000, maximumAge: 10 * 60 * 1000 }
      );
    } else {
      if (!weather) {
        setWeather({ temp: 28, location: "Bhopal, MP", humidity: 45, rainChance: 10, icon: "01d" });
      }
      setLoading(false);
    }
  }, []);

  if (loading && !weather) {
    return (
      <div className="w-full h-[260px] bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 rounded-3xl p-6 text-white animate-pulse flex flex-col justify-center items-center gap-3 border border-emerald-500/20 shadow-lg shadow-emerald-950/15">
        <CloudSun className="text-emerald-400/60 animate-bounce" size={36} />
        <span className="text-xs font-bold text-emerald-200/70 tracking-wider">Loading Live Forecast...</span>
      </div>
    );
  }

  const displayWeather = weather || { temp: 28, location: "Bhopal, MP", humidity: 45, rainChance: 10, icon: "01d" };

  return (
    <div className="w-full bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 rounded-3xl p-6 text-white shadow-lg shadow-emerald-950/15 relative overflow-hidden group border border-emerald-500/20 flex flex-col justify-between min-h-[260px]">
      {/* Decorative Blur */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-400/15 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700 pointer-events-none" />

      <div className="relative z-10 space-y-4.5">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-1.5">
            <span className="text-[10px] font-black text-emerald-300 uppercase tracking-widest flex items-center gap-1.5">
              <CloudSun size={14} /> Today's Forecast
            </span>
            <div className="flex items-baseline gap-1.5">
              <h3 className="text-4xl sm:text-5xl font-black tracking-tight text-white">{displayWeather.temp}</h3>
              <span className="text-xl font-bold text-emerald-300">°C</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-100/85 truncate max-w-[180px]">
              <MapPin size={13} className="shrink-0 text-emerald-400" />
              <span className="truncate">{displayWeather.location}</span>
            </div>
          </div>

          <div className="shrink-0 -mt-1 -mr-1">
            <img 
              src={`https://openweathermap.org/img/wn/${displayWeather.icon || '01d'}@2x.png`} 
              alt="weather"
              className="w-18 h-18 drop-shadow-md object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        </div>

        {/* Info Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/10 backdrop-blur-md px-3.5 py-3 rounded-2xl border border-white/10 text-center">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-200 block mb-0.5">Humidity</span>
            <span className="text-sm font-black text-white">{displayWeather.humidity}%</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-3.5 py-3 rounded-2xl border border-white/10 text-center">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-200 block mb-0.5">Rain Chance</span>
            <span className="text-sm font-black text-white">{displayWeather.rainChance}%</span>
          </div>
        </div>

        {/* Link Button */}
        <Link 
          href="/weather" 
          className="flex items-center justify-between bg-white/15 hover:bg-white/25 px-4 py-3 rounded-2xl transition-all text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-white/10 group/btn active:scale-95 shadow-xs"
        >
          <span className="truncate">View Full Forecast & Advisory</span>
          <ArrowRight size={15} className="shrink-0 ml-1.5 group-hover/btn:translate-x-1 transition-transform text-emerald-300" />
        </Link>
      </div>
    </div>
  );
}
