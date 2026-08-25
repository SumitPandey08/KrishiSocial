'use client';

import React from 'react';
import { Send, Loader2 } from 'lucide-react';

interface MessageInputProps {
  messageText: string;
  onChangeText: (text: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  sending: boolean;
  isCommunity: boolean;
  quickTopics: string[];
  onSelectTopic: (topic: string) => void;
}

export default function MessageInput({
  messageText,
  onChangeText,
  onSubmit,
  sending,
  isCommunity,
  quickTopics,
  onSelectTopic
}: MessageInputProps) {
  return (
    <div className="p-2.5 sm:p-3.5 border-t border-slate-100 bg-white sticky bottom-0 z-30 space-y-2 shrink-0 shadow-xs">
      
      {/* Quick Agriculture Topic Shortcut Pills */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
        {quickTopics.map((topic, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onSelectTopic(topic)}
            className="px-2.5 py-0.5 bg-emerald-50/80 hover:bg-emerald-100 text-emerald-900 border border-emerald-200/70 rounded-full text-[10px] font-bold whitespace-nowrap transition-all active:scale-95 shrink-0 cursor-pointer"
          >
            {topic}
          </button>
        ))}
      </div>

      {/* Input Form Bar */}
      <form onSubmit={onSubmit} className="flex items-center gap-2">
        <div className="flex-1 relative flex items-center">
          <input
            type="text"
            placeholder={isCommunity ? "Ask a question or share farming update..." : "Type your message..."}
            className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-2xl text-xs sm:text-sm font-bold text-slate-900 focus:bg-white focus:border-[#2E7D32] focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all placeholder:text-slate-400"
            value={messageText}
            onChange={(e) => onChangeText(e.target.value)}
          />
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!messageText.trim() || sending}
          className="w-11 h-11 bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] hover:brightness-110 text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-40 shadow-md shadow-green-900/15 active:scale-95 shrink-0 cursor-pointer"
          title="Send Message"
          aria-label="Send Message"
        >
          {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        </button>
      </form>

    </div>
  );
}
