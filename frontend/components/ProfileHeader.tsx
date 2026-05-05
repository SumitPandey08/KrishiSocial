'use client';

import React, { useState } from 'react';
import { LogOut, Grid, HelpCircle, MapPin, LandPlot, Sprout } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Link from 'next/link';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ProfileProps {
  data: {
    _id: string;
    name: string;
    username: string;
    bio: string;
    profilePicture: string;
    postsCount?: number;
    followersCount?: number;
    followingCount?: number;
    isFollowing?: boolean;
    farmSize?: number;
    farmingType?: string;
    location?: string;
  };
  onLogout?: () => void;
  isOwnProfile?: boolean;
  activeTab?: 'posts' | 'questions';
  onTabChange?: (tab: 'posts' | 'questions') => void;
}

export default function ProfileHeader({
  data,
  onLogout,
  isOwnProfile,
  activeTab = 'posts',
  onTabChange,
}: ProfileProps) {
  const [isFollowing, setIsFollowing] = useState(data.isFollowing || false);
  const [followersCount, setFollowersCount] = useState(data.followersCount || 0);

  const handleFollowToggle = () => {
    const newStatus = !isFollowing;
    setIsFollowing(newStatus);
    setFollowersCount(prev => newStatus ? prev + 1 : Math.max(0, prev - 1));
  };

  return (
    <div className="bg-white p-5 border-b border-gray-100">
      <div className="flex items-center gap-8 mb-4">
        <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[#E8F5E9] shadow-sm">
          <img src={data.profilePicture} alt={data.name} className="w-full h-full object-cover" />
        </div>
        
        <div className="flex-1 flex justify-around">
          <div className="flex flex-col items-center">
            <span className="text-lg font-black text-gray-900">{data.postsCount || 0}</span>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-tighter">Posts</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-lg font-black text-gray-900">{followersCount}</span>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-tighter">Followers</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-lg font-black text-gray-900">{data.followingCount || 0}</span>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-tighter">Following</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h1 className="text-lg font-black text-gray-900 leading-tight">{data.name}</h1>
        <p className="text-sm font-medium text-gray-600 mt-1 leading-relaxed">{data.bio}</p>
      </div>

      <div className="flex gap-3 mb-6">
        {isOwnProfile ? (
          <>
            <Link 
              href="/edit-profile"
              className="flex-1 h-10 bg-gray-100 rounded-xl text-sm font-black text-gray-900 transition-transform active:scale-95 flex items-center justify-center"
            >
              Edit Profile
            </Link>
            <button className="flex-1 h-10 bg-gray-100 rounded-xl text-sm font-black text-gray-900 transition-transform active:scale-95">
              Share Profile
            </button>
            {onLogout && (
              <button 
                onClick={onLogout}
                className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-900 transition-transform active:scale-95"
              >
                <LogOut size={20} />
              </button>
            )}
          </>
        ) : (
          <>
            <button 
              onClick={handleFollowToggle}
              className={cn(
                "flex-1 h-10 rounded-xl text-sm font-black transition-all active:scale-95",
                isFollowing 
                  ? "bg-gray-100 text-gray-900" 
                  : "bg-[#2E7D32] text-white shadow-md shadow-[#2E7D32]/20"
              )}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
            <button className="flex-1 h-10 bg-gray-100 rounded-xl text-sm font-black text-gray-900 transition-transform active:scale-95">
              Message
            </button>
          </>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 py-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#F1F8F1] rounded-lg flex items-center justify-center text-[#2E7D32]">
            <LandPlot size={16} />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-[10px] font-black text-gray-400 uppercase leading-none">Farm Size</span>
            <span className="text-[11px] font-black text-gray-900 truncate">{data.farmSize || 0} Acres</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#F1F8F1] rounded-lg flex items-center justify-center text-[#2E7D32]">
            <Sprout size={16} />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-[10px] font-black text-gray-400 uppercase leading-none">Type</span>
            <span className="text-[11px] font-black text-gray-900 truncate">{data.farmingType || 'Traditional'}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#F1F8F1] rounded-lg flex items-center justify-center text-[#2E7D32]">
            <MapPin size={16} />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-[10px] font-black text-gray-400 uppercase leading-none">Location</span>
            <span className="text-[11px] font-black text-gray-900 truncate">{data.location || 'N/A'}</span>
          </div>
        </div>
      </div>

      <div className="flex border-t border-gray-100 -mx-5 mt-2">
        <button 
          onClick={() => onTabChange?.('posts')}
          className={cn(
            "flex-1 py-3 flex items-center justify-center border-b-2 transition-all",
            activeTab === 'posts' ? "border-[#2E7D32] text-[#2E7D32]" : "border-transparent text-gray-400"
          )}
        >
          <Grid size={24} strokeWidth={activeTab === 'posts' ? 2.5 : 2} />
        </button>
        <button 
          onClick={() => onTabChange?.('questions')}
          className={cn(
            "flex-1 py-3 flex items-center justify-center border-b-2 transition-all",
            activeTab === 'questions' ? "border-[#2E7D32] text-[#2E7D32]" : "border-transparent text-gray-400"
          )}
        >
          <HelpCircle size={26} strokeWidth={activeTab === 'questions' ? 2.5 : 2} />
        </button>
      </div>
    </div>
  );
}
