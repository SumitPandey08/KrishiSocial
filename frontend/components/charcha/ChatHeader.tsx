'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Users, 
  Phone, 
  Video, 
  Info, 
  MoreVertical 
} from 'lucide-react';

interface ChatHeaderProps {
  chatTitle: string;
  chatSubtitle: string;
  chatAvatar?: string;
  isCommunity: boolean;
  isConnected: boolean;
  isCalling: boolean;
  showInfoDrawer: boolean;
  onToggleInfoDrawer: () => void;
  onInitiateCall: (type: 'audio' | 'video') => void;
}

export default function ChatHeader({
  chatTitle,
  chatSubtitle,
  chatAvatar,
  isCommunity,
  isConnected,
  isCalling,
  showInfoDrawer,
  onToggleInfoDrawer,
  onInitiateCall
}: ChatHeaderProps) {
  const router = useRouter();

  return (
    <header className="absolute top-0 inset-x-0 w-full h-16 sm:h-18 px-3 sm:px-5 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 flex items-center shrink-0 z-40 shadow-xs">
      {/* Left/Center User Info Section with right padding to never collide with absolute action buttons */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 pr-28 sm:pr-36 min-w-0 flex-1">
        
        {/* Circular Back Button */}
        <button 
          onClick={() => router.push('/charcha')}
          className="w-9 h-9 rounded-full hover:bg-slate-100 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
          title="Back to Communities"
          aria-label="Back"
        >
          <ArrowLeft size={19} />
        </button>

        {/* Clickable Avatar & Info Block */}
        <button
          onClick={() => isCommunity && onToggleInfoDrawer()}
          className={`flex items-center gap-2.5 sm:gap-3 min-w-0 text-left cursor-pointer group select-none ${!isCommunity ? 'cursor-default' : ''}`}
        >
          {/* Avatar with live status dot */}
          <div className="relative shrink-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-[#1B5E20] via-[#2E7D32] to-[#43A047] text-white flex items-center justify-center font-black text-sm shadow-md shadow-green-900/10 overflow-hidden group-hover:scale-105 transition-transform">
              {isCommunity ? (
                <Users size={20} />
              ) : chatAvatar ? (
                <Image src={chatAvatar} alt={chatTitle} width={44} height={44} className="w-full h-full object-cover" />
              ) : (
                <span>{chatTitle?.[0] || 'K'}</span>
              )}
            </div>
            <div 
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white ${isConnected ? 'bg-emerald-500' : 'bg-slate-300'}`} 
              title={isConnected ? 'Connected' : 'Connecting'}
            />
          </div>

          {/* Title & Subtitle Presence */}
          <div className="min-w-0 flex-1">
            <h1 className="font-black text-slate-900 text-sm sm:text-base tracking-tight truncate leading-tight group-hover:text-[#2E7D32] transition-colors">
              {chatTitle}
            </h1>
            
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 mt-0.5">
              <span className="truncate max-w-[120px] sm:max-w-[200px]">
                {chatSubtitle}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-emerald-700 font-extrabold flex items-center gap-1 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {isConnected ? (isCommunity ? 'Active Charcha' : 'Online') : 'Connecting'}
              </span>
            </div>
          </div>
        </button>

      </div>

      {/* ABSOLUTE RIGHT-PINNED ACTION BUTTONS */}
      <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 sm:gap-2">
        {!isCommunity ? (
          <>
            <button
              type="button"
              onClick={() => onInitiateCall('audio')}
              disabled={isCalling}
              className="w-9 h-9 sm:w-10 sm:h-10 bg-emerald-50 hover:bg-emerald-100 text-[#2E7D32] rounded-xl flex items-center justify-center transition-all disabled:opacity-50 active:scale-95 border border-emerald-200/60 shadow-xs cursor-pointer"
              title="Start Audio Call"
            >
              <Phone size={17} />
            </button>

            <button
              type="button"
              onClick={() => onInitiateCall('video')}
              disabled={isCalling}
              className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] hover:brightness-110 text-white rounded-xl flex items-center justify-center transition-all shadow-md shadow-green-900/15 disabled:opacity-50 active:scale-95 cursor-pointer"
              title="Start Video Call"
            >
              <Video size={17} />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onToggleInfoDrawer}
            className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              showInfoDrawer
                ? 'bg-[#2E7D32] text-white shadow-xs'
                : 'bg-emerald-50 hover:bg-emerald-100 text-[#2E7D32] border border-emerald-200/60'
            }`}
            title="Community Info & Rules"
          >
            <Info size={15} />
            <span className="hidden sm:inline">Details</span>
          </button>
        )}
      </div>
    </header>
  );
}
