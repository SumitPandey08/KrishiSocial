'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search as SearchIcon, X, User, ChevronRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import AppLayout from '@/components/AppLayout';
import { searchUsers } from '@/services/userService';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const RECENT_SEARCHES = ['Ramesh Kumar', 'Organic Wheat', 'Tractors for Rent', 'Pest Control'];

interface SearchResult {
  _id: string;
  name: string;
  username: string;
  profilePicture?: string;
  followersCount: number;
  isVerified: boolean;
  role: string;
}

function SearchContent() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const data = await searchUsers(searchQuery);
      setResults(data);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(query);
    }, 400);

    return () => clearTimeout(timer);
  }, [query, handleSearch]);

  const handleClear = () => {
    setQuery('');
    setResults([]);
  };

  return (
    <div className="max-w-screen-md mx-auto min-h-screen pb-24 bg-white">
      {/* Search Header */}
      <div className="p-4 border-b border-gray-100 sticky top-0 bg-white z-50">
         <div className="flex items-center bg-gray-100 h-12 rounded-2xl px-4 focus-within:ring-2 focus-within:ring-[#2E7D32]/20 transition-all border border-transparent focus-within:border-[#2E7D32]/10 focus-within:bg-white">
            {loading ? (
               <Loader2 size={20} className="text-[#2E7D32] animate-spin" />
            ) : (
               <SearchIcon size={20} className="text-gray-400" />
            )}
            <input 
              autoFocus
              type="text" 
              placeholder="Search farmers, experts, or topics..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 ml-3 bg-transparent outline-none text-sm font-bold text-gray-900 placeholder:text-gray-400"
            />
            {query && (
              <button onClick={handleClear} className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                 <X size={18} />
              </button>
            )}
         </div>
      </div>

      <div className="p-6">
         {!query && results.length === 0 ? (
            <section className="animate-in fade-in slide-in-from-bottom-2 duration-500">
               <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.1em]">Recent Searches</h3>
                  <button className="text-[10px] font-black text-[#2E7D32] uppercase hover:underline">Clear All</button>
               </div>
               <div className="space-y-4">
                  {RECENT_SEARCHES.map((item, i) => (
                    <button 
                      key={i} 
                      onClick={() => setQuery(item)}
                      className="flex items-center gap-4 w-full text-left group"
                    >
                       <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#E8F5E9] group-hover:text-[#2E7D32] transition-all duration-300">
                          <SearchIcon size={16} />
                       </div>
                       <span className="text-[15px] font-bold text-gray-700 group-hover:text-gray-900 transition-colors">{item}</span>
                    </button>
                  ))}
               </div>
            </section>
          ) : (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.1em]">Search Results</h3>
                  <span className="text-[10px] font-black text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{results.length} results</span>
               </div>
               
               <div className="space-y-2">
                  {results.map((user) => (
                    <button 
                      key={user._id} 
                      onClick={() => router.push(`/profile/${user.username}`)}
                      className="flex items-center gap-4 w-full p-3 rounded-2xl hover:bg-gray-50 transition-all group"
                    >
                       <div className="relative">
                          <img 
                            src={user.profilePicture || "https://via.placeholder.com/150"} 
                            alt={user.name} 
                            className="w-14 h-14 rounded-full object-cover bg-gray-100 ring-2 ring-white shadow-sm group-hover:scale-105 transition-transform" 
                          />
                          {user.isVerified && (
                             <div className="absolute -bottom-0.5 -right-0.5 bg-[#2E7D32] text-white p-0.5 rounded-full border-2 border-white">
                                <ChevronRight size={10} className="fill-current" />
                             </div>
                          )}
                       </div>
                       <div className="flex-1">
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-[15px] font-black text-gray-900">{user.name}</h4>
                            {user.role === 'expert' && (
                               <span className="bg-[#E8F5E9] text-[#2E7D32] text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">Expert</span>
                            )}
                          </div>
                          <p className="text-[12px] font-bold text-gray-400 tracking-tight">@{user.username} • {user.followersCount} Followers</p>
                       </div>
                       <ChevronRight size={20} className="text-gray-300 group-hover:text-[#2E7D32] group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                  
                  {!loading && query && results.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in-95 duration-500">
                       <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                          <User size={40} className="text-gray-200" />
                       </div>
                       <p className="text-base font-black text-gray-900">No matches found</p>
                       <p className="text-sm font-medium text-gray-400 mt-1">Try searching for something else</p>
                    </div>
                  )}
               </div>
            </section>
          )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <AppLayout>
      <SearchContent />
    </AppLayout>
  );
}
