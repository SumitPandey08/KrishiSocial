import React, { createContext, useContext, useState, useCallback } from "react";
import { 
  getPosts as fetchPostsApi, 
  toggleLike as toggleLikeApi, 
  commentOnPost as commentOnPostApi,
  deletePost as deletePostApi 
} from "../services/postService";

interface Post {
  _id: string;
  user: {
    _id: string;
    name: string;
    username: string;
    profilePicture?: string;
  };
  media: Array<{
    url: string;
    type: string;
    thumbnail?: string;
  }>;
  caption: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  isLiked?: boolean;
  postType: 'update' | 'question' | 'community';
}

interface PostContextType {
  posts: Post[];
  loading: boolean;
  refreshing: boolean;
  fetchPosts: () => Promise<void>;
  refreshPosts: () => Promise<void>;
  addPost: (post: Post) => void;
  toggleLike: (postId: string) => Promise<void>;
  commentOnPost: (postId: string, comment: string) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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

  const refreshPosts = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await fetchPostsApi();
      setPosts(data);
    } catch (error) {
      console.error("Error refreshing posts:", error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const addPost = useCallback((post: Post) => {
    setPosts((prevPosts) => [post, ...prevPosts]);
  }, []);

  const toggleLike = useCallback(async (postId: string) => {
    let action: "like" | "unlike" = "like";
    
    // Optimistic UI update using functional state
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
      // Use the action determined during the state update
      const response = await toggleLikeApi(postId, action);
      
      // Sync with server response to be sure
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
      fetchPosts(); // Re-sync on error
    }
  }, [fetchPosts]);

  const commentOnPost = useCallback(async (postId: string, comment: string) => {
    try {
      await commentOnPostApi(postId, comment);
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post._id === postId) {
            return {
              ...post,
              commentsCount: post.commentsCount + 1,
            };
          }
          return post;
        })
      );
    } catch (error) {
      console.error("Error commenting on post:", error);
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

  return (
    <PostContext.Provider
      value={{
        posts,
        loading,
        refreshing,
        fetchPosts,
        refreshPosts,
        addPost,
        toggleLike,
        commentOnPost,
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
