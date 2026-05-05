'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { 
  getPosts as fetchPostsApi, 
  toggleLike as toggleLikeApi, 
  toggleVote as toggleVoteApi,
  toggleCommentVote as toggleCommentVoteApi,
  deletePost as deletePostApi 
} from "../services/postService";

interface Post {
  _id: string;
  user: {
    _id: string;
    name: string;
    username: string;
    profilePicture?: string;
    role?: string;
  };
  media: Array<{
    url: string;
    type: string;
    thumbnail?: string;
  }>;
  caption: string;
  likesCount: number;
  commentsCount: number;
  upvotesCount: number;
  downvotesCount: number;
  votesScore: number;
  userVote?: 'upvote' | 'downvote' | null;
  createdAt: string;
  isLiked?: boolean;
  postType: 'update' | 'question' | 'community';
}

interface PostContextType {
  posts: Post[];
  loading: boolean;
  fetchPosts: () => Promise<void>;
  addPost: (post: Post) => void;
  toggleLike: (postId: string) => Promise<void>;
  toggleVote: (postId: string, type: 'upvote' | 'downvote') => Promise<void>;
  toggleCommentVote: (postId: string, commentId: string, type: 'upvote' | 'downvote') => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchPostsApi();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addPost = useCallback((post: Post) => {
    setPosts((prevPosts) => [post, ...prevPosts]);
  }, []);

  const toggleLike = useCallback(async (postId: string) => {
    let action: "like" | "unlike" = "like";
    
    setPosts((prevPosts) => {
      const post = prevPosts.find((p) => p._id === postId);
      if (!post) return prevPosts;
      
      action = post.isLiked ? "unlike" : "like";
      
      return prevPosts.map((p) => {
        if (p._id === postId) {
          const isLiked = !p.isLiked;
          return {
            ...p,
            isLiked,
            likesCount: isLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1),
          };
        }
        return p;
      });
    });

    try {
      const response = await toggleLikeApi(postId, action);
      if (response && typeof response.likesCount === 'number') {
        setPosts((prevPosts) =>
          prevPosts.map((p) =>
            p._id === postId
              ? { ...p, likesCount: response.likesCount, isLiked: response.isLiked }
              : p
          )
        );
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      fetchPosts(); 
    }
  }, [fetchPosts]);

  const toggleVote = useCallback(async (postId: string, type: 'upvote' | 'downvote') => {
    setPosts((prevPosts) => {
      return prevPosts.map((p) => {
        if (p._id === postId) {
          const currentVote = p.userVote;
          let newVote: 'upvote' | 'downvote' | null = type;
          let scoreChange = 0;

          if (currentVote === type) {
            newVote = null;
            scoreChange = type === 'upvote' ? -1 : 1;
          } else {
            if (currentVote === 'upvote') scoreChange = -2; // from up to down
            else if (currentVote === 'downvote') scoreChange = 2; // from down to up
            else scoreChange = type === 'upvote' ? 1 : -1; // from none to up/down
          }

          return {
            ...p,
            userVote: newVote,
            votesScore: (p.votesScore || 0) + scoreChange
          };
        }
        return p;
      });
    });

    try {
      const response = await toggleVoteApi(postId, type);
      if (response) {
        setPosts((prevPosts) =>
          prevPosts.map((p) =>
            p._id === postId
              ? { 
                  ...p, 
                  upvotesCount: response.upvotesCount, 
                  downvotesCount: response.downvotesCount, 
                  votesScore: response.votesScore,
                  userVote: response.userVote 
                }
              : p
          )
        );
      }
    } catch (error) {
      console.error("Error toggling vote:", error);
      fetchPosts();
    }
  }, [fetchPosts]);

  const toggleCommentVote = useCallback(async (postId: string, commentId: string, type: 'upvote' | 'downvote') => {
    try {
        await toggleCommentVoteApi(commentId, type);
        // Optimistic update for comments would require another context or a more complex state,
        // but for now we just call the API.
    } catch (error) {
        console.error("Error toggling comment vote:", error);
    }
  }, []);

  const deletePost = useCallback(async (postId: string) => {
    try {
      await deletePostApi(postId);
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <PostContext.Provider
      value={{
        posts,
        loading,
        fetchPosts,
        addPost,
        toggleLike,
        toggleVote,
        toggleCommentVote,
        deletePost,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error("usePosts must be used within a PostProvider");
  }
  return context;
};
