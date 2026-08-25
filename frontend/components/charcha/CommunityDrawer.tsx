'use client';

import React from 'react';
import { ShieldCheck, Tag, X, Users } from 'lucide-react';

interface CommunityDrawerProps {
  description?: string;
  tags?: string[];
  membersCount?: number;
  onClose: () => void;
}

export default function CommunityDrawer({
  description,
  tags = [],
  membersCount = 0,
  onClose
}: CommunityDrawerProps) {
  return (
    <div className="absolute top-16 sm:top-18 inset-x-0 p-4 bg-emerald-50/95 backdrop-blur-md border-b border-emerald-200/80 space-y-3 animate-in slide-in-from-top-2 duration-200 z-35 shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1.5 min-w-0">
          <p className="text-xs font-semibold text-slate-700 leading-relaxed">
            {description || 'Community discussion forum for farmers, crop health advisory, and mandi price updates.'}
          </p>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {tags.map((tag, idx) => (
                <span 
                  key={idx} 
                  className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white text-emerald-800 border border-emerald-200 shadow-2xs"
                >
                  <Tag size={10} /> #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <button 
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-white transition-colors shrink-0 cursor-pointer"
          title="Close details"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-emerald-200/70 text-[11px] font-bold text-emerald-900">
        <div className="flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-[#2E7D32]" />
          <span>Verified Farmer Community Forum</span>
        </div>
        <div className="flex items-center gap-1 text-slate-600">
          <Users size={12} className="text-[#2E7D32]" />
          <span>{membersCount} Farmers Joined</span>
        </div>
      </div>
    </div>
  );
}
