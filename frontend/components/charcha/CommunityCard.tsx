'use client';

import React from 'react';
import { Users } from 'lucide-react';

interface CommunityCardProps {
  item: {
    id: string;
    name: string;
    members: string;
    icon: string;
  };
}

export function CommunityCard({ item }: CommunityCardProps) {
  return (
    <div className="flex-shrink-0 w-40 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mr-4 flex flex-col items-center text-center">
      <div className="w-12 h-12 bg-[#F1F8F1] rounded-xl flex items-center justify-center text-[#2E7D32] mb-3">
        <Users size={24} />
      </div>
      <h3 className="text-sm font-bold text-gray-900 line-clamp-1">{item.name}</h3>
      <p className="text-[10px] font-black text-[#2E7D32] uppercase mt-1">{item.members} members</p>
      <button className="mt-3 w-full py-1.5 bg-[#2E7D32] text-white text-[10px] font-bold rounded-lg uppercase tracking-wider transition-transform active:scale-95">
        Join
      </button>
    </div>
  );
}
