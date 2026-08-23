'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Clock,
  Globe,
  Users,
  CheckCircle2,
  AlertCircle,
  Share2,
  Loader2,
} from 'lucide-react';
import {
  getStoryById,
  getFeedStories,
  getStoriesByUserId,
  markStoryAsViewed,
  reactToStory,
  deleteStory,
  StoryItem,
  FeedStoryGroup,
} from '@/services/storyService';
import { useUser } from '@/context/AuthContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Link from 'next/link';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const STORY_DURATION_MS = 5000;
const QUICK_REACTIONS = ['❤️', '🙌', '🔥', '🌾', '👏', '😂', '😍', '🚜'];

function formatTimeAgo(dateStr: string) {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  } catch {
    return '';
  }
}

interface StoryViewerProps {
  initialStoryId: string;
}

export default function StoryViewer({ initialStoryId }: StoryViewerProps) {
  const router = useRouter();
  const { user: currentUser } = useUser();

  const [currentStoryId, setCurrentStoryId] = useState<string>(initialStoryId);
  const [currentStory, setCurrentStory] = useState<StoryItem | null>(null);
  const [userStories, setUserStories] = useState<StoryItem[]>([]);
  const [allStoryGroups, setAllStoryGroups] = useState<FeedStoryGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Playback state
  const [progress, setProgress] = useState(0); // 0 to 100
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showViewersModal, setShowViewersModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [reactionBurst, setReactionBurst] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const holdStartRef = useRef<number | null>(null);

  // Load story data by ID
  const fetchCurrentStory = useCallback(async (storyId: string) => {
    setLoading(true);
    setError(null);
    setProgress(0);

    try {
      const story = await getStoryById(storyId);
      setCurrentStory(story);

      // Automatically mark as viewed if not own story
      if (!story.isOwnStory) {
        markStoryAsViewed(story._id).catch(() => {});
      }

      // Fetch user's story sequence if available
      const userId = story.user?._id;
      if (userId) {
        try {
          const userStoriesData = await getStoriesByUserId(userId);
          if (userStoriesData && Array.isArray(userStoriesData.stories) && userStoriesData.stories.length > 0) {
            setUserStories(userStoriesData.stories);
          } else {
            setUserStories([story]);
          }
        } catch {
          setUserStories([story]);
        }
      } else {
        setUserStories([story]);
      }
    } catch (err: any) {
      console.error('Failed to load story by ID:', err);
      setError(err?.response?.data?.message || 'Story not found or has expired');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch feed stories in background for next/prev user navigation
  useEffect(() => {
    getFeedStories()
      .then((groups) => {
        if (Array.isArray(groups)) {
          setAllStoryGroups(groups);
        }
      })
      .catch((err) => console.error('Error fetching feed stories:', err));
  }, []);

  useEffect(() => {
    fetchCurrentStory(currentStoryId);
  }, [currentStoryId, fetchCurrentStory]);

  // Refs to avoid stale closures in callbacks and timer
  const userStoriesRef = useRef(userStories);
  const activeIndexRef = useRef(0);
  const allStoryGroupsRef = useRef(allStoryGroups);
  const currentStoryRef = useRef(currentStory);

  // Current story index in userStories
  const currentStoryIndex = userStories.findIndex((s) => s._id === currentStory?._id);
  const activeIndex = currentStoryIndex >= 0 ? currentStoryIndex : 0;

  useEffect(() => {
    userStoriesRef.current = userStories;
    activeIndexRef.current = activeIndex;
    allStoryGroupsRef.current = allStoryGroups;
    currentStoryRef.current = currentStory;
  }, [userStories, activeIndex, allStoryGroups, currentStory]);

  // Next Story Handler
  const goToNextStory = useCallback(() => {
    const stories = userStoriesRef.current;
    const idx = activeIndexRef.current;
    const groups = allStoryGroupsRef.current;
    const story = currentStoryRef.current;

    if (stories.length > 0 && idx < stories.length - 1) {
      // Go to next story of the same user
      const nextStory = stories[idx + 1];
      setCurrentStoryId(nextStory._id);
      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', `/story/${nextStory._id}`);
      }
      return;
    }

    // Otherwise, find the next user in allStoryGroups
    if (groups.length > 0 && story?.user?._id) {
      const currentGroupIdx = groups.findIndex(
        (g) => g.user?._id === story.user?._id
      );

      if (currentGroupIdx !== -1 && currentGroupIdx < groups.length - 1) {
        const nextGroup = groups[currentGroupIdx + 1];
        if (nextGroup.stories && nextGroup.stories.length > 0) {
          const firstUnseen = nextGroup.stories.find((s) => !s.isViewed) || nextGroup.stories[0];
          setCurrentStoryId(firstUnseen._id);
          if (typeof window !== 'undefined') {
            window.history.replaceState(null, '', `/story/${firstUnseen._id}`);
          }
          return;
        }
      }
    }

    // No next stories left - exit back to home
    router.push('/');
  }, [router]);

  // Previous Story Handler
  const goToPreviousStory = useCallback(() => {
    const stories = userStoriesRef.current;
    const idx = activeIndexRef.current;
    const groups = allStoryGroupsRef.current;
    const story = currentStoryRef.current;

    if (idx > 0) {
      // Go to previous story of same user
      const prevStory = stories[idx - 1];
      setCurrentStoryId(prevStory._id);
      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', `/story/${prevStory._id}`);
      }
      return;
    }

    // Go to previous user's last story
    if (groups.length > 0 && story?.user?._id) {
      const currentGroupIdx = groups.findIndex(
        (g) => g.user?._id === story.user?._id
      );

      if (currentGroupIdx > 0) {
        const prevGroup = groups[currentGroupIdx - 1];
        if (prevGroup.stories && prevGroup.stories.length > 0) {
          const lastStory = prevGroup.stories[prevGroup.stories.length - 1];
          setCurrentStoryId(lastStory._id);
          if (typeof window !== 'undefined') {
            window.history.replaceState(null, '', `/story/${lastStory._id}`);
          }
          return;
        }
      }
    }

    // Already at the very first story, reset progress to 0
    setProgress(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  }, []);

  // Timer & Progress management for images
  useEffect(() => {
    if (loading || isPaused || showViewersModal || showDeleteConfirm || !currentStory) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    if (currentStory.media.type === 'video') {
      // Video manages its own progress via timeupdate
      return;
    }

    const intervalStep = 50; // ms
    const increment = (intervalStep / STORY_DURATION_MS) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const nextVal = prev + increment;
        if (nextVal >= 100) {
          clearInterval(timer);
          // Defer goToNextStory to next event tick so it runs outside of setProgress/render
          setTimeout(() => {
            goToNextStory();
          }, 0);
          return 100;
        }
        return nextVal;
      });
    }, intervalStep);

    timerRef.current = timer;

    return () => {
      clearInterval(timer);
    };
  }, [loading, isPaused, showViewersModal, showDeleteConfirm, currentStory, currentStoryId, goToNextStory]);

  // Video timeupdate handler
  const handleVideoTimeUpdate = () => {
    if (!videoRef.current) return;
    const duration = videoRef.current.duration;
    const current = videoRef.current.currentTime;
    if (duration > 0) {
      const p = (current / duration) * 100;
      setProgress(p);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        goToNextStory();
      } else if (e.key === 'ArrowLeft') {
        goToPreviousStory();
      } else if (e.key === 'Escape') {
        router.push('/');
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPaused((p) => !p);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNextStory, goToPreviousStory, router]);

  // Handle Touch / Mouse Hold to Pause
  const handlePointerDown = () => {
    holdStartRef.current = Date.now();
    setIsPaused(true);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const handlePointerUp = (clickZone: 'left' | 'right') => {
    const holdDuration = Date.now() - (holdStartRef.current || 0);
    setIsPaused(false);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }

    // If tap was brief (< 250ms), handle zone click navigation
    if (holdDuration < 250) {
      if (clickZone === 'left') {
        goToPreviousStory();
      } else {
        goToNextStory();
      }
    }
  };

  // Reactions
  const handleReaction = async (emoji: string) => {
    if (!currentStory) return;
    const isRemoving = currentStory.myReaction === emoji;
    const targetEmoji = isRemoving ? null : emoji;

    // Trigger visual pop animation
    if (targetEmoji) {
      setReactionBurst(targetEmoji);
      setTimeout(() => setReactionBurst(null), 1200);
    }

    try {
      const res = await reactToStory(currentStory._id, targetEmoji);
      setCurrentStory((prev) =>
        prev
          ? {
              ...prev,
              myReaction: res.myReaction,
              reactionsCount: res.reactionsCount,
            }
          : null
      );
    } catch (err) {
      console.error('Failed to react to story:', err);
    }
  };

  // Delete Story
  const handleDeleteStory = async () => {
    if (!currentStory) return;
    setIsDeleting(true);
    try {
      await deleteStory(currentStory._id);
      setShowDeleteConfirm(false);
      goToNextStory();
    } catch (err) {
      console.error('Failed to delete story:', err);
      alert('Failed to delete story. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const isOwner = Boolean(
    currentStory?.isOwnStory ||
      (currentUser && currentStory?.user?._id && currentUser.id === currentStory.user._id)
  );

  return (
    <div className="fixed inset-0 z-50 bg-black text-white flex items-center justify-center select-none overflow-hidden">
      {/* Desktop Left & Right navigation triggers */}
      <button
        type="button"
        onClick={goToPreviousStory}
        aria-label="Previous story"
        className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md items-center justify-center transition-all hover:scale-110 z-40 cursor-pointer"
      >
        <ChevronLeft size={28} />
      </button>

      <button
        type="button"
        onClick={goToNextStory}
        aria-label="Next story"
        className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md items-center justify-center transition-all hover:scale-110 z-40 cursor-pointer"
      >
        <ChevronRight size={28} />
      </button>

      {/* Main Story Container - 9:16 Aspect Ratio / Mobile Reel size */}
      <div className="relative w-full max-w-md h-full md:h-[92vh] md:max-h-[860px] md:rounded-3xl bg-neutral-950 overflow-hidden shadow-2xl flex flex-col justify-between">
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-neutral-950 flex flex-col items-center justify-center gap-3 z-30">
            <Loader2 size={36} className="text-[#2E7D32] animate-spin" />
            <p className="text-xs font-bold text-gray-400">Loading Story...</p>
          </div>
        )}

        {/* Error Overlay */}
        {error && (
          <div className="absolute inset-0 bg-neutral-950 flex flex-col items-center justify-center p-6 text-center gap-4 z-30">
            <div className="w-16 h-16 rounded-full bg-red-950/50 text-red-400 flex items-center justify-center">
              <AlertCircle size={32} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white mb-1">Story Unavailable</h3>
              <p className="text-xs text-gray-400 max-w-xs">{error}</p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-bold transition-colors"
            >
              Back to Home
            </button>
          </div>
        )}

        {/* Top Segmented Progress Bars */}
        <div className="absolute top-0 left-0 right-0 p-3 pt-4 z-30 flex gap-1.5 pointer-events-none">
          {userStories.length > 0 ? (
            userStories.map((s, idx) => {
              let segmentProgress = 0;
              if (idx < activeIndex) segmentProgress = 100;
              else if (idx === activeIndex) segmentProgress = progress;
              else segmentProgress = 0;

              return (
                <div
                  key={s._id}
                  className="flex-1 h-1 bg-white/25 rounded-full overflow-hidden backdrop-blur-xs"
                >
                  <div
                    className="h-full bg-white transition-all ease-linear rounded-full"
                    style={{
                      width: `${segmentProgress}%`,
                      transitionDuration: isPaused ? '0ms' : '50ms',
                    }}
                  />
                </div>
              );
            })
          ) : (
            <div className="flex-1 h-1 bg-white/25 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all ease-linear rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>

        {/* Header Bar */}
        <div className="relative z-30 px-4 pt-7 pb-3 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent">
          <div className="flex items-center gap-2.5">
            <Link
              href={currentStory?.user?.username ? `/profile/${currentStory.user.username}` : '#'}
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/80 bg-neutral-800 shrink-0 hover:opacity-90 transition-opacity"
            >
              <img
                src={
                  currentStory?.user?.profilePicture ||
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&q=80'
                }
                alt={currentStory?.user?.name || 'User'}
                className="w-full h-full object-cover"
              />
            </Link>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <Link
                  href={currentStory?.user?.username ? `/profile/${currentStory.user.username}` : '#'}
                  className="text-xs font-black text-white hover:underline truncate max-w-[140px]"
                >
                  {currentStory?.user?.name || currentStory?.user?.username || 'Farmer'}
                </Link>
                {currentStory?.user?.isVerified && (
                  <CheckCircle2 size={13} className="text-emerald-400 shrink-0 fill-current text-white" />
                )}
                <span className="text-[10px] text-white/60 font-medium">
                  • {currentStory?.createdAt ? formatTimeAgo(currentStory.createdAt) : ''}
                </span>
              </div>

              <div className="flex items-center gap-1 text-[10px] text-white/70 font-medium">
                {currentStory?.privacy === 'followers' ? (
                  <>
                    <Users size={10} />
                    <span>Followers</span>
                  </>
                ) : (
                  <>
                    <Globe size={10} />
                    <span>Public</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons on header */}
          <div className="flex items-center gap-1.5">
            {currentStory?.media?.type === 'video' && (
              <button
                type="button"
                onClick={() => setIsMuted((m) => !m)}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
                className="p-2 text-white/80 hover:text-white bg-black/30 hover:bg-black/50 rounded-full backdrop-blur-md transition-colors"
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsPaused((p) => !p)}
              aria-label={isPaused ? 'Resume' : 'Pause'}
              className="p-2 text-white/80 hover:text-white bg-black/30 hover:bg-black/50 rounded-full backdrop-blur-md transition-colors"
            >
              {isPaused ? <Play size={16} /> : <Pause size={16} />}
            </button>

            {isOwner && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                aria-label="Delete story"
                className="p-2 text-red-400 hover:text-red-300 bg-black/30 hover:bg-red-950/60 rounded-full backdrop-blur-md transition-colors"
              >
                <Trash2 size={16} />
              </button>
            )}

            <button
              type="button"
              onClick={() => router.push('/')}
              aria-label="Close"
              className="p-2 text-white hover:text-white/80 bg-black/30 hover:bg-black/50 rounded-full backdrop-blur-md transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Media Player Area with Left/Right Touch Zones */}
        <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
          {currentStory && (
            <>
              {currentStory.media.type === 'video' ? (
                <video
                  ref={videoRef}
                  src={currentStory.media.url}
                  poster={currentStory.media.thumbnail}
                  autoPlay
                  playsInline
                  muted={isMuted}
                  onTimeUpdate={handleVideoTimeUpdate}
                  onEnded={goToNextStory}
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  src={currentStory.media.url}
                  alt={currentStory.caption || 'Story media'}
                  className="w-full h-full object-contain pointer-events-none"
                />
              )}
            </>
          )}

          {/* Left Touch / Click Zone (Previous) */}
          <div
            onPointerDown={handlePointerDown}
            onPointerUp={() => handlePointerUp('left')}
            className="absolute left-0 top-0 bottom-0 w-1/3 z-20 cursor-pointer active:bg-white/5 transition-colors"
          />

          {/* Right Touch / Click Zone (Next) */}
          <div
            onPointerDown={handlePointerDown}
            onPointerUp={() => handlePointerUp('right')}
            className="absolute right-0 top-0 bottom-0 w-2/3 z-20 cursor-pointer active:bg-white/5 transition-colors"
          />

          {/* Pause Indicator overlay */}
          {isPaused && (
            <div className="absolute z-20 pointer-events-none bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md flex items-center gap-1.5 text-xs font-bold text-white/90">
              <Pause size={14} /> Paused
            </div>
          )}

          {/* Floating Reaction Burst Animation */}
          {reactionBurst && (
            <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
              <div className="text-7xl animate-bounce drop-shadow-2xl">{reactionBurst}</div>
            </div>
          )}
        </div>

        {/* Bottom Area: Caption & Footer Controls */}
        <div className="relative z-30 p-4 pt-2 bg-gradient-to-t from-black/90 via-black/60 to-transparent space-y-3">
          {/* Caption text */}
          {currentStory?.caption && (
            <div className="bg-black/50 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-xs font-medium text-white/90 leading-relaxed max-h-24 overflow-y-auto">
              <p>{currentStory.caption}</p>
            </div>
          )}

          {/* Footer Controls: Reactions for viewers, Viewer Drawer button for owner */}
          {isOwner ? (
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setShowViewersModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white/15 hover:bg-white/25 rounded-full backdrop-blur-md text-xs font-bold text-white transition-colors"
              >
                <Eye size={16} />
                <span>Seen by {currentStory?.viewsCount || 0}</span>
                {currentStory?.reactionsCount ? (
                  <span className="ml-1 px-1.5 py-0.5 bg-emerald-500 rounded-full text-[10px] font-black">
                    {currentStory.reactionsCount} reactions
                  </span>
                ) : null}
              </button>

              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText?.(window.location.href);
                  alert('Story link copied to clipboard!');
                }}
                className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md text-white transition-colors"
                title="Share Story"
              >
                <Share2 size={16} />
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Emoji quick reaction strip */}
              <div className="flex items-center justify-between gap-1 px-1 overflow-x-auto no-scrollbar">
                {QUICK_REACTIONS.map((emoji) => {
                  const isSelected = currentStory?.myReaction === emoji;
                  return (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => handleReaction(emoji)}
                      className={cn(
                        'w-9 h-9 rounded-full flex items-center justify-center text-lg transition-transform hover:scale-125 active:scale-95 bg-white/10 hover:bg-white/20 backdrop-blur-md',
                        isSelected && 'ring-2 ring-emerald-400 bg-emerald-500/30 scale-110'
                      )}
                      title={`React with ${emoji}`}
                    >
                      {emoji}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Viewers Bottom Sheet Modal (For Story Owner) */}
        {showViewersModal && (
          <div className="absolute inset-0 z-40 bg-black/80 backdrop-blur-md flex flex-col justify-end animate-in fade-in duration-200">
            <div className="bg-neutral-900 border-t border-white/10 rounded-t-3xl max-h-[70vh] flex flex-col p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Eye size={18} className="text-emerald-400" />
                  <h3 className="text-sm font-black text-white">
                    Story Viewers ({currentStory?.viewers?.length || currentStory?.viewsCount || 0})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowViewersModal(false)}
                  className="p-1.5 text-white/60 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Viewers List */}
              <div className="overflow-y-auto flex-1 space-y-2.5 max-h-[45vh]">
                {currentStory?.viewers && currentStory.viewers.length > 0 ? (
                  currentStory.viewers.map((viewerItem, idx) => {
                    const viewerUser = typeof viewerItem.user === 'object' ? viewerItem.user : null;
                    const viewerName = viewerUser?.name || viewerUser?.username || 'Farmer';
                    const viewerPhoto =
                      viewerUser?.profilePicture ||
                      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&q=80';

                    // Find if this user reacted
                    const reaction = currentStory.reactions?.find((r) => {
                      const rId = typeof r.user === 'object' ? r.user?._id : r.user;
                      const vId = viewerUser?._id;
                      return rId && vId && rId.toString() === vId.toString();
                    });

                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded-2xl hover:bg-white/5 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={viewerPhoto}
                            alt={viewerName}
                            className="w-9 h-9 rounded-full object-cover border border-white/20"
                          />
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-white">{viewerName}</span>
                            <span className="text-[10px] text-white/50">
                              {viewerItem.viewedAt ? formatTimeAgo(viewerItem.viewedAt) : 'Seen'}
                            </span>
                          </div>
                        </div>

                        {reaction && (
                          <div className="text-xl bg-white/10 w-8 h-8 rounded-full flex items-center justify-center">
                            {reaction.emoji}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="py-8 text-center text-xs text-white/50">
                    No viewers yet. Check back soon!
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-200">
            <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 text-center max-w-xs space-y-4 shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-red-950/80 text-red-400 flex items-center justify-center mx-auto">
                <Trash2 size={24} />
              </div>
              <div>
                <h4 className="text-sm font-black text-white">Delete this story?</h4>
                <p className="text-xs text-white/60 mt-1">This action cannot be undone.</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteStory}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  {isDeleting ? <Loader2 size={14} className="animate-spin" /> : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
