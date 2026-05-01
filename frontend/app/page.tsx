'use client';

import React, { useState } from 'react';
import StatusList from '@/components/StatusList';
import Posts from '@/components/Posts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const FILTERS = ['All', 'Posts', 'Questions', 'My Crops', 'Nearby'];

export default function Home() {
  const [activeFilter, setActiveFilter] = useState('All');

  return (
    <div className="w-full">
      {/* Filter Bar */}
      <div className="bg-[#F0F9F0] py-3 overflow-x-auto no-scrollbar">
        <div className="flex gap-3 px-4 min-w-max">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-semibold transition-colors",
                activeFilter === filter 
                  ? "bg-[#2E7D32] text-white" 
                  : "bg-[#E0EBE0] text-[#2E7D32]"
              )}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Stories/Status */}
      <div className="mt-2">
        <StatusList />
      </div>

      {/* Feed */}
      <div className="mt-4">
        <Posts activeFilter={activeFilter} />
      </div>
    </div>
  );
}
