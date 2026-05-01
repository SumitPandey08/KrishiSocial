import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, RefreshControl } from 'react-native';
import PostCard from './PostCard';
import { usePosts } from '../context/PostContext';
import { formatDistanceToNow } from '../utils/formatDate';

interface PostsProps {
  activeFilter?: string;
}

export default function Posts({ activeFilter = 'All' }: PostsProps) {
  const { posts, loading, refreshing, fetchPosts, refreshPosts } = usePosts();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const filteredPosts = posts.filter((item) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Posts') return item.postType === 'update' || !item.postType;
    if (activeFilter === 'Questions') return item.postType === 'question';
    // For other filters like 'My Crops' or 'Nearby', we might need more logic
    // but for now let's just show everything if it doesn't match the types
    return true;
  });

  if (loading && posts.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  if (filteredPosts.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.noPostsText}>No {activeFilter === 'All' ? '' : activeFilter.toLowerCase()} found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {filteredPosts.map((item) => (
        <PostCard
          key={item._id}
          postId={item._id}
          user={{
            name: item.user.username || item.user.name,
            profilePhoto: item.user.profilePicture || 'https://via.placeholder.com/150',
          }}
          postImage={item.media[0]?.url}
          caption={item.caption}
          likes={item.likesCount}
          commentsCount={item.commentsCount}
          uploadedAt={formatDistanceToNow(item.createdAt)}
          isLiked={item.isLiked || false}
          postType={item.postType}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 20,
  },
  centerContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noPostsText: {
    color: '#8e8e8e',
    fontSize: 14,
  },
});
