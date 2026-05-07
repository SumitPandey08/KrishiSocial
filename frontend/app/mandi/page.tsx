'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { Search, MapPin, TrendingUp, Calendar, Filter, ChevronDown, IndianRupee } from 'lucide-react';
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
  const [district, setDistrict] = useState('');
  const [commodity, setCommodity] = useState('');
  const [updatedDate, setUpdatedDate] = useState('');

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const data = await getMandiPrices({
        state,
        district,
        commodity: search || commodity,
        limit: 20
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
  }, [state, district, commodity]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPrices();
  };

  return (
    <AppLayout>
      <div className="max-w-screen-xl mx-auto min-h-screen pb-24">
        {/* Hero Section */}
        <div className="relative h-64 w-full overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=1200" 
            className="w-full h-full object-cover"
            alt="Mandi background"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8 text-white">
            <h1 className="text-4xl lg:text-5xl font-black tracking-tighter mb-2">Mandi Rates</h1>
            <p className="text-white/80 font-bold max-w-md">Real-time market prices from APMC markets across India.</p>
            {updatedDate && (
              <div className="flex items-center gap-2 mt-4 text-xs font-black uppercase tracking-widest text-[#4ADE80]">
                <Calendar size={14} />
                Updated: {updatedDate}
              </div>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="px-4 lg:px-8 -mt-8 relative z-10">
          <div className="bg-white rounded-[24px] shadow-2xl shadow-black/5 p-6 border border-gray-100">
            <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Search commodity (e.g. Wheat, Potato)..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#2E7D32]/10 font-bold text-gray-900"
                />
              </div>
              <div className="flex gap-4">
                 <div className="relative min-w-[150px]">
                    <select 
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full h-14 px-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none appearance-none font-bold text-gray-700 cursor-pointer"
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
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                 </div>
                 <button 
                  type="submit"
                  className="h-14 px-8 bg-[#2E7D32] text-white font-black rounded-2xl uppercase tracking-widest hover:bg-[#1B5E20] transition-colors shadow-lg shadow-green-900/20 active:scale-95 flex items-center gap-2"
                >
                  <TrendingUp size={20} />
                  <span>Update</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Records Grid */}
        <div className="p-4 lg:p-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-[200px] bg-gray-100 rounded-[32px] animate-pulse" />
              ))}
            </div>
          ) : records.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {records.map((item, idx) => (
                <div 
                  key={idx} 
                  className="group bg-white rounded-[32px] overflow-hidden border border-gray-100 hover:border-[#2E7D32]/20 hover:shadow-2xl hover:shadow-green-900/5 transition-all duration-500"
                >
                  <div className="h-40 relative overflow-hidden">
                    <img 
                      src={getCropImage(item.commodity)} 
                      alt={item.commodity}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                      <div>
                        <p className="text-[10px] font-black text-green-400 uppercase tracking-widest mb-1">{item.variety}</p>
                        <h3 className="text-xl font-black text-white">{item.commodity}</h3>
                      </div>
                      <div className="bg-white/20 backdrop-blur-md rounded-xl px-2 py-1 border border-white/20 flex items-center gap-1">
                        <MapPin size={10} className="text-white" />
                        <span className="text-[9px] font-black text-white uppercase">{item.market}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Modal Price</span>
                        <div className="flex items-center text-2xl font-black text-gray-900">
                          <IndianRupee size={18} className="text-[#2E7D32]" />
                          {item.modal_price}
                          <span className="text-xs font-bold text-gray-400 ml-1">/Qtl</span>
                        </div>
                      </div>
                      <div className="h-10 w-10 rounded-2xl bg-[#F1F8F1] flex items-center justify-center text-[#2E7D32]">
                        <TrendingUp size={20} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                      <div>
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Min Price</span>
                        <p className="text-sm font-black text-gray-700">₹{item.min_price}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Max Price</span>
                        <p className="text-sm font-black text-gray-700">₹{item.max_price}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] animate-pulse" />
                       <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                         {item.district}, {item.state}
                       </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
               <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={32} className="text-gray-300" />
               </div>
               <h3 className="text-xl font-black text-gray-900">No records found</h3>
               <p className="text-gray-500 font-bold mt-2">Try searching for a different commodity or location.</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
