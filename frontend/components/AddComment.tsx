'use client';

import React, { useState } from 'react';
import { SendHorizontal } from 'lucide-react';

interface AddCommentProps {
  postId: string;
  onCommentAdded?: (comment: any) => void;
  placeholder?: string;
}

export default function AddComment({ postId, onCommentAdded, placeholder }: AddCommentProps) {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (!text) return;
    // Simulating API call
    if (onCommentAdded) {
      onCommentAdded({
        _id: Math.random().toString(),
        text,
        user: { username: 'Current User', profilePicture: 'https://via.placeholder.com/150' },
        createdAt: new Date().toISOString(),
        likesCount: 0,
        isLiked: false
      });
    }
    setText('');
  };

  return (
    <div className="flex items-center gap-3 py-2">
      <div className="flex-1 flex items-center bg-gray-100 h-11 rounded-xl px-4">
        <input 
          type="text" 
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder || "Add a comment..."}
          className="flex-1 bg-transparent outline-none text-sm font-medium"
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
      </div>
      <button 
        onClick={handleSend}
        disabled={!text}
        className="w-11 h-11 bg-[#2E7D32] rounded-xl flex items-center justify-center text-white disabled:opacity-50 transition-transform active:scale-95 shadow-lg shadow-[#2E7D32]/20"
      >
        <SendHorizontal size={20} />
      </button>
    </div>
  );
}
