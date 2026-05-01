'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, Sprout, MapPin, Droplets, Thermometer, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { getCropRecommendation } from '@/services/farmerService';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function CropRecommendationPage() {
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await getCropRecommendation(location);
      setRecommendation(data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to get recommendation. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-screen-md mx-auto min-h-screen bg-[#F7FDF7] pb-24">
      {/* Header */}
      <div className="flex items-center gap-4 px-4 h-14 border-b border-gray-100 sticky top-0 bg-white z-50">
        <button onClick={() => router.back()} className="p-1 text-gray-900">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-black text-gray-900 uppercase tracking-tight">Crop Advisor</h1>
      </div>

      <div className="p-4">
        {/* Search Section */}
        <div className="bg-white rounded-[32px] p-6 shadow-xl shadow-gray-200/50 border border-gray-100 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#E8F5E9] rounded-2xl flex items-center justify-center text-[#2E7D32]">
              <Sprout size={28} />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900">Crop Recommendation</h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">AI-Powered Farming Insights</p>
            </div>
          </div>

          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Enter your city or region (e.g. Pune)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-[#F1F8F1] border-2 border-transparent focus:border-[#2E7D32] rounded-2xl py-4 px-6 pl-12 font-bold text-gray-900 outline-none transition-all placeholder:text-gray-400"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2E7D32]" size={20} />
            <button
              type="submit"
              disabled={loading || !location.trim()}
              className="mt-4 w-full bg-[#2E7D32] text-white font-black py-4 rounded-2xl shadow-lg shadow-[#2E7D32]/20 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100"
            >
              {loading ? "ANALYZING SOIL & WEATHER..." : "GET RECOMMENDATIONS"}
            </button>
          </form>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl font-bold text-sm mb-6 flex items-center gap-3">
            <AlertTriangle size={20} />
            {error}
          </div>
        )}

        {/* Results Section */}
        {recommendation && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Environmental Snapshot */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center">
                <Thermometer className="text-orange-500 mb-2" size={24} />
                <span className="text-2xl font-black text-gray-900">{Math.round(recommendation.weather.temperature)}°C</span>
                <span className="text-[10px] font-black text-gray-400 uppercase">Temperature</span>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center">
                <Droplets className="text-blue-500 mb-2" size={24} />
                <span className="text-2xl font-black text-gray-900">{recommendation.weather.humidity}%</span>
                <span className="text-[10px] font-black text-gray-400 uppercase">Humidity</span>
              </div>
            </div>

            {/* Recommendations List */}
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest px-1">Top Suggested Crops</h3>
            <div className="space-y-4">
              {Array.isArray(recommendation.recommendations) ? (
                recommendation.recommendations.map((crop: any, i: number) => (
                  <div key={i} className="bg-white rounded-[32px] p-6 border border-[#E8F5E9] shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#2E7D32]/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
                    
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-2xl font-black text-gray-900 capitalize">{crop.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="px-2 py-1 bg-[#E8F5E9] rounded-lg text-[#2E7D32] text-[10px] font-black uppercase tracking-tighter">
                            {crop.confidence}% Match
                          </div>
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-[#2E7D32] rounded-2xl flex items-center justify-center text-white font-black">
                        #{i + 1}
                      </div>
                    </div>

                    {crop.insights?.length > 0 && (
                      <div className="space-y-2 mt-4">
                        {crop.insights.map((insight: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-2 text-sm font-bold text-gray-700">
                            <CheckCircle2 size={16} className="text-[#2E7D32]" />
                            {insight}
                          </div>
                        ))}
                      </div>
                    )}

                    {crop.limitations?.length > 0 && (
                      <div className="space-y-2 mt-2">
                        {crop.limitations.map((limit: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-2 text-sm font-bold text-amber-600">
                            <Info size={16} />
                            {limit}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="bg-amber-50 border border-amber-100 text-amber-700 p-6 rounded-[32px] font-bold">
                  {recommendation.recommendations}
                </div>
              )}
            </div>

            {/* Soil Profile Info */}
            <div className="bg-[#2E7D32] rounded-[32px] p-8 text-white shadow-xl shadow-[#2E7D32]/20">
              <div className="flex items-center gap-3 mb-4">
                <MapPin size={24} />
                <h4 className="text-lg font-black uppercase tracking-tight">Soil Data (GEE Analysis)</h4>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/10 rounded-2xl p-3 flex flex-col items-center">
                  <span className="text-lg font-black">{recommendation.soil.ph}</span>
                  <span className="text-[8px] font-bold uppercase opacity-60">pH Level</span>
                </div>
                <div className="bg-white/10 rounded-2xl p-3 flex flex-col items-center">
                  <span className="text-lg font-black">{recommendation.soil.nitrogen}</span>
                  <span className="text-[8px] font-bold uppercase opacity-60">Nitrogen</span>
                </div>
                <div className="bg-white/10 rounded-2xl p-3 flex flex-col items-center">
                  <span className="text-lg font-black">{recommendation.soil.carbon_content}%</span>
                  <span className="text-[8px] font-bold uppercase opacity-60">Carbon</span>
                </div>
              </div>
              <p className="mt-6 text-[10px] font-bold uppercase tracking-widest opacity-50 text-center">
                Last Updated: {new Date(recommendation.soil.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
