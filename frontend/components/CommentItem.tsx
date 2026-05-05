'use client';

import React from 'react';
import { Heart, MessageCircle, CheckCircle2, Trophy, MoreHorizontal, ArrowBigUp, ArrowBigDown } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CommentItemProps {
  id: string;
  user: {
    name: string;
    profilePhoto: string;
    role?: string;
  };
  comment: string;
  uploadedAt: string;
  likes: number;
  votesScore: number;
  userVote?: 'upvote' | 'downvote' | null;
  isLiked?: boolean;
  isBestAnswer?: boolean;
  isExpertVerified?: boolean;
  onLike?: () => void;
  onVote?: (type: 'upvote' | 'downvote') => void;
  onMarkBest?: () => void;
  onVerify?: () => void;
  canMarkBest?: boolean;
  canVerify?: boolean;
}

export default function CommentItem({
  user,
  comment,
  uploadedAt,
  likes,
  votesScore = 0,
  userVote = null,
  isLiked,
  isBestAnswer,
  isExpertVerified,
  onLike,
  onVote,
}: CommentItemProps) {
  return (
    <div className={cn(
      "p-4 rounded-2xl border border-gray-100 mb-2 transition-all",
      isBestAnswer ? "bg-[#FFF9F0] border-[#FFB02E]/30" : "bg-white"
    )}>
      <div className="flex items-start gap-4">
        {/* Voting Sidebar */}
        <div className="flex flex-col items-center gap-0.5 mt-1">
            <button 
                onClick={() => onVote?.('upvote')}
                className={cn(
                    "p-0.5 rounded hover:bg-orange-100 transition-colors",
                    userVote === 'upvote' ? "text-orange-600" : "text-gray-300"
                )}
            >
                <ArrowBigUp size={24} className={userVote === 'upvote' ? "fill-current" : ""} />
            </button>
            <span className={cn(
                "text-[10px] font-black",
                userVote === 'upvote' ? "text-orange-600" : userVote === 'downvote' ? "text-indigo-600" : "text-gray-500"
            )}>
                {votesScore}
            </span>
            <button 
                onClick={() => onVote?.('downvote')}
                className={cn(
                    "p-0.5 rounded hover:bg-indigo-100 transition-colors",
                    userVote === 'downvote' ? "text-indigo-600" : "text-gray-300"
                )}
            >
                <ArrowBigDown size={24} className={userVote === 'downvote' ? "fill-current" : ""} />
            </button>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
                <img src={user.profilePhoto || "https://via.placeholder.com/150"} alt={user.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900">{user.name}</span>
                  {user.role === 'expert' && (
                    <span className="bg-[#2E7D32] text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase">Expert</span>
                  )}
                </div>
                <span className="text-[10px] text-gray-400 font-medium">{uploadedAt}</span>
              </div>
            </div>

            {isExpertVerified && (
              <div className="text-[#2E7D32]">
                <CheckCircle2 size={16} fill="currentColor" className="text-white" />
              </div>
            )}
          </div>
          
          {isBestAnswer && (
            <div className="flex items-center gap-1 text-[#FFB02E] mb-2 mt-1">
              <Trophy size={12} fill="currentColor" />
              <span className="text-[10px] font-black uppercase tracking-wider">Best Answer</span>
            </div>
          )}

          <p className="text-sm text-gray-800 leading-relaxed">{comment}</p>
          
          <div className="flex items-center gap-4 mt-3">
            <button onClick={onLike} className="flex items-center gap-1.5 group">
              <Heart 
                size={14} 
                className={cn(isLiked ? "fill-[#FF3040] text-[#FF3040]" : "text-gray-400")} 
              />
              <span className="text-[10px] font-black text-gray-500">{likes}</span>
            </button>
            <button className="text-[10px] font-black text-gray-400 uppercase tracking-tight hover:text-gray-600 transition-colors">Reply</button>
          </div>
        </div>
      </div>
    </div>
  );
}
