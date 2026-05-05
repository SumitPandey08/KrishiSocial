'use client';

import React, { useState, useRef } from 'react';
import { X, Image as ImageIcon, Video, MapPin, Smile, Globe, Lock, Users, ChevronDown, Trash2, Loader2 } from 'lucide-react';
import { useUser } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import AppLayout from '@/components/AppLayout';
import { createPost } from '@/services/postService';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function CreatePostContent() {
  const [content, setContent] = useState('');
  const [privacy, setPrivacy] = useState<"public" | "private" | "followers">("public");
  const [postType, setPostType] = useState<"update" | "question">("update");
  const [isLoading, setIsLoading] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useUser();
  const router = useRouter();

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Limit to 10 files
    const newFiles = [...mediaFiles, ...files].slice(0, 10);
    setMediaFiles(newFiles);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setMediaPreviews([...mediaPreviews, ...newPreviews].slice(0, 10));
  };

  const removeMedia = (index: number) => {
    const newFiles = [...mediaFiles];
    newFiles.splice(index, 1);
    setMediaFiles(newFiles);

    const newPreviews = [...mediaPreviews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setMediaPreviews(newPreviews);
  };

  const handlePost = async () => {
    if (!content && mediaFiles.length === 0) return;
    
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('caption', content);
      formData.append('postType', postType);
      formData.append('privacy', privacy);
      if (location) formData.append('location', location);
      
      mediaFiles.forEach((file) => {
        formData.append('media', file);
      });

      await createPost(formData);
      router.push(postType === 'question' ? '/charcha' : '/');
      router.refresh();
    } catch (error) {
      console.error('Post creation failed:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-screen-md mx-auto min-h-screen pb-32">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-gray-100 sticky top-0 bg-white z-50">
        <button onClick={() => router.back()} className="p-1 text-gray-900">
          <X size={24} />
        </button>
        <h1 className="text-lg font-black text-gray-900">
          {postType === 'question' ? 'Ask Question' : 'New Update'}
        </h1>
        <button 
          onClick={handlePost}
          disabled={(!content && mediaFiles.length === 0) || isLoading}
          className={cn(
            "px-6 py-2 rounded-full text-sm font-black transition-all flex items-center gap-2",
            (content || mediaFiles.length > 0) && !isLoading 
              ? "bg-[#2E7D32] text-white shadow-lg shadow-green-100" 
              : "bg-gray-100 text-gray-400"
          )}
        >
          {isLoading && <Loader2 size={16} className="animate-spin" />}
          {postType === 'question' ? "Ask" : "Post"}
        </button>
      </div>

      <div className="p-4">
        {/* Type Selector Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-2xl mb-6">
          <button 
            onClick={() => setPostType('update')}
            className={cn(
              "flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all",
              postType === 'update' ? "bg-white text-[#2E7D32] shadow-sm" : "text-gray-500"
            )}
          >
            Update
          </button>
          <button 
            onClick={() => setPostType('question')}
            className={cn(
              "flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all",
              postType === 'question' ? "bg-white text-[#2E7D32] shadow-sm" : "text-gray-500"
            )}
          >
            Question
          </button>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm bg-gray-50">
            <img 
              src={user?.profilePicture || 'https://via.placeholder.com/150'} 
              alt="user" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-black text-gray-900">{user?.name || 'Farmer'}</span>
            <div className="flex gap-2">
              <button 
                onClick={() => setPrivacy(p => p === 'public' ? 'private' : 'public')}
                className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 border border-gray-100 rounded-full text-[10px] font-black text-gray-500 uppercase tracking-tight"
              >
                {privacy === 'public' ? <Globe size={12} className="text-[#2E7D32]" /> : <Lock size={12} />}
                {privacy}
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
          placeholder={postType === 'question' ? "What do you need help with? Be specific..." : "What's happening in your farm today?"}
          className="w-full min-h-[150px] text-xl font-medium text-gray-900 outline-none resize-none placeholder:text-gray-300 leading-relaxed"
        />

        {/* Media Preview Grid */}
        {mediaPreviews.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mb-6">
            {mediaPreviews.map((url, index) => (
              <div key={url} className="relative aspect-square rounded-3xl overflow-hidden border border-gray-100 group">
                <img src={url} alt="preview" className="w-full h-full object-cover" />
                <button 
                  onClick={() => removeMedia(index)}
                  className="absolute top-3 right-3 p-2 bg-black/50 text-white rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            {mediaPreviews.length < 10 && (
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 text-gray-400 hover:bg-gray-50 transition-colors"
              >
                <ImageIcon size={32} />
                <span className="text-[10px] font-black uppercase">Add More</span>
              </button>
            )}
          </div>
        )}

        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          multiple 
          accept="image/*,video/*"
          onChange={handleMediaSelect}
        />

        {/* Toolbar */}
        <div className="fixed bottom-0 left-0 right-0 max-w-screen-md mx-auto bg-white/80 backdrop-blur-xl border-t border-gray-100 p-4 pb-8">
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-3 text-[#2E7D32] hover:bg-[#F1F8F1] rounded-2xl transition-colors flex flex-col items-center gap-1"
              >
                <ImageIcon size={24} />
                <span className="text-[10px] font-black uppercase">Photo</span>
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-3 text-[#2E7D32] hover:bg-[#F1F8F1] rounded-2xl transition-colors flex flex-col items-center gap-1"
              >
                <Video size={24} />
                <span className="text-[10px] font-black uppercase">Video</span>
              </button>
              <button className="p-3 text-[#2E7D32] hover:bg-[#F1F8F1] rounded-2xl transition-colors flex flex-col items-center gap-1">
                <MapPin size={24} />
                <span className="text-[10px] font-black uppercase">Location</span>
              </button>
              <button className="p-3 text-[#2E7D32] hover:bg-[#F1F8F1] rounded-2xl transition-colors flex flex-col items-center gap-1">
                <Smile size={24} />
                <span className="text-[10px] font-black uppercase">Feeling</span>
              </button>
            </div>
            
            <div className="h-10 w-[1px] bg-gray-100 mx-2" />
            
            <button className="p-3 text-gray-400 hover:bg-gray-50 rounded-2xl transition-colors flex flex-col items-center gap-1">
              <Users size={24} />
              <span className="text-[10px] font-black uppercase">Tag</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CreatePostPage() {
  return (
    <AppLayout>
      <CreatePostContent />
    </AppLayout>
  );
}
