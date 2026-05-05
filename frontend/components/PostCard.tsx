'use client';

import React, { useState } from 'react';
import { usePosts } from '@/context/PostContext';
import { useUser } from '@/context/AuthContext';
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
  ExternalLink
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
      "group bg-white mb-4 rounded-3xl overflow-hidden border border-gray-100 transition-all hover:border-gray-200 hover:shadow-xl hover:shadow-gray-100/50 w-full",
      isQuestion && "bg-[#F9FEF9] border-l-4 border-l-[#2E7D32]"
    )}>
      <div className="flex">
        {/* Voting Sidebar - Desktop Only */}
        <div className="hidden md:flex flex-col items-center gap-1 p-3 bg-gray-50/50 border-r border-gray-50/50 w-14">
            <button 
                onClick={(e) => handleVote(e, 'upvote')}
                className={cn(
                    "p-1.5 rounded-xl transition-all active:scale-90",
                    userVote === 'upvote' ? "text-orange-600 bg-orange-50" : "text-gray-400 hover:bg-gray-100"
                )}
            >
                <ArrowBigUp size={28} className={userVote === 'upvote' ? "fill-current" : ""} />
            </button>
            <span className={cn(
                "text-xs font-black py-0.5",
                userVote === 'upvote' ? "text-orange-600" : userVote === 'downvote' ? "text-indigo-600" : "text-gray-700"
            )}>
                {votesScore}
            </span>
            <button 
                onClick={(e) => handleVote(e, 'downvote')}
                className={cn(
                    "p-1.5 rounded-xl transition-all active:scale-90",
                    userVote === 'downvote' ? "text-indigo-600 bg-indigo-50" : "text-gray-400 hover:bg-gray-100"
                )}
            >
                <ArrowBigDown size={28} className={userVote === 'downvote' ? "fill-current" : ""} />
            </button>
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between p-4">
            <Link href={`/profile/${user.username}`} className="flex items-center gap-3 group/author">
              <div className="relative">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white ring-2 ring-gray-100 shadow-sm transition-transform group-hover/author:scale-105">
                    <img 
                    src={user.profilePhoto || "https://via.placeholder.com/150"} 
                    alt={user.username}
                    className="object-cover w-full h-full"
                    />
                </div>
                {isExpert && (
                    <div className="absolute -bottom-0.5 -right-0.5 bg-[#2E7D32] text-white rounded-full p-0.5 border-2 border-white shadow-sm">
                        <CheckCircle2 size={10} fill="currentColor" className="text-white" />
                    </div>
                )}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-gray-900 group-hover/author:underline">{user.name}</span>
                  {isExpert && (
                    <span className="bg-[#E8F5E9] text-[#2E7D32] text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-widest">Expert</span>
                  )}
                  {isQuestion && !isExpert && (
                    <span className="bg-orange-50 text-orange-600 text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-widest">Query</span>
                  )}
                </div>
                <span className="text-[10px] text-gray-400 font-medium">{uploadedAt} • Nearby</span>
              </div>
            </Link>
            <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors">
              <MoreHorizontal size={20} />
            </button>
          </div>

          {/* Content */}
          <Link href={`/post/${postId}`} className="block">
            {isQuestion ? (
                <div className="px-4 pb-4">
                   <div className="flex items-start gap-3 bg-white/50 p-4 rounded-2xl border border-gray-100/50 mb-3 group-hover:bg-white transition-colors">
                      <div className="bg-orange-100 p-2 rounded-xl flex-shrink-0 text-orange-600">
                         <HelpCircle size={20} />
                      </div>
                      <p className="text-base font-bold text-gray-900 leading-snug">
                        {caption}
                      </p>
                   </div>
                   {postImage && (
                    <div className="relative w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 group-hover:shadow-lg group-hover:shadow-gray-200/50 transition-all duration-500">
                        <img src={postImage} alt="question" className="w-full h-auto max-h-[400px] object-cover" />
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                    </div>
                   )}
                </div>
            ) : (
                <div className="pb-4">
                  <div className="px-4 mb-4">
                    <p className="text-[15px] text-gray-800 leading-relaxed">
                        {caption}
                    </p>
                  </div>
                  {postImage && (
                    <div className="relative aspect-auto w-full max-h-[600px] overflow-hidden bg-gray-50 group-hover:brightness-105 transition-all duration-500">
                        <img src={postImage} alt="post" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 ring-1 ring-inset ring-black/5" />
                    </div>
                  )}
                </div>
            )}
          </Link>

          {/* Action Bar */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-50 bg-gray-50/30">
            <div className="flex items-center gap-2 md:gap-6">
              {/* Mobile Vote Controls */}
              <div className="flex md:hidden items-center bg-white rounded-full border border-gray-100 p-0.5 shadow-sm">
                 <button 
                    onClick={(e) => handleVote(e, 'upvote')}
                    className={cn(
                        "p-1 rounded-full transition-colors",
                        userVote === 'upvote' ? "text-orange-600 bg-orange-50" : "text-gray-400"
                    )}
                 >
                    <ArrowBigUp size={22} className={userVote === 'upvote' ? "fill-current" : ""} />
                 </button>
                 <span className="text-[10px] font-black px-1 min-w-[20px] text-center">{votesScore}</span>
                 <button 
                    onClick={(e) => handleVote(e, 'downvote')}
                    className={cn(
                        "p-1 rounded-full transition-colors",
                        userVote === 'downvote' ? "text-indigo-600 bg-indigo-50" : "text-gray-400"
                    )}
                 >
                    <ArrowBigDown size={22} className={userVote === 'downvote' ? "fill-current" : ""} />
                 </button>
              </div>

              <button 
                onClick={handleLike} 
                className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white hover:shadow-sm transition-all active:scale-110"
              >
                <Heart 
                  size={20} 
                  className={cn(
                    "transition-all",
                    isLiked ? "fill-[#FF3040] text-[#FF3040] scale-110" : "text-gray-600",
                    isAnimatingLike && "animate-ping"
                  )} 
                />
                <span className="text-xs font-black text-gray-500">{likes}</span>
              </button>

              <Link 
                href={`/post/${postId}`} 
                className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white hover:shadow-sm transition-all"
              >
                <MessageCircle size={20} className="text-gray-600" />
                <span className="text-xs font-black text-gray-500">{commentsCount}</span>
              </Link>

              <button className="p-2 hover:bg-white hover:shadow-sm rounded-full transition-all">
                <Share2 size={20} className="text-gray-600" />
              </button>
            </div>
            
            <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-white hover:shadow-sm rounded-full transition-all">
                    <Bookmark size={20} className="text-gray-600" />
                </button>
                <Link 
                    href={`/post/${postId}`}
                    className="hidden md:flex items-center gap-1.5 text-[10px] font-black text-[#2E7D32] uppercase tracking-wider bg-white px-3 py-1.5 rounded-full border border-gray-100 hover:bg-[#2E7D32] hover:text-white transition-all shadow-sm group/view"
                >
                    View Details
                    <ExternalLink size={10} className="group-hover/view:translate-x-0.5 transition-transform" />
                </Link>
            </div>
          </div>

          {/* Preview Footer */}
          {commentsCount > 0 && (
            <div className="px-4 py-3 bg-gray-50/20">
               <Link href={`/post/${postId}`} className="text-xs font-bold text-gray-400 hover:text-[#2E7D32] transition-colors flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                  Show all {commentsCount} {isQuestion ? 'answers' : 'comments'}
               </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
