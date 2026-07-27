'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { Search, MapPin, TrendingUp, Calendar, ChevronDown, IndianRupee, Store, RefreshCw } from 'lucide-react';
import { getMandiPrices } from '@/services/farmerService';
import { getCropImage } from '@/utils/cropImages';

interface MandiRecord {
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  arrival_date: string;
  min_price: string;
  max_price: string;
  modal_price: string;
}

export default function MandiPage() {
  const [records, setRecords] = useState<MandiRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [state, setState] = useState('');
  const [commodity, setCommodity] = useState('');
  const [updatedDate, setUpdatedDate] = useState('');

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const data = await getMandiPrices({
        state,
        commodity: search || commodity,
        limit: 30
      });
      if (data.success) {
        setRecords(data.records);
        setUpdatedDate(data.updated_date);
      }
    } catch (error) {
      console.error("Failed to fetch mandi prices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, [state, commodity]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPrices();
  };

  return (
    <AppLayout>
      <div className="max-w-screen-xl mx-auto min-h-screen pb-28 bg-slate-50/50">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-green-900 to-slate-950 rounded-b-[40px] p-6 sm:p-10 text-white shadow-xl shadow-emerald-950/20">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider border border-emerald-400/30">
              <Store size={14} /> Live APMC Mandi Feed
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Real-Time Mandi Rates
            </h1>
            <p className="text-emerald-100/80 text-xs sm:text-sm font-medium leading-relaxed">
              Track daily arrivals, minimum, maximum, and modal crop prices across government APMC markets in India.
            </p>
            {updatedDate && (
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 pt-2">
                <Calendar size={14} /> Last Updated: <span className="font-extrabold text-white">{updatedDate}</span>
              </div>
            )}
          </div>
        </div>

        {/* Search and Filters Bar */}
        <div className="px-4 sm:px-6 -mt-6 relative z-20">
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-900/5 p-4 sm:p-5 border border-slate-100/80">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search crop (e.g. Wheat, Tomato, Cotton)..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-12 pl-11 pr-4 bg-slate-50 border border-slate-200/80 rounded-2xl outline-none focus:border-emerald-600 focus:bg-white font-bold text-sm text-slate-900 transition-all"
                />
              </div>

              <div className="flex gap-3">
                <div className="relative flex-1 md:w-48">
                  <select 
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full h-12 px-4 bg-slate-50 border border-slate-200/80 rounded-2xl outline-none appearance-none font-bold text-xs uppercase tracking-wider text-slate-700 cursor-pointer focus:border-emerald-600"
                  >
                    <option value="">All States</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Haryana">Haryana</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Gujarat">Gujarat</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                </div>

                <button 
                  type="submit"
                  className="h-12 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-md shadow-emerald-600/20 active:scale-95 flex items-center gap-2 shrink-0"
                >
                  <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                  <span>Search</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Commodity Cards Grid */}
        <div className="p-4 sm:p-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-56 bg-white rounded-3xl border border-slate-100 p-5 space-y-4 animate-pulse">
                  <div className="h-28 bg-slate-100 rounded-2xl" />
                  <div className="h-4 bg-slate-100 rounded w-1/2" />
                  <div className="h-6 bg-slate-100 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : records.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {records.map((item, idx) => (
                <div 
                  key={idx} 
                  className="group bg-white rounded-3xl border border-slate-200/60 overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-200 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="h-36 relative overflow-hidden bg-slate-900">
                    <img 
                      src={getCropImage(item.commodity)} 
                      alt={item.commodity}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    
                    <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-widest border border-white/20">
                      {item.variety || 'Standard'}
                    </div>

                    <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                      <div>
                        <h3 className="text-lg sm:text-xl font-black text-white leading-tight">{item.commodity}</h3>
                        <p className="text-[11px] font-extrabold text-emerald-400 flex items-center gap-1 mt-0.5">
                          <MapPin size={12} /> {item.market}, {item.district}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Modal Price</span>
                        <div className="flex items-center text-2xl font-black text-slate-900">
                          <IndianRupee size={18} className="text-emerald-600" />
                          {item.modal_price}
                          <span className="text-xs font-bold text-slate-400 ml-1">/ Qtl</span>
                        </div>
                      </div>

                      <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                        <TrendingUp size={20} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                      <div className="bg-slate-50 p-2.5 rounded-xl text-center">
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Min Rate</span>
                        <span className="text-xs font-black text-slate-700">₹{item.min_price}</span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl text-center">
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Max Rate</span>
                        <span className="text-xs font-black text-slate-700">₹{item.max_price}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8 space-y-3">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                <Search size={28} />
              </div>
              <h3 className="text-lg font-black text-slate-900">No Mandi Records Found</h3>
              <p className="text-xs font-semibold text-slate-500 max-w-sm mx-auto">
                Try clearing your search query or selecting a different state from the dropdown.
              </p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
