'use client';

import React, { useState } from 'react';
import { X, Image as ImageIcon, Video, MapPin, Smile, Globe, Lock, Users, ChevronDown } from 'lucide-react';
import { usePosts } from '@/context/PostContext';
import { useUser } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function CreatePostPage() {
  const [content, setContent] = useState('');
  const [privacy, setPrivacy] = useState<"public" | "private" | "followers">("public");
  const [postType, setPostType] = useState<"update" | "question">("update");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  const handlePost = async () => {
    if (!content) return;
    setIsLoading(true);
    // Simulating post creation for now
    setTimeout(() => {
      setIsLoading(false);
      router.push('/');
    }, 1500);
  };

  return (
    <div className="max-w-screen-md mx-auto min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-gray-100 sticky top-0 bg-white z-50">
        <button onClick={() => router.back()} className="p-1 text-gray-900">
          <X size={24} />
        </button>
        <h1 className="text-lg font-black text-gray-900">New Post</h1>
        <button 
          onClick={handlePost}
          disabled={!content || isLoading}
          className={cn(
            "px-5 py-1.5 rounded-full text-sm font-black transition-all",
            content && !isLoading ? "bg-[#2E7D32] text-white" : "bg-gray-100 text-gray-400"
          )}
        >
          {isLoading ? "..." : "Post"}
        </button>
      </div>

      <div className="p-4">
        {/* User Info */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-100 bg-gray-50">
            <img 
              src={user?.profilePicture || 'https://via.placeholder.com/150'} 
              alt="user" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-bold text-gray-900">{user?.name || 'Farmer'}</span>
            <div className="flex gap-2">
              <button 
                onClick={() => setPrivacy(p => p === 'public' ? 'private' : 'public')}
                className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded text-[10px] font-bold text-gray-500 uppercase"
              >
                {privacy === 'public' ? <Globe size={10} /> : <Lock size={10} />}
                {privacy}
                <ChevronDown size={10} />
              </button>
              <button 
                onClick={() => setPostType(t => t === 'update' ? 'question' : 'update')}
                className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded text-[10px] font-bold text-gray-500 uppercase"
              >
                {postType}
                <ChevronDown size={10} />
              </button>
            </div>
          </div>
        </div>

        {/* Input */}
        <textarea
          autoFocus
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={postType === 'question' ? "What is your question for the community?" : "What's on your mind?"}
          className="w-full min-h-[200px] text-lg font-medium text-gray-900 outline-none resize-none placeholder:text-gray-300"
        />

        {/* Toolbar */}
        <div className="fixed bottom-0 left-0 right-0 max-w-screen-md mx-auto bg-white border-t border-gray-100 p-4">
          <div className="flex items-center justify-around">
            <button className="flex flex-col items-center gap-1 text-[#2E7D32]">
              <div className="w-10 h-10 bg-[#F1F8F1] rounded-xl flex items-center justify-center">
                <ImageIcon size={22} />
              </div>
              <span className="text-[10px] font-black uppercase">Photo</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-[#2E7D32]">
              <div className="w-10 h-10 bg-[#F1F8F1] rounded-xl flex items-center justify-center">
                <Video size={22} />
              </div>
              <span className="text-[10px] font-black uppercase">Video</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-[#2E7D32]">
              <div className="w-10 h-10 bg-[#F1F8F1] rounded-xl flex items-center justify-center">
                <MapPin size={22} />
              </div>
              <span className="text-[10px] font-black uppercase">Location</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-[#2E7D32]">
              <div className="w-10 h-10 bg-[#F1F8F1] rounded-xl flex items-center justify-center">
                <Smile size={22} />
              </div>
              <span className="text-[10px] font-black uppercase">Feeling</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
