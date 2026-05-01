'use client';

import React, { useState } from 'react';
import { Search, SlidersHorizontal, Phone, MessageSquare } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CATEGORIES = ['All', 'Crops', 'Tractors', 'Seeds', 'Tools'];

const PRODUCTS = [
  { id: '1', name: 'Organic Wheat', price: '₹2,400/Quintal', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&q=80', category: 'Crops', distance: '5 km' },
  { id: '2', name: 'John Deere Tractor', price: '₹1,500/Hour', image: 'https://images.unsplash.com/photo-1594411132715-99661580174e?w=500&q=80', category: 'Tractors', distance: '12 km' },
  { id: '3', name: 'Basmati Rice Seeds', price: '₹800/Bag', image: 'https://images.unsplash.com/photo-1536633100230-07e05697660b?w=500&q=80', category: 'Seeds', distance: '2 km' },
  { id: '4', name: 'Manual Seeder', price: '₹3,500', image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=500&q=80', category: 'Tools', distance: '8 km' },
  { id: '5', name: 'Fresh Potatoes', price: '₹1,200/Quintal', image: 'https://images.unsplash.com/photo-1518977676601-b53f02ac6d31?w=500&q=80', category: 'Crops', distance: '15 km' },
  { id: '6', name: 'Rotavator for Rent', price: '₹800/Hour', image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=500&q=80', category: 'Tools', distance: '20 km' },
];

export default function MandiPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filteredProducts = PRODUCTS.filter(p => 
    (activeCategory === 'All' || p.category === activeCategory) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen bg-[#F7FDF7]">
      {/* Search Bar */}
      <div className="flex items-center gap-3 p-4">
        <div className="flex-1 flex items-center bg-white h-12 rounded-xl px-4 border border-gray-200 shadow-sm focus-within:ring-2 focus-within:ring-[#2E7D32]/20 transition-all">
          <Search size={20} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Search crops, tractors..." 
            className="flex-1 ml-3 bg-transparent outline-none text-sm font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-gray-200 shadow-sm text-[#2E7D32]">
          <SlidersHorizontal size={20} />
        </button>
      </div>

      {/* Categories */}
      <div className="overflow-x-auto no-scrollbar py-2">
        <div className="flex gap-2 px-4 min-w-max">
          {CATEGORIES.map(cat => (
            <button 
              key={cat} 
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-bold border transition-all",
                activeCategory === cat 
                  ? "bg-[#2E7D32] border-[#2E7D32] text-white shadow-md shadow-[#2E7D32]/20" 
                  : "bg-white border-gray-200 text-gray-600 hover:border-[#2E7D32]/50"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 gap-4 p-4">
        {filteredProducts.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex flex-col">
            <div className="relative h-32 w-full">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg">
                <span className="text-[10px] font-black text-white">{item.distance}</span>
              </div>
            </div>
            
            <div className="p-3 flex-1 flex flex-col">
              <h3 className="text-sm font-bold text-gray-900 line-clamp-1">{item.name}</h3>
              <p className="text-xs font-black text-[#2E7D32] mt-1">{item.price}</p>
              
              <div className="flex gap-2 mt-3">
                <button className="flex-1 h-9 bg-[#2E7D32] rounded-lg flex items-center justify-center gap-1.5 text-white transition-transform active:scale-95">
                  <Phone size={14} fill="currentColor" />
                  <span className="text-xs font-bold">Call</span>
                </button>
                <button className="w-9 h-9 bg-[#E8F5E9] rounded-lg flex items-center justify-center text-[#2E7D32] transition-transform active:scale-95">
                  <MessageSquare size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 opacity-50">
          <Search size={48} className="text-gray-300 mb-4" />
          <p className="text-gray-500 font-bold">No products found</p>
        </div>
      )}
    </div>
  );
}
