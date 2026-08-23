'use client';

import React, { useState, useEffect } from 'react';
import { LogOut, Grid, HelpCircle, MapPin, LandPlot, Sprout, Loader2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createChat } from '@/services/chatService';
import { toggleFollow } from '@/services/userService';

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
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(Boolean(data.isFollowing));
  const [followersCount, setFollowersCount] = useState(data.followersCount || 0);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [isMessaging, setIsMessaging] = useState(false);

  // Sync state when data props change
  useEffect(() => {
    setIsFollowing(Boolean(data.isFollowing));
    setFollowersCount(data.followersCount || 0);
  }, [data.isFollowing, data.followersCount]);

  const handleFollowToggle = async () => {
    if (!data._id || isFollowLoading) return;

    const previousStatus = isFollowing;
    const previousCount = followersCount;
    const optimisticStatus = !previousStatus;
    const optimisticCount = optimisticStatus ? previousCount + 1 : Math.max(0, previousCount - 1);

    // Optimistic update
    setIsFollowing(optimisticStatus);
    setFollowersCount(optimisticCount);
    setIsFollowLoading(true);

    try {
      const res = await toggleFollow(data._id);
      setIsFollowing(Boolean(res.isFollowing));
      if (typeof res.followersCount === 'number') {
        setFollowersCount(res.followersCount);
      }
    } catch (error: any) {
      console.error('Follow toggle error:', error);
      // Revert on error
      setIsFollowing(previousStatus);
      setFollowersCount(previousCount);
      const errorMsg = error?.response?.data?.message || 'Failed to update follow status';
      alert(errorMsg);
    } finally {
      setIsFollowLoading(false);
    }
  };

  const handleMessage = async () => {
    setIsMessaging(true);
    try {
      const chat = await createChat({
        chatType: 'personal',
        participants: [data._id],
      });
      router.push(`/charcha/${chat._id}`);
    } catch (error) {
      console.error('Failed to start chat:', error);
      alert('Failed to start conversation. Please try again.');
    } finally {
      setIsMessaging(false);
    }
  };

  return (
    <div className="bg-white p-5 border-b border-gray-100">
      <div className="flex items-center gap-8 mb-4">
        <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[#E8F5E9] shadow-sm bg-gray-100">
          <img
            src={data.profilePicture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&q=80'}
            alt={data.name}
            className="w-full h-full object-cover"
          />
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
            <button 
              onClick={() => {
                navigator.clipboard?.writeText?.(window.location.href);
                alert('Profile link copied to clipboard!');
              }}
              className="flex-1 h-10 bg-gray-100 rounded-xl text-sm font-black text-gray-900 transition-transform active:scale-95"
            >
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
              disabled={isFollowLoading}
              className={cn(
                "flex-1 h-10 rounded-xl text-sm font-black transition-all active:scale-95 flex items-center justify-center gap-1.5",
                isFollowing 
                  ? "bg-gray-100 hover:bg-gray-200 text-gray-900" 
                  : "bg-[#2E7D32] hover:bg-emerald-700 text-white shadow-md shadow-[#2E7D32]/20"
              )}
            >
              {isFollowLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                isFollowing ? 'Following' : 'Follow'
              )}
            </button>
            <button 
              onClick={handleMessage}
              disabled={isMessaging}
              className="flex-1 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-black text-gray-900 transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              {isMessaging ? <Loader2 size={18} className="animate-spin" /> : 'Message'}
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
