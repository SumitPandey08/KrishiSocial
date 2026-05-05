'use client';

import React from 'react';
import { usePosts } from '@/context/PostContext';
import PostCard from './PostCard';

interface PostsProps {
  activeFilter?: string;
}

export default function Posts({ activeFilter = 'All' }: PostsProps) {
  const { posts, loading } = usePosts();

  if (loading && posts.length === 0) {
    return (
      <div className="flex justify-center p-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2E7D32]"></div>
      </div>
    );
  }

  const filteredPosts = posts.filter(post => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Posts') return post.postType === 'update';
    if (activeFilter === 'Questions') return post.postType === 'question';
    return true;
  });

  return (
    <div className="flex flex-col gap-4 p-4">
      {filteredPosts.map((post) => (
        <PostCard
          key={post._id}
          postId={post._id}
          user={{
            name: post.user.name,
            username: post.user.username,
            profilePhoto: post.user.profilePicture || 'https://via.placeholder.com/150',
            id: post.user._id,
            role: post.user.role
          }}
          caption={post.caption}
          likes={post.likesCount}
          commentsCount={post.commentsCount}
          uploadedAt={new Date(post.createdAt).toLocaleDateString()}
          isLiked={post.isLiked || false}
          votesScore={post.votesScore}
          userVote={post.userVote}
          postImage={post.media && post.media.length > 0 ? post.media[0].url : undefined}
          postType={post.postType}
        />
      ))}
      {filteredPosts.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No posts found</p>
      )}
    </div>
  );
}
