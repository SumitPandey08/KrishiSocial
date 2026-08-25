'use client';

import React from 'react';
import { Sprout, Sparkles } from 'lucide-react';

interface EmptyChatStateProps {
  chatTitle: string;
  quickTopics: string[];
  onSelectTopic: (topic: string) => void;
}

export default function EmptyChatState({
  chatTitle,
  quickTopics,
  onSelectTopic
}: EmptyChatStateProps) {
  return (
    <div className="text-center py-10 px-6 bg-white rounded-3xl border border-emerald-100 shadow-sm max-w-md mx-auto space-y-4 my-8 animate-in fade-in">
      <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#2E7D32] flex items-center justify-center mx-auto shadow-inner border border-emerald-200/60">
        <Sprout size={28} />
      </div>
      
      <div className="space-y-1">
        <h3 className="text-base font-black text-slate-900">
          Welcome to {chatTitle}!
        </h3>
        <p className="text-xs text-slate-500 font-medium leading-relaxed">
          Start the conversation by asking a crop query, sharing mandi price updates, or greeting fellow farmers.
        </p>
      </div>

      <div className="pt-2">
        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-center gap-1">
          <Sparkles size={11} className="text-[#2E7D32]" />
          <span>Quick Topic Starters</span>
        </p>
        <div className="flex flex-wrap justify-center gap-1.5">
          {quickTopics.map((topic, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onSelectTopic(topic)}
              className="px-3 py-1.5 bg-emerald-50/80 hover:bg-emerald-100 text-emerald-900 border border-emerald-200/80 rounded-xl text-[11px] font-bold transition-all active:scale-95 cursor-pointer shadow-2xs"
            >
              {topic}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
