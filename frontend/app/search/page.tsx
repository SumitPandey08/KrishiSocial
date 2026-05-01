'use client';

import React, { useState } from 'react';
import { Search as SearchIcon, X, User, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const RECENT_SEARCHES = ['Ramesh Kumar', 'Organic Wheat', 'Tractors for Rent', 'Pest Control'];

const SEARCH_RESULTS = [
  { id: '1', name: 'Ramesh Kumar', username: 'ramesh_farmer', followers: '1.2K', avatar: 'https://via.placeholder.com/150' },
  { id: '2', name: 'Rajesh Patil', username: 'rajesh_krishi', followers: '850', avatar: 'https://via.placeholder.com/150' },
  { id: '3', name: 'Rahul Deshmukh', username: 'rahul_organic', followers: '2.1K', avatar: 'https://via.placeholder.com/150' },
];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleClear = () => setQuery('');

  return (
    <div className="max-w-screen-md mx-auto min-h-screen bg-white pb-24">
      {/* Search Header */}
      <div className="p-4 border-b border-gray-100 sticky top-0 bg-white z-50">
         <div className="flex items-center bg-gray-100 h-12 rounded-2xl px-4 focus-within:ring-2 focus-within:ring-[#2E7D32]/20 transition-all">
            <SearchIcon size={20} className="text-gray-400" />
            <input 
              autoFocus
              type="text" 
              placeholder="Search farmers, experts, or topics..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 ml-3 bg-transparent outline-none text-sm font-bold text-gray-900"
            />
            {query && (
              <button onClick={handleClear} className="p-1 text-gray-400 hover:text-gray-600">
                 <X size={18} />
              </button>
            )}
         </div>
      </div>

      <div className="p-6">
         {!query ? (
           <section>
              <div className="flex items-center justify-between mb-4">
                 <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Recent Searches</h3>
                 <button className="text-[10px] font-black text-[#2E7D32] uppercase">Clear All</button>
              </div>
              <div className="space-y-4">
                 {RECENT_SEARCHES.map((item, i) => (
                   <button 
                     key={i} 
                     onClick={() => setQuery(item)}
                     className="flex items-center gap-3 w-full text-left group"
                   >
                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#F1F8F1] group-hover:text-[#2E7D32] transition-colors">
                         <SearchIcon size={14} />
                      </div>
                      <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900">{item}</span>
                   </button>
                 ))}
              </div>
           </section>
         ) : (
           <section>
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Found Farmers</h3>
              <div className="space-y-6">
                 {SEARCH_RESULTS.filter(u => u.name.toLowerCase().includes(query.toLowerCase()) || u.username.toLowerCase().includes(query.toLowerCase())).map((user) => (
                   <button 
                     key={user.id} 
                     onClick={() => router.push(`/profile/${user.username}`)}
                     className="flex items-center gap-4 w-full text-left active:opacity-70 transition-opacity"
                   >
                      <img src={user.avatar} alt={user.name} className="w-14 h-14 rounded-full object-cover bg-gray-100" />
                      <div className="flex-1">
                         <h4 className="text-sm font-black text-gray-900">{user.name}</h4>
                         <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">@{user.username} • {user.followers} Followers</p>
                      </div>
                      <ChevronRight size={20} className="text-gray-300" />
                   </button>
                 ))}
                 
                 {SEARCH_RESULTS.filter(u => u.name.toLowerCase().includes(query.toLowerCase()) || u.username.toLowerCase().includes(query.toLowerCase())).length === 0 && (
                   <div className="flex flex-col items-center justify-center py-10 opacity-30">
                      <User size={48} className="text-gray-300 mb-4" />
                      <p className="text-sm font-bold text-gray-500 text-center">No farmers found with that name.</p>
                   </div>
                 )}
              </div>
           </section>
         )}
      </div>
    </div>
  );
}
