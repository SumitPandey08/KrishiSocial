'use client';

import React from 'react';
import { ArrowBigUp, MessageCircle, Clock, CheckCircle2 } from 'lucide-react';

interface QuestionCardProps {
  item: {
    id: string;
    user: string;
    question: string;
    category: string;
    votes: number;
    answers: number;
    isAnsweredByExpert: boolean;
    time: string;
  };
}

export function QuestionCard({ item }: QuestionCardProps) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gray-200" />
          <span className="text-xs font-bold text-gray-700">{item.user}</span>
          <span className="text-[10px] text-gray-400">•</span>
          <div className="flex items-center gap-1 text-gray-400">
            <Clock size={12} />
            <span className="text-[10px] font-medium">{item.time}</span>
          </div>
        </div>
        <div className="bg-[#E8F5E9] text-[#2E7D32] text-[10px] font-black px-2 py-0.5 rounded uppercase">
          {item.category}
        </div>
      </div>

      <h3 className="text-base font-bold text-gray-900 leading-snug mb-4">
        {item.question}
      </h3>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-[#F3F4F6] rounded-lg px-2 py-1 gap-1">
            <ArrowBigUp size={18} className="text-gray-500" />
            <span className="text-xs font-bold text-gray-700">{item.votes}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500">
            <MessageCircle size={16} />
            <span className="text-xs font-bold">{item.answers} answers</span>
          </div>
        </div>

        {item.isAnsweredByExpert && (
          <div className="flex items-center gap-1 text-[#2E7D32]">
            <CheckCircle2 size={14} fill="currentColor" className="text-white" />
            <span className="text-[10px] font-black uppercase">Expert Answered</span>
          </div>
        )}
      </div>
    </div>
  );
}
