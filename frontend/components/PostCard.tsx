'use client';

import React, { useState } from 'react';
import { usePosts } from '@/context/PostContext';
import { 
  MoreHorizontal, 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  ArrowBigUp, 
  ArrowBigDown,
  HelpCircle,
  CheckCircle2,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PostCardProps {
  postId: string;
  user: {
    id?: string;
    username: string;
    name: string;
    profilePhoto: string;
    role?: string;
  };
  postImage?: string;
  caption: string;
  likes: number;
  votesScore: number;
  userVote?: 'upvote' | 'downvote' | null;
  commentsCount: number;
  uploadedAt: string;
  isLiked: boolean;
  postType?: "update" | "question" | "community";
}

export default function PostCard({
  postId,
  user,
  postImage,
  caption,
  likes,
  votesScore = 0,
  userVote = null,
  commentsCount,
  uploadedAt,
  isLiked,
  postType = "update",
}: PostCardProps) {
  const { toggleLike, toggleVote } = usePosts();
  const [isAnimatingLike, setIsAnimatingLike] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAnimatingLike(true);
    toggleLike(postId);
    setTimeout(() => setIsAnimatingLike(false), 500);
  };

  const handleVote = (e: React.MouseEvent, type: 'upvote' | 'downvote') => {
    e.preventDefault();
    toggleVote(postId, type);
  };

  const isQuestion = postType === 'question';
  const isExpert = user.role === 'expert';

  return (
    <div className={cn(
      "group bg-white mb-4 rounded-3xl overflow-hidden border border-slate-200/70 shadow-xs hover:shadow-xl hover:border-emerald-200/80 transition-all duration-300 w-full",
      isQuestion && "bg-gradient-to-br from-emerald-50/40 via-white to-teal-50/30 border-l-4 border-l-emerald-600"
    )}>
      <div className="flex">
        {/* Voting Sidebar - Desktop Only */}
        <div className="hidden md:flex flex-col items-center gap-1.5 p-3 bg-slate-50/70 border-r border-slate-100 w-14">
          <button 
            onClick={(e) => handleVote(e, 'upvote')}
            className={cn(
              "p-1.5 rounded-xl transition-all active:scale-90 hover:bg-emerald-100/60 text-slate-400",
              userVote === 'upvote' && "text-emerald-600 bg-emerald-100"
            )}
          >
            <ArrowBigUp size={26} className={userVote === 'upvote' ? "fill-current text-emerald-600" : ""} />
          </button>
          <span className={cn(
            "text-xs font-black py-0.5",
            userVote === 'upvote' ? "text-emerald-600" : userVote === 'downvote' ? "text-rose-600" : "text-slate-700"
          )}>
            {votesScore}
          </span>
          <button 
            onClick={(e) => handleVote(e, 'downvote')}
            className={cn(
              "p-1.5 rounded-xl transition-all active:scale-90 hover:bg-rose-100/60 text-slate-400",
              userVote === 'downvote' && "text-rose-600 bg-rose-100"
            )}
          >
            <ArrowBigDown size={26} className={userVote === 'downvote' ? "fill-current text-rose-600" : ""} />
          </button>
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between p-4 pb-3">
            <Link href={`/profile/${user.username}`} className="flex items-center gap-3 group/author min-w-0">
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white ring-2 ring-emerald-100 shadow-xs transition-transform group-hover/author:scale-105">
                  <img 
                    src={user.profilePhoto || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80"} 
                    alt={user.username}
                    className="object-cover w-full h-full"
                  />
                </div>
                {isExpert && (
                  <div className="absolute -bottom-0.5 -right-0.5 bg-emerald-600 text-white rounded-full p-0.5 border-2 border-white shadow-xs">
                    <CheckCircle2 size={10} fill="currentColor" className="text-white" />
                  </div>
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-sm text-slate-900 truncate group-hover/author:text-emerald-700">{user.name}</span>
                  {isExpert && (
                    <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                      Expert
                    </span>
                  )}
                  {isQuestion && !isExpert && (
                    <span className="bg-amber-100 text-amber-800 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                      Question
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-400 font-semibold truncate">@{user.username} • {uploadedAt}</span>
              </div>
            </Link>

            <button className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
              <MoreHorizontal size={18} />
            </button>
          </div>

          {/* Content */}
          <Link href={`/post/${postId}`} className="block">
            {isQuestion ? (
              <div className="px-4 pb-3">
                <div className="flex items-start gap-3 bg-white p-4 rounded-2xl border border-emerald-100/80 mb-3 shadow-xs">
                  <div className="bg-emerald-100 text-emerald-700 p-2 rounded-xl shrink-0">
                    <HelpCircle size={20} />
                  </div>
                  <p className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                    {caption}
                  </p>
                </div>
                {postImage && (
                  <div className="relative w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/60 max-h-[420px]">
                    <img src={postImage} alt="Question media" className="w-full h-auto max-h-[420px] object-cover" />
                  </div>
                )}
              </div>
            ) : (
              <div className="pb-3">
                <div className="px-4 mb-3">
                  <p className="text-sm sm:text-[15px] font-medium text-slate-800 leading-relaxed">
                    {caption}
                  </p>
                </div>
                {postImage && (
                  <div className="relative w-full max-h-[500px] overflow-hidden bg-slate-900">
                    <img src={postImage} alt="Post media" className="w-full h-full max-h-[500px] object-cover" />
                  </div>
                )}
              </div>
            )}
          </Link>

          {/* Action Bar */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3 sm:gap-6">
              {/* Mobile Vote Controls */}
              <div className="flex md:hidden items-center bg-white rounded-full border border-slate-200/80 px-2 py-0.5 shadow-xs">
                <button 
                  onClick={(e) => handleVote(e, 'upvote')}
                  className={cn("p-1 text-slate-400", userVote === 'upvote' && "text-emerald-600")}
                >
                  <ArrowBigUp size={20} className={userVote === 'upvote' ? "fill-current" : ""} />
                </button>
                <span className="text-[11px] font-black px-1.5 text-slate-800">{votesScore}</span>
                <button 
                  onClick={(e) => handleVote(e, 'downvote')}
                  className={cn("p-1 text-slate-400", userVote === 'downvote' && "text-rose-600")}
                >
                  <ArrowBigDown size={20} className={userVote === 'downvote' ? "fill-current" : ""} />
                </button>
              </div>

              <button 
                onClick={handleLike} 
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-rose-50 transition-all active:scale-95 text-slate-600 hover:text-rose-600"
              >
                <Heart 
                  size={18} 
                  className={cn(
                    "transition-all",
                    isLiked ? "fill-rose-500 text-rose-500 scale-110" : "",
                    isAnimatingLike && "animate-ping"
                  )} 
                />
                <span className="text-xs font-black">{likes}</span>
              </button>

              <Link 
                href={`/post/${postId}`} 
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-slate-100 transition-all text-slate-600"
              >
                <MessageCircle size={18} />
                <span className="text-xs font-black">{commentsCount}</span>
              </Link>

              <button className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-600">
                <Share2 size={18} />
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-600">
                <Bookmark size={18} />
              </button>
              <Link 
                href={`/post/${postId}`}
                className="hidden sm:inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 uppercase tracking-wider bg-emerald-50 hover:bg-emerald-600 hover:text-white px-3 py-1.5 rounded-full border border-emerald-200/60 transition-all shadow-xs"
              >
                View <ExternalLink size={10} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
