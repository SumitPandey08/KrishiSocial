'use client';

import React from 'react';
import { usePosts } from '@/context/PostContext';
import { useUser } from '@/context/AuthContext';
import { MoreHorizontal, Heart, MessageCircle, Share2, Bookmark, HelpCircle } from 'lucide-react';
import Image from 'next/image';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PostCardProps {
  postId: string;
  user: {
    id?: string;
    name: string;
    profilePhoto: string;
  };
  postImage?: string;
  caption: string;
  likes: number;
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
  commentsCount,
  uploadedAt,
  isLiked,
  postType = "update",
}: PostCardProps) {
  const { toggleLike } = usePosts();
  const { user: currentUser } = useUser();

  const handleLike = () => {
    toggleLike(postId);
  };

  const isQuestion = postType === 'question';

  return (
    <div className={cn(
      "bg-white mb-4 rounded-2xl overflow-hidden shadow-sm border border-gray-100 w-full",
      isQuestion && "border-l-4 border-l-[#2E7D32] bg-[#F9FEF9]"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#E8F5E9]">
            <img 
              src={user.profilePhoto || "https://via.placeholder.com/150"} 
              alt={user.name}
              className="object-cover w-full h-full"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-gray-900">{user.name}</span>
              {isQuestion && (
                <span className="bg-[#E8F5E9] text-[#2E7D32] text-[10px] font-black px-1.5 py-0.5 rounded">
                  QUESTION
                </span>
              )}
            </div>
            <span className="text-[10px] text-gray-500">Nearby • {uploadedAt}</span>
          </div>
        </div>
        <button className="p-1 text-gray-400">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Content */}
      {isQuestion ? (
        <div className="px-4 py-6 flex flex-col items-center gap-3">
          <HelpCircle size={32} className="text-[#2E7D32]" />
          <p className="text-lg font-bold text-gray-900 text-center leading-tight">
            {caption}
          </p>
          {postImage && postImage !== 'https://via.placeholder.com/400' && (
            <div className="w-full mt-2 rounded-xl overflow-hidden">
               <img src={postImage} alt="post" className="w-full h-auto" />
            </div>
          )}
        </div>
      ) : (
        <>
          {postImage && (
            <div className="relative aspect-square w-full">
               <img src={postImage} alt="post" className="object-cover w-full h-full" />
            </div>
          )}
          <div className="px-4 pt-3">
            <p className="text-sm text-gray-800">
              <span className="font-bold mr-2">{user.name}</span>
              {caption}
            </p>
          </div>
        </>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <button onClick={handleLike} className="transition-transform active:scale-125">
            <Heart 
              size={24} 
              className={cn(isLiked ? "fill-[#FF3040] text-[#FF3040]" : "text-gray-900")} 
            />
          </button>
          <button>
            <MessageCircle size={24} className="text-gray-900" />
          </button>
          <button>
            <Share2 size={24} className="text-gray-900" />
          </button>
        </div>
        <button>
          <Bookmark size={24} className="text-gray-900" />
        </button>
      </div>

      {/* Footer */}
      <div className="px-4 pb-4">
        <p className="font-bold text-sm text-gray-700">{likes.toLocaleString()} likes</p>
        {commentsCount > 0 && (
          <button className="mt-1 text-sm font-bold text-[#2E7D32]">
            View all {commentsCount} {isQuestion ? 'answers' : 'comments'}
          </button>
        )}
      </div>
    </div>
  );
}
