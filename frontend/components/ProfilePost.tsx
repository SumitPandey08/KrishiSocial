'use client';

import React from 'react';
import { Heart, MessageCircle } from 'lucide-react';

export interface ProfilePostProps {
  id: string;
  image?: string | null;
  likes: number;
  comments: number;
  postType?: string;
  caption?: string;
  username?: string;
}

export default function ProfilePost({ image, likes, comments }: ProfilePostProps) {
  return (
    <div className="relative aspect-square w-full overflow-hidden group cursor-pointer">
      <img 
        src={image || "https://via.placeholder.com/400"} 
        alt="post" 
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white">
        <div className="flex items-center gap-1">
          <Heart size={18} fill="currentColor" />
          <span className="text-sm font-bold">{likes}</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle size={18} fill="currentColor" />
          <span className="text-sm font-bold">{comments}</span>
        </div>
      </div>
    </div>
  );
}
