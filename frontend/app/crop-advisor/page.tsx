'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Sprout, MapPin, 
  AlertTriangle, CheckCircle2, 
  Navigation, Loader2, IndianRupee, Activity, 
  TrendingUp, Wallet, Beaker, Waves, Clock, Info
} from 'lucide-react';
import { getAdvancedCropRecommendation } from '@/services/farmerService';
import AppLayout from '@/components/AppLayout';

interface CropRecommendationV2 {
  name: string;
  suitability: number;
  roi: string;
  expectedProfit: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  duration: number;
  type: string;
  why: string;
}

function CropAdvisorContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<CropRecommendationV2[] | null>(null);
  const [rejectionMessage, setRejectionMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form States
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [n, setN] = useState('');
  const [p, setP] = useState('');
  const [k, setK] = useState('');
  const [ph, setPh] = useState('');
  const [budget, setBudget] = useState('');
  const [waterAvailability, setWaterAvailability] = useState('medium');
  const [durationPreference, setDurationPreference] = useState('any');

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude.toFixed(6));
        setLon(pos.coords.longitude.toFixed(6));
        setLocationLoading(false);
      },
      () => {
        setError("Location access denied");
        setLocationLoading(false);
      }
    );
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRejectionMessage(null);
    setRecommendations(null);

    try {
      const res = await getAdvancedCropRecommendation({
        lat: parseFloat(lat),
        lon: parseFloat(lon),
        n: n ? parseFloat(n) : undefined,
        p: p ? parseFloat(p) : undefined,
        k: k ? parseFloat(k) : undefined,
        ph: ph ? parseFloat(ph) : undefined,
        budget: budget ? parseFloat(budget) : undefined,
        waterAvailability,
        durationPreference
      });

      if (!res.success) {
        setRejectionMessage(res.rejectionReason);
      } else {
        setRecommendations(res.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-screen-md mx-auto min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="flex items-center gap-4 px-4 h-14 border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-md z-50">
        <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full active:bg-gray-100 transition-colors">
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-base font-black text-gray-900 uppercase tracking-tight">AI Farm Planner V2.2</h1>
      </div>

      <div className="p-5">
        {/* Banner */}
        <div className="bg-black rounded-[40px] p-8 text-white mb-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500 rounded-full -mr-32 -mt-32 blur-[80px] opacity-40" />
          <Sprout size={48} className="mb-6 text-green-500" />
          <h2 className="text-3xl font-black mb-2 leading-tight">Strict Analysis.</h2>
          <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-[240px]">
            Filtered by budget, soil health, and your growth preferences.
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSearch} className="space-y-8 bg-gray-50 p-7 rounded-[40px] border border-gray-200/50">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Latitude</label>
              <input type="number" step="any" value={lat} onChange={e=>setLat(e.target.value)} className="w-full bg-white border border-gray-200 rounded-2xl py-3 px-4 font-bold text-sm shadow-sm focus:border-black transition-all outline-none" placeholder="e.g. 22.71" required />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Longitude</label>
              <input type="number" step="any" value={lon} onChange={e=>setLon(e.target.value)} className="w-full bg-white border border-gray-200 rounded-2xl py-3 px-4 font-bold text-sm shadow-sm focus:border-black transition-all outline-none" placeholder="e.g. 75.85" required />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {[ {l:'N', v:n, s:setN}, {l:'P', v:p, s:setP}, {l:'K', v:k, s:setK}, {l:'pH', v:ph, s:setPh} ].map(i => (
              <div key={i.l} className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center block">{i.l}</label>
                <input type="number" value={i.v} onChange={e=>i.s(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl py-3 text-center font-bold text-sm shadow-sm outline-none focus:border-black" placeholder="-" />
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Growth Duration Preference</label>
            <div className="grid grid-cols-2 gap-3">
              <button 
                type="button" 
                onClick={() => setDurationPreference('any')}
                className={`py-3 rounded-2xl text-xs font-black uppercase tracking-widest border transition-all ${durationPreference === 'any' ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-200'}`}
              >
                All Crops
              </button>
              <button 
                type="button" 
                onClick={() => setDurationPreference('short-term')}
                className={`py-3 rounded-2xl text-xs font-black uppercase tracking-widest border transition-all ${durationPreference === 'short-term' ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-200'}`}
              >
                Short Term (&lt;6m)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Budget (₹)</label>
              <div className="relative">
                <IndianRupee size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="number" value={budget} onChange={e=>setBudget(e.target.value)} className="w-full bg-white border border-gray-200 rounded-2xl py-3 pl-10 pr-4 font-bold text-sm shadow-sm outline-none focus:border-black" placeholder="Max" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Water Source</label>
              <select value={waterAvailability} onChange={e=>setWaterAvailability(e.target.value)} className="w-full bg-white border border-gray-200 rounded-2xl py-3 px-4 font-bold text-sm shadow-sm outline-none appearance-none cursor-pointer focus:border-black">
                <option value="low">Scarcity</option>
                <option value="medium">Average</option>
                <option value="high">Abundant</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="flex-1 bg-black text-white rounded-[24px] py-5 font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-black/20">
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Activity size={20} />}
              Calculate Plan
            </button>
            <button type="button" onClick={getCurrentLocation} className="w-16 h-16 bg-white border border-gray-200 rounded-[24px] flex items-center justify-center text-black shadow-sm active:scale-90 transition-all hover:bg-gray-50">
              {locationLoading ? <Loader2 className="animate-spin" size={20} /> : <Navigation size={20} />}
            </button>
          </div>
        </form>

        {/* Rejection / Error UI */}
        {rejectionMessage && (
          <div className="mt-8 p-6 bg-orange-50 rounded-[32px] border border-orange-100 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center gap-3 mb-3 text-orange-600">
              <AlertTriangle size={24} />
              <span className="font-black uppercase tracking-widest text-xs">Criteria Mismatch</span>
            </div>
            <p className="text-sm font-bold text-orange-800 leading-relaxed">
              {rejectionMessage}
            </p>
          </div>
        )}

        {error && (
          <div className="mt-8 p-6 bg-red-50 rounded-[32px] border border-red-100 flex items-center gap-3 font-bold text-xs text-red-600">
            <Info size={20} /> {error}
          </div>
        )}

        {/* Results */}
        {recommendations && (
          <div className="mt-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter">Verified Matches</h3>
              <Waves size={20} className="text-blue-500" />
            </div>

            <div className="space-y-6">
              {recommendations.map((crop, i) => (
                <div key={i} className="bg-white border-2 border-gray-100 rounded-[40px] p-8 hover:border-black transition-all duration-300 relative">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${crop.type === 'horticulture' ? 'bg-purple-50 text-purple-600' : crop.type === 'cash' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                          {crop.type}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          <Clock size={10} /> {crop.duration} Months
                        </span>
                      </div>
                      <h4 className="text-4xl font-black text-gray-900 leading-none">{crop.name}</h4>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Score</div>
                      <div className="text-2xl font-black text-gray-900">{crop.suitability}%</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-gray-50 p-5 rounded-3xl">
                      <div className="flex items-center gap-2 text-gray-400 mb-2">
                        <TrendingUp size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Expected ROI</span>
                      </div>
                      <div className="text-xl font-black text-green-600">+{crop.roi}%</div>
                    </div>
                    <div className="bg-gray-50 p-5 rounded-3xl">
                      <div className="flex items-center gap-2 text-gray-400 mb-2">
                        <Wallet size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Est. Net Profit</span>
                      </div>
                      <div className="text-xl font-black text-gray-900">{crop.expectedProfit}</div>
                    </div>
                  </div>

                  <div className="bg-black/5 p-5 rounded-3xl mb-6">
                    <div className="flex items-center gap-3 text-xs font-bold text-gray-800 leading-relaxed">
                      <CheckCircle2 size={18} className="text-green-600 flex-shrink-0" />
                      {crop.why}
                    </div>
                  </div>

                  <div className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full w-fit ${
                    crop.riskLevel === 'Low' ? 'bg-green-50 text-green-600' : 
                    crop.riskLevel === 'Medium' ? 'bg-orange-50 text-orange-600' : 'bg-red-50 text-red-600'
                  }`}>
                    {crop.riskLevel} Risk Profile
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CropAdvisorPage() {
  return (
    <AppLayout>
      <CropAdvisorContent />
    </AppLayout>
  );
}