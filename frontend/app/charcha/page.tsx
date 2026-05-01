'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { CommunityCard } from '@/components/charcha/CommunityCard';
import { QuestionCard } from '@/components/charcha/QuestionCard';
import { usePosts } from '@/context/PostContext';
import { useUser } from '@/context/AuthContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const COMMUNITIES = [
  { id: '1', name: 'Organic Farming', members: '12K', icon: 'sprout' },
  { id: '2', name: 'Wheat Experts', members: '8.5K', icon: 'corn' },
  { id: '3', name: 'Smart Irrigation', members: '5.2K', icon: 'water' },
  { id: '4', name: 'Pest Control', members: '10K', icon: 'bug' },
];

export default function CharchaPage() {
  const [activeTab, setActiveTab] = useState('Latest');
  const { posts, loading, fetchPosts } = usePosts();
  const { user: currentUser } = useUser();

  const filteredQuestions = posts.filter(post => {
    if (post.postType !== 'question') return false;
    if (activeTab === 'My Questions') return post.user._id === currentUser?.id;
    return true;
  });

  return (
    <div className="w-full min-h-screen bg-[#FAFAFA]">
      {/* Search Bar */}
      <div className="bg-white p-5">
        <div className="flex items-center bg-[#F3F4G6] bg-gray-100 h-11 rounded-xl px-4">
          <Search size={18} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Search discussions, experts..." 
            className="flex-1 ml-3 bg-transparent outline-none text-sm font-medium"
          />
        </div>
      </div>

      {/* Communities Section */}
      <div className="px-5 mt-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-gray-900">Communities for You</h2>
          <button className="text-sm font-bold text-[#2E7D32]">Explore All</button>
        </div>
        <div className="overflow-x-auto no-scrollbar pb-2">
          <div className="flex min-w-max">
            {COMMUNITIES.map(item => <CommunityCard key={item.id} item={item} />)}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2.5 px-5 mt-6 mb-4">
        {['Trending', 'Latest', 'My Questions'].map((tab) => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2 rounded-full text-[13px] font-bold transition-all",
              activeTab === tab 
                ? "bg-[#2E7D32] text-white shadow-md shadow-[#2E7D32]/20" 
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Questions List */}
      <div className="px-5">
        {loading && posts.length === 0 ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2E7D32]"></div>
          </div>
        ) : filteredQuestions.length === 0 ? (
          <p className="text-center py-10 text-gray-500 font-bold">No questions found.</p>
        ) : (
          filteredQuestions.map((item) => (
            <QuestionCard 
              key={item._id}
              item={{
                id: item._id,
                user: item.user.name || item.user.username,
                question: item.caption,
                category: 'General',
                votes: item.likesCount,
                answers: item.commentsCount,
                isAnsweredByExpert: false,
                time: new Date(item.createdAt).toLocaleDateString()
              }} 
            />
          ))
        )}
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-24 right-5 bg-[#2E7D32] flex items-center gap-2 px-5 py-3.5 rounded-full shadow-xl shadow-[#2E7D32]/30 text-white transition-transform active:scale-95 z-40">
        <Plus size={24} />
        <span className="text-sm font-black uppercase tracking-tight">Ask Community</span>
      </button>
    </div>
  );
}
