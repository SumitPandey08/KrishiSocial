'use client';

import React, { useState, useEffect } from 'react';
import { CloudSun, Droplets, Wind, AlertTriangle, SprayCan, ArrowLeft, RefreshCw, MapPin, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getWeather } from '@/services/farmerService';
import AppLayout from '@/components/AppLayout';

interface ForecastItem {
  time: string;
  temp: number;
  icon: string;
}

interface WeatherData {
  temperature: number;
  humidity: number;
  description: string;
  location: string;
  windSpeed: number;
  icon: string;
  forecast: ForecastItem[];
}

function WeatherContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);

  const fetchWeatherData = async () => {
    setLoading(true);
    setError(null);
    
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      setFallbackData();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const data = await getWeather(latitude, longitude);
          setWeather(data);
        } catch (err: unknown) {
          setError(err instanceof Error ? err.message : "Failed to fetch weather data");
          setFallbackData();
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Location access denied. Showing default weather.");
        setFallbackData();
        setLoading(false);
      }
    );
  };

  const setFallbackData = () => {
    setWeather({
      temperature: 32,
      humidity: 45,
      description: 'Sunny',
      location: 'Pune, Maharashtra',
      windSpeed: 12,
      icon: '01d',
      forecast: [
        { time: '12 PM', temp: 32, icon: '01d' },
        { time: '1 PM', temp: 33, icon: '01d' },
        { time: '2 PM', temp: 34, icon: '01d' },
        { time: '3 PM', temp: 34, icon: '01d' },
        { time: '4 PM', temp: 33, icon: '02d' },
        { time: '5 PM', temp: 31, icon: '02d' },
      ]
    });
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 min-h-[60vh]">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin mb-3" />
        <p className="text-xs font-black text-emerald-800 uppercase tracking-widest">Fetching Weather Data...</p>
      </div>
    );
  }

  if (!weather) return null;

  const isSafeSpraying = weather.windSpeed < 15;

  return (
    <div className="w-full min-h-screen bg-slate-50/50 pb-28">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-slate-100 sticky top-0 bg-white/90 backdrop-blur-md z-40">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-700">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-base font-black text-slate-900 tracking-tight">Weather & Spraying Advisory</h1>
        </div>
        <button onClick={fetchWeatherData} className="p-2 rounded-xl text-emerald-700 hover:bg-emerald-50 transition-colors">
          <RefreshCw size={18} />
        </button>
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        {/* Main Weather Banner */}
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-green-800 to-slate-900 rounded-[32px] p-6 sm:p-8 text-white shadow-xl shadow-emerald-950/20">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-300 text-xs font-bold">
                <MapPin size={12} /> {weather.location}
              </div>
              <h2 className="text-5xl sm:text-6xl font-black tracking-tighter text-white">
                {Math.round(weather.temperature)}°C
              </h2>
              <p className="text-base font-bold text-emerald-200 capitalize flex items-center gap-2">
                <CloudSun size={20} /> {weather.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 shrink-0">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-200 flex items-center gap-1">
                  <Droplets size={12} /> Humidity
                </span>
                <span className="text-lg font-black text-white">{weather.humidity}%</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-200 flex items-center gap-1">
                  <Wind size={12} /> Wind
                </span>
                <span className="text-lg font-black text-white">{weather.windSpeed} km/h</span>
              </div>
            </div>
          </div>
        </div>

        {/* Spraying Advisory Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <SprayCan size={20} />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">Pesticide Spraying Guide</h3>
                <p className="text-[11px] font-semibold text-slate-400">Based on live wind & moisture conditions</p>
              </div>
            </div>

            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
              isSafeSpraying ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}>
              {isSafeSpraying ? 'Optimal Conditions' : 'High Wind Warning'}
            </span>
          </div>

          <div className={`p-4 rounded-2xl border text-xs font-semibold leading-relaxed flex items-start gap-3 ${
            isSafeSpraying ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900' : 'bg-rose-50/50 border-rose-200 text-rose-900'
          }`}>
            {isSafeSpraying ? (
              <>
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold block text-slate-900 mb-0.5">Favorable for Spraying:</span>
                  Wind speed is under 15 km/h. Spraying pesticides or foliar nutrition now will minimize drift.
                </div>
              </>
            ) : (
              <>
                <AlertTriangle size={18} className="text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold block text-slate-900 mb-0.5">Delay Spraying:</span>
                  Wind speed ({weather.windSpeed} km/h) exceeds safe threshold. High risk of chemical drift and wasteful runoff.
                </div>
              </>
            )}
          </div>
        </div>

        {/* Hourly Forecast */}
        {weather.forecast && weather.forecast.length > 0 && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Next Hours Forecast</h3>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {weather.forecast.map((item, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-100 p-4 rounded-2xl min-w-[90px] text-center space-y-2 shrink-0">
                  <span className="text-[10px] font-black text-slate-400 uppercase">{item.time}</span>
                  <img 
                    src={`https://openweathermap.org/img/wn/${item.icon}.png`} 
                    alt="icon"
                    className="w-10 h-10 mx-auto"
                  />
                  <span className="text-sm font-black text-slate-900 block">{item.temp}°C</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function WeatherPage() {
  return (
    <AppLayout>
      <WeatherContent />
    </AppLayout>
  );
}
