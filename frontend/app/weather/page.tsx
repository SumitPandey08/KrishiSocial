'use client';

import React, { useState, useEffect } from 'react';
import { CloudSun, Droplets, Wind, AlertCircle, SprayCan, ArrowLeft, RefreshCw, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getWeather } from '@/services/farmerService';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function WeatherPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weather, setWeather] = useState<any>(null);

  const fetchWeatherData = async () => {
    setLoading(true);
    setError(null);
    
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const data = await getWeather(latitude, longitude);
          setWeather(data);
        } catch (err: any) {
          setError(err.response?.data?.message || "Failed to fetch weather data");
          // Fallback to mock data if API fails (e.g. missing API key)
          setFallbackData();
        } finally {
          setLoading(false);
        }
      },
      (err) => {
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
      location: 'Pune, Maharashtra (Demo)',
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

  const handleRefresh = () => {
    fetchWeatherData();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F7FDF7]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2E7D32]"></div>
        <p className="mt-4 text-[#2E7D32] font-bold">Loading Weather...</p>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="max-w-screen-md mx-auto min-h-screen bg-[#F7FDF7] pb-24">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-gray-100 sticky top-0 bg-white z-50">
        <button onClick={() => router.back()} className="p-1 text-gray-900">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-black text-gray-900">Weather</h1>
        <button onClick={handleRefresh} className={cn("p-1 text-[#2E7D32]", loading && "animate-spin")}>
          <RefreshCw size={20} />
        </button>
      </div>

      {error && (
        <div className="mx-4 mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-3 flex items-center gap-2 text-yellow-800 text-sm">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Current Weather Card */}
      <div className="bg-white rounded-b-[40px] p-10 flex flex-col items-center shadow-xl shadow-gray-200/50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-[#2E7D32]/10" />
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-1">
            <MapPin size={14} className="text-gray-400" />
            <span className="text-sm font-black text-gray-400 uppercase tracking-widest">{weather.location}</span>
          </div>
          <span className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
        </div>
        
        <div className="my-6 relative">
           <img 
             src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`} 
             alt="weather" 
             className="w-32 h-32 relative z-10"
           />
           <div className="absolute inset-0 bg-yellow-400/20 blur-3xl rounded-full" />
        </div>

        <h2 className="text-7xl font-black text-gray-900 tracking-tighter">{Math.round(weather.temperature)}°C</h2>
        <span className="text-xl font-bold text-[#2E7D32] mt-2 capitalize">{weather.description}</span>

        <div className="grid grid-cols-2 w-full mt-10 gap-8">
           <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-[#F1F8F1] rounded-2xl flex items-center justify-center text-[#2E7D32] mb-2">
                 <Droplets size={24} />
              </div>
              <span className="text-lg font-black text-gray-900">{weather.humidity}%</span>
              <span className="text-xs font-bold text-gray-400 uppercase">Humidity</span>
           </div>
           <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-[#F1F8F1] rounded-2xl flex items-center justify-center text-[#2E7D32] mb-2">
                 <Wind size={24} />
              </div>
              <span className="text-lg font-black text-gray-900">{weather.windSpeed} km/h</span>
              <span className="text-xs font-bold text-gray-400 uppercase">Wind Speed</span>
           </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="mx-4 mt-6 bg-[#FF5252] rounded-3xl p-6 text-white shadow-lg shadow-red-200">
         <div className="flex items-center gap-3 mb-3">
            <AlertCircle size={28} />
            <h3 className="text-lg font-black uppercase tracking-tight">Weather Alert</h3>
         </div>
         <p className="text-sm font-medium leading-relaxed opacity-90">
            {weather.temperature > 35 
              ? "Extreme Heat Warning: Temperatures likely to reach high levels. Avoid heavy outdoor work." 
              : "Conditions are normal. Good time for routine farm maintenance."}
         </p>
      </div>

      {/* Spraying Guide */}
      <div className="px-4 mt-8">
         <h3 className="text-base font-black text-gray-900 mb-4 px-1 uppercase tracking-wider">Spraying Guide</h3>
         <div className="bg-white rounded-3xl p-6 border border-[#E8F5E9] flex items-center gap-4 shadow-sm">
            <div className="w-14 h-14 bg-[#F1F8F1] rounded-2xl flex items-center justify-center text-[#2E7D32]">
               <SprayCan size={32} />
            </div>
            <div className="flex-1">
               <h4 className="text-base font-black text-gray-900">
                 {weather.windSpeed < 15 ? "Best time to spray: Now" : "Avoid spraying: High winds"}
               </h4>
               <p className="text-xs font-bold text-gray-400 mt-1 uppercase">
                 Reason: {weather.windSpeed < 15 ? "Low wind & Clear sky" : "Wind speed is too high"}
               </p>
            </div>
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-xs shadow-lg",
              weather.windSpeed < 15 ? "bg-[#2E7D32] shadow-green-200" : "bg-red-500 shadow-red-200"
            )}>
              {weather.windSpeed < 15 ? "GO" : "NO"}
            </div>
         </div>
      </div>

      {/* Hourly Forecast */}
      {weather.forecast && weather.forecast.length > 0 && (
        <div className="mt-8">
          <h3 className="text-base font-black text-gray-900 mb-4 px-5 uppercase tracking-wider">Next 24 Hours</h3>
          <div className="overflow-x-auto no-scrollbar pb-4 px-5">
              <div className="flex gap-4 min-w-max">
                {weather.forecast.map((item: any, i: number) => (
                  <div key={i} className="bg-white border border-[#E8F5E9] rounded-2xl p-4 flex flex-col items-center min-w-[90px] shadow-sm">
                      <span className="text-[10px] font-black text-gray-400 uppercase">{item.time}</span>
                      <img 
                        src={`https://openweathermap.org/img/wn/${item.icon}.png`} 
                        alt="icon" 
                        className="w-10 h-10 my-1"
                      />
                      <span className="text-sm font-black text-gray-900">{item.temp}°C</span>
                  </div>
                ))}
              </div>
          </div>
        </div>
      )}
    </div>
  );
}

