'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getFeedStories, FeedStoryGroup } from '@/services/storyService';
import { useUser } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import CreateStoryModal from './CreateStoryModal';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface StatusBubbleProps {
  profilePhoto?: string;
  name: string;
  onPress?: () => void;
  onAddPress?: () => void;
  isOwnStory?: boolean;
  hasUnseen?: boolean;
  hasActiveStory?: boolean;
}

export function StatusBubble({
  profilePhoto,
  name,
  onPress,
  onAddPress,
  isOwnStory,
  hasUnseen,
  hasActiveStory = true,
}: StatusBubbleProps) {
  const defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&q=80';
  const avatarUrl = profilePhoto || defaultAvatar;

  return (
    <div className="flex flex-col items-center gap-1.5 w-[76px] flex-shrink-0 group">
      <div className="relative">
        <button
          type="button"
          onClick={onPress}
          className={cn(
            'relative w-[68px] h-[68px] rounded-full flex items-center justify-center p-[2.5px] transition-all transform group-hover:scale-105 active:scale-95',
            hasActiveStory
              ? hasUnseen
                ? 'bg-gradient-to-tr from-[#2E7D32] via-emerald-400 to-amber-400 shadow-sm'
                : 'bg-slate-200'
              : 'border-2 border-dashed border-emerald-400 p-[2px] bg-emerald-50/50'
          )}
        >
          <div className="w-full h-full rounded-full overflow-hidden border-2 border-white bg-slate-100 shadow-xs">
            <img
              src={avatarUrl}
              alt={name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = defaultAvatar;
              }}
            />
          </div>
        </button>

        {/* Small + badge for adding own story */}
        {isOwnStory && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onAddPress) {
                onAddPress();
              } else if (onPress) {
                onPress();
              }
            }}
            aria-label="Add Story"
            className="absolute bottom-0 right-0 bg-[#2E7D32] hover:bg-emerald-700 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white text-white shadow-md transition-transform hover:scale-110 active:scale-90 cursor-pointer"
          >
            <Plus size={12} strokeWidth={3.5} />
          </button>
        )}
      </div>

      <span className="text-[11px] font-extrabold text-slate-800 truncate w-full text-center tracking-tight">
        {isOwnStory ? 'Your Story' : name}
      </span>
    </div>
  );
}

export default function StatusList() {
  const router = useRouter();
  const { user: currentUser } = useUser();
  const [storyGroups, setStoryGroups] = useState<FeedStoryGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchStories = useCallback(async () => {
    try {
      const data = await getFeedStories();
      setStoryGroups(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch stories:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  const currentUserId = currentUser?.id || (currentUser as any)?._id;

  // Find own story group if it exists
  const ownGroup = storyGroups.find(
    (g) => g.isOwnStory || (currentUserId && g.user?._id?.toString() === currentUserId.toString())
  );

  // Other users' story groups
  const otherGroups = storyGroups.filter(
    (g) => !g.isOwnStory && (!currentUserId || g.user?._id?.toString() !== currentUserId.toString())
  );

  const handleOpenStory = (group: FeedStoryGroup) => {
    if (!group.stories || group.stories.length === 0) return;
    // Find first unseen story, or fallback to first story
    const targetStory = group.stories.find((s) => !s.isViewed) || group.stories[0];
    router.push(`/story/${targetStory._id}`);
  };

  const handleOwnStoryClick = () => {
    if (ownGroup && ownGroup.stories && ownGroup.stories.length > 0) {
      handleOpenStory(ownGroup);
    } else {
      setIsCreateModalOpen(true);
    }
  };

  return (
    <>
      <div className="bg-white py-3 border-b border-slate-100 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-4 px-4 min-w-max">
          {/* Own Story Bubble */}
          <StatusBubble
            profilePhoto={currentUser?.profilePicture || ownGroup?.user?.profilePicture}
            name="Your Story"
            isOwnStory={true}
            hasActiveStory={Boolean(ownGroup && ownGroup.stories?.length > 0)}
            hasUnseen={Boolean(ownGroup && ownGroup.hasUnseen)}
            onPress={handleOwnStoryClick}
            onAddPress={() => setIsCreateModalOpen(true)}
          />

          {/* Loading Skeletons */}
          {loading && (
            <>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 w-[76px] flex-shrink-0 animate-pulse">
                  <div className="w-[68px] h-[68px] rounded-full bg-slate-200" />
                  <div className="w-12 h-2.5 bg-slate-200 rounded-full" />
                </div>
              ))}
            </>
          )}

          {/* Followed Users' Stories */}
          {!loading &&
            otherGroups.map((group) => {
              const displayName = group.user?.name || group.user?.username || 'User';
              return (
                <StatusBubble
                  key={group.user?._id || Math.random().toString()}
                  profilePhoto={group.user?.profilePicture}
                  name={displayName}
                  isOwnStory={false}
                  hasActiveStory={true}
                  hasUnseen={group.hasUnseen}
                  onPress={() => handleOpenStory(group)}
                />
              );
            })}

          {/* Empty state hint if no other stories */}
          {!loading && otherGroups.length === 0 && !ownGroup && (
            <div className="flex items-center gap-2 pl-2 pr-4 text-xs font-semibold text-gray-400 select-none">
              <Sparkles size={14} className="text-emerald-500" />
              <span>Share a story from your farm today!</span>
            </div>
          )}
        </div>
      </div>

      {/* Create Story Modal */}
      <CreateStoryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onStoryCreated={(newStory) => {
          fetchStories();
          if (newStory?._id) {
            router.push(`/story/${newStory._id}`);
          }
        }}
      />
    </>
  );
}
