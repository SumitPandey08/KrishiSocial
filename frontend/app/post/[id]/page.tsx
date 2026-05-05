'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, Heart, MessageCircle, MoreHorizontal, Share2, ArrowBigUp, ArrowBigDown } from 'lucide-react';
import { usePosts } from '@/context/PostContext';
import { useUser } from '@/context/AuthContext';
import AppLayout from '@/components/AppLayout';
import CommentItem from '@/components/CommentItem';
import AddComment from '@/components/AddComment';
import { API_URL } from '@/services/api';
import axios from 'axios';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface Post {
  _id: string;
  user: {
    username: string;
    profilePicture?: string;
  };
  caption: string;
  media?: { url: string }[];
  isLiked: boolean;
  likesCount: number;
  commentsCount: number;
  postType?: 'update' | 'question' | 'community';
  createdAt: string;
  upvotesCount: number;
  downvotesCount: number;
  votesScore: number;
  userVote?: 'upvote' | 'downvote' | null;
}

interface Comment {
  _id: string;
  user: {
    username: string;
    profilePicture?: string;
    role?: string;
  };
  text: string;
  createdAt: string;
  likesCount: number;
  votesScore: number;
  userVote?: 'upvote' | 'downvote' | null;
  isLiked: boolean;
  isBestAnswer?: boolean;
  isExpertVerified?: boolean;
}

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function PostDetailContent() {
  const { id } = useParams();
  const router = useRouter();
  const { toggleLike, toggleVote, toggleCommentVote } = usePosts();
  const { user: currentUser } = useUser();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPostDetails = useCallback(async () => {
    if (!id) return;
    try {
      const token = localStorage.getItem('accessToken');
      const [postRes, commentsRes] = await Promise.all([
        axios.get(`${API_URL}/posts/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/posts/${id}/comments`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setPost(postRes.data);
      setComments(commentsRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPostDetails();
  }, [fetchPostDetails]);

  const handleToggleLike = async () => {
    if (!post) return;
    const isLiked = !post.isLiked;
    setPost({
      ...post,
      isLiked,
      likesCount: isLiked ? post.likesCount + 1 : Math.max(0, post.likesCount - 1)
    });
    try {
      await toggleLike(id as string);
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleVote = async (type: 'upvote' | 'downvote') => {
    if (!post) return;
    
    const currentVote = post.userVote;
    let newVote: 'upvote' | 'downvote' | null = type;
    let scoreChange = 0;

    if (currentVote === type) {
      newVote = null;
      scoreChange = type === 'upvote' ? -1 : 1;
    } else {
      if (currentVote === 'upvote') scoreChange = -2;
      else if (currentVote === 'downvote') scoreChange = 2;
      else scoreChange = type === 'upvote' ? 1 : -1;
    }

    setPost({
      ...post,
      userVote: newVote,
      votesScore: (post.votesScore || 0) + scoreChange
    });

    try {
      await toggleVote(id as string, type);
    } catch (error) {
      console.error(error);
      fetchPostDetails();
    }
  };

  const handleCommentVote = async (commentId: string, type: 'upvote' | 'downvote') => {
    setComments(prev => prev.map(c => {
      if (c._id === commentId) {
        const currentVote = c.userVote;
        let newVote: 'upvote' | 'downvote' | null = type;
        let scoreChange = 0;

        if (currentVote === type) {
          newVote = null;
          scoreChange = type === 'upvote' ? -1 : 1;
        } else {
          if (currentVote === 'upvote') scoreChange = -2;
          else if (currentVote === 'downvote') scoreChange = 2;
          else scoreChange = type === 'upvote' ? 1 : -1;
        }

        return {
          ...c,
          userVote: newVote,
          votesScore: (c.votesScore || 0) + scoreChange
        };
      }
      return c;
    }));

    try {
      await toggleCommentVote(id as string, commentId, type);
    } catch (error) {
      console.error(error);
      fetchPostDetails();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2E7D32]"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-gray-500 font-bold">Post not found</p>
      </div>
    );
  }

  const isQuestion = post.postType === 'question';

  return (
    <div className="max-w-screen-md mx-auto min-h-screen pb-24">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-gray-100 sticky top-0 bg-white z-50">
        <button onClick={() => router.back()} className="p-1 text-gray-900">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-sm font-black text-gray-900 uppercase tracking-tight">
          {isQuestion ? 'Discussion' : 'Post Details'}
        </h1>
        <button className="p-1 text-gray-900">
          <MoreHorizontal size={24} />
        </button>
      </div>

      <div className="p-4">
        {/* Post Content */}
        <div className={cn(
          "rounded-2xl border border-gray-100 overflow-hidden mb-6",
          isQuestion && "bg-[#F9FEF9] border-l-4 border-l-[#2E7D32]"
        )}>
          <div className="flex items-center gap-3 p-4">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
              <img 
                src={post.user.profilePicture || "https://via.placeholder.com/150"} 
                alt="user" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-900">{post.user.username}</span>
                {isQuestion && (
                   <span className="bg-[#E8F5E9] text-[#2E7D32] text-[10px] font-black px-1.5 py-0.5 rounded uppercase">Question</span>
                )}
              </div>
              <span className="text-[10px] text-gray-400 font-medium">
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="px-4 pb-4">
             <p className={cn(
               "text-gray-900 leading-relaxed mb-4",
               isQuestion ? "text-xl font-bold" : "text-sm font-medium"
             )}>
               {post.caption}
             </p>
             {post.media && post.media.length > 0 && (
               <div className="rounded-xl overflow-hidden mb-4">
                 <img src={post.media[0].url} alt="post" className="w-full h-auto" />
               </div>
             )}

             <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-50">
                {/* Voting Controls */}
                <div className="flex items-center bg-gray-50 rounded-full px-2 py-1">
                  <button 
                    onClick={() => handleToggleVote('upvote')}
                    className={cn(
                      "p-1 rounded-full transition-colors",
                      post.userVote === 'upvote' ? "text-orange-600 bg-orange-50" : "text-gray-500 hover:text-orange-600"
                    )}
                  >
                    <ArrowBigUp size={24} className={post.userVote === 'upvote' ? "fill-current" : ""} />
                  </button>
                  <span className={cn(
                    "text-xs font-black px-1 min-w-[20px] text-center",
                    post.userVote === 'upvote' ? "text-orange-600" : post.userVote === 'downvote' ? "text-indigo-600" : "text-gray-700"
                  )}>
                    {post.votesScore || 0}
                  </span>
                  <button 
                    onClick={() => handleToggleVote('downvote')}
                    className={cn(
                      "p-1 rounded-full transition-colors",
                      post.userVote === 'downvote' ? "text-indigo-600 bg-indigo-50" : "text-gray-500 hover:text-indigo-600"
                    )}
                  >
                    <ArrowBigDown size={24} className={post.userVote === 'downvote' ? "fill-current" : ""} />
                  </button>
                </div>

                <button onClick={handleToggleLike} className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors">
                  <Heart 
                    size={22} 
                    className={cn(post.isLiked ? "fill-[#FF3040] text-[#FF3040]" : "text-gray-700")} 
                  />
                  <span className="text-sm font-black text-gray-700">{post.likesCount}</span>
                </button>
                <div className="flex items-center gap-2 px-3 py-1.5">
                  <MessageCircle size={22} className="text-gray-700" />
                  <span className="text-sm font-black text-gray-700">{post.commentsCount}</span>
                </div>
                <button className="ml-auto p-2 hover:bg-gray-50 rounded-full transition-colors">
                   <Share2 size={22} className="text-gray-700" />
                </button>
             </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mb-6">
          <h2 className="text-base font-black text-gray-900 mb-4 px-1">
            {isQuestion ? 'Answers' : 'Comments'}
          </h2>
          
          <div className="flex flex-col gap-2">
            {comments.map((item) => (
              <CommentItem
                key={item._id}
                id={item._id}
                user={{
                  name: item.user.username,
                  profilePhoto: item.user.profilePicture || "https://via.placeholder.com/150",
                  role: item.user.role
                }}
                comment={item.text}
                uploadedAt={new Date(item.createdAt).toLocaleDateString()}
                likes={item.likesCount}
                votesScore={item.votesScore}
                userVote={item.userVote}
                isLiked={item.isLiked}
                isBestAnswer={item.isBestAnswer}
                isExpertVerified={item.isExpertVerified}
                onVote={(type) => handleCommentVote(item._id, type)}
              />
            ))}
            {comments.length === 0 && (
              <div className="py-10 flex flex-col items-center opacity-30">
                <MessageCircle size={40} className="text-gray-300 mb-2" />
                <p className="text-sm font-bold text-gray-500">No {isQuestion ? 'answers' : 'comments'} yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Add Comment */}
      <div className="fixed bottom-0 left-0 right-0 max-w-screen-md mx-auto bg-white border-t border-gray-100 p-4 pb-8 z-50">
        <AddComment 
          postId={id as string} 
          onCommentAdded={(newComment) => setComments([newComment, ...comments])}
          placeholder={isQuestion ? "Write an answer..." : "Add a comment..."}
        />
      </div>
    </div>
  );
}

export default function PostDetailPage() {
  return (
    <AppLayout>
      <PostDetailContent />
    </AppLayout>
  );
}
