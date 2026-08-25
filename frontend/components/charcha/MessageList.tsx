'use client';

import React from 'react';
import Image from 'next/image';
import { CheckCheck, Sparkles, ChevronDown } from 'lucide-react';
import EmptyChatState from './EmptyChatState';

interface Message {
  _id: string;
  sender: {
    _id: string;
    username: string;
    name: string;
    profilePicture?: string;
    role?: string;
  };
  content: string;
  messageType: string;
  mediaUrl?: string;
  createdAt: string;
}

interface MessageListProps {
  messages: Message[];
  currentUserId?: string;
  isCommunity: boolean;
  chatTitle: string;
  quickTopics: string[];
  onSelectTopic: (topic: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  chatContainerRef: React.RefObject<HTMLDivElement | null>;
  onScroll: () => void;
  showScrollBottom: boolean;
  onScrollToBottom: () => void;
}

export default function MessageList({
  messages,
  currentUserId,
  isCommunity,
  chatTitle,
  quickTopics,
  onSelectTopic,
  messagesEndRef,
  chatContainerRef,
  onScroll,
  showScrollBottom,
  onScrollToBottom
}: MessageListProps) {
  return (
    <div 
      ref={chatContainerRef}
      onScroll={onScroll}
      className="flex-1 overflow-y-auto px-3 sm:px-4 pt-20 sm:pt-22 pb-4 space-y-3 bg-[#F8FAF8] relative"
    >
      {messages.length === 0 ? (
        <EmptyChatState 
          chatTitle={chatTitle}
          quickTopics={quickTopics}
          onSelectTopic={onSelectTopic}
        />
      ) : (
        <>
          {/* Community Pinned Welcome Guideline */}
          {isCommunity && (
            <div className="flex justify-center my-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-900 text-[10px] font-bold shadow-2xs">
                <Sparkles size={11} className="text-[#2E7D32]" />
                <span>Welcome to {chatTitle} • Connect with farmers & share mandi rates</span>
              </div>
            </div>
          )}

          {/* Messages Stream */}
          {messages.map((msg, index) => {
            const isOwnMessage = msg.sender?._id === currentUserId;
            const showSender = !isOwnMessage && (index === 0 || messages[index - 1]?.sender?._id !== msg.sender?._id);

            return (
              <div key={msg._id || index} className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} relative z-10`}>
                
                {/* Sender Name above message in Community Chat */}
                {showSender && isCommunity && (
                  <div className="flex items-center gap-1.5 mb-1 ml-9">
                    <span className="text-[11px] font-black text-slate-800 tracking-tight">
                      {msg.sender?.name || 'Farmer'}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400">
                      @{msg.sender?.username || 'user'}
                    </span>
                    {msg.sender?.role === 'admin' && (
                      <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 text-[9px] font-black uppercase">
                        Admin
                      </span>
                    )}
                  </div>
                )}

                <div className={`flex items-end gap-2 max-w-[85%] sm:max-w-[75%] ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                  
                  {/* Sender Avatar in Community Chat */}
                  {!isOwnMessage && isCommunity && (
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold flex-shrink-0 flex items-center justify-center text-xs overflow-hidden shadow-2xs mb-0.5">
                      {msg.sender?.profilePicture ? (
                        <Image src={msg.sender.profilePicture} alt={msg.sender.name || 'User'} width={28} height={28} className="w-full h-full object-cover" />
                      ) : (
                        <span>{msg.sender?.name?.[0] || 'K'}</span>
                      )}
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div 
                    className={`px-4 py-2.5 rounded-[20px] text-xs sm:text-sm font-medium leading-relaxed shadow-xs transition-all ${
                      isOwnMessage
                        ? 'bg-gradient-to-r from-[#1B5E20] via-[#2E7D32] to-[#15803D] text-white rounded-br-xs shadow-green-900/10'
                        : 'bg-white text-slate-800 rounded-bl-xs border border-slate-200/90 shadow-slate-900/5'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{msg.content}</p>

                    {/* Timestamp & Delivery Indicator */}
                    <div className={`flex items-center justify-end gap-1 text-[9px] mt-1 font-bold ${isOwnMessage ? 'text-emerald-200' : 'text-slate-400'}`}>
                      <span>
                        {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isOwnMessage && (
                        <CheckCheck size={12} className="text-emerald-300 ml-0.5" />
                      )}
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </>
      )}

      <div ref={messagesEndRef} />

      {/* Floating Scroll to Bottom Button */}
      {showScrollBottom && (
        <button
          onClick={onScrollToBottom}
          className="absolute bottom-20 right-5 z-30 p-2.5 rounded-full bg-white hover:bg-emerald-50 text-[#2E7D32] shadow-lg border border-emerald-200 transition-all animate-bounce cursor-pointer"
          title="Scroll to bottom"
        >
          <ChevronDown size={18} />
        </button>
      )}
    </div>
  );
}
