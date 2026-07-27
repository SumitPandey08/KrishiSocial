'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface StatusBubbleProps {
  profilePhoto: string;
  name: string;
  onPress?: () => void;
  isOwnStory?: boolean;
  isViewed?: boolean;
}

export function StatusBubble({ profilePhoto, isViewed, name, onPress, isOwnStory }: StatusBubbleProps) {
  return (
    <button 
      onClick={onPress}
      className="flex flex-col items-center gap-1.5 w-[76px] flex-shrink-0 group transition-transform active:scale-95"
    >
      <div className={cn(
        "relative w-[68px] h-[68px] rounded-full flex items-center justify-center p-[2px] transition-transform group-hover:scale-105",
        !isViewed ? "bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-400" : (isOwnStory ? "bg-transparent" : "bg-slate-200")
      )}>
        <div className="w-full h-full rounded-full overflow-hidden border-2 border-white bg-slate-100 shadow-xs">
          <img src={profilePhoto} alt={name} className="w-full h-full object-cover" />
        </div>
        
        {isOwnStory && (
          <div className="absolute bottom-0 right-0 bg-emerald-600 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white text-white shadow-xs">
            <Plus size={12} strokeWidth={3} />
          </div>
        )}
      </div>

      <span className="text-[11px] font-extrabold text-slate-800 truncate w-full text-center tracking-tight">
        {name}
      </span>
    </button>
  );
}

export default function StatusList() {
  const data = [
    { id: '0', name: 'Mandi Rates', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80', isViewed: false },
    { id: '1', name: 'Expert Tips', image: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=500&q=80', isViewed: false },
    { id: '2', name: 'Weather Alert', image: 'https://images.unsplash.com/photo-1504370805625-d32c54b16100?w=500&q=80', isViewed: true },
    { id: '3', name: 'Organic Crops', image: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=500&q=80', isViewed: false },
    { id: '4', name: 'New Seeds', image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=500&q=80', isViewed: false },
  ];

  return (
    <div className="bg-white py-3 border-b border-slate-100 overflow-x-auto no-scrollbar">
      <div className="flex gap-4 px-4 min-w-max">
        {data.map((item) => (
          <StatusBubble 
            key={item.id}
            name={item.name} 
            profilePhoto={item.image}
            isViewed={item.isViewed} 
          />
        ))}
      </div>
    </div>
  );
}
