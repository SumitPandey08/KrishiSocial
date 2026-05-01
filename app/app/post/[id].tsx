import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  getPostById,
  getComments,
  toggleCommentLike,
  markBestAnswer,
  verifyComment,
} from "../src/services/postService";
import CommentItem from "../src/components/CommentItem";
import AddComment from "../src/components/AddComment";
import { formatDistanceToNow } from "../src/utils/formatDate";
import { usePosts } from "../src/context/PostContext";
import { getSocket, EVENTS } from "../src/utils/socket";
import { useUser } from "../src/context/AuthContext";

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { toggleLike } = usePosts();
  const { user: currentUser } = useUser();

  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleToggleLike = async () => {
    if (!post) return;

    setPost((prev: any) => {
      if (!prev) return prev;
      const isLiked = !prev.isLiked;
      return {
        ...prev,
        isLiked,
        likesCount: isLiked
          ? prev.likesCount + 1
          : Math.max(0, prev.likesCount - 1),
      };
    });

    try {
      await toggleLike(id);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const fetchPostDetails = useCallback(async () => {
    try {
      const postData = await getPostById(id);
      setPost(postData);
      const commentsData = await getComments(id);
      setComments(commentsData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPostDetails();
  }, [fetchPostDetails]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.emit(EVENTS.JOIN_POST, id);

    const handleNewComment = ({ postId, comment }: { postId: string; comment: any }) => {
      if (postId === id) {
        setComments((prev) => {
          if (prev.some((c) => c._id === comment._id)) return prev;
          return [comment, ...prev];
        });
        setPost((prev: any) => ({
          ...prev,
          commentsCount: prev.commentsCount + 1,
        }));
      }
    };

    const handlePostLiked = ({ postId, likesCount }: { postId: string; likesCount: number }) => {
      if (postId === id) {
        setPost((prev: any) => ({ ...prev, likesCount }));
      }
    };

    socket.on(EVENTS.NEW_COMMENT, handleNewComment);
    socket.on(EVENTS.POST_LIKED, handlePostLiked);

    return () => {
      socket.off(EVENTS.NEW_COMMENT, handleNewComment);
      socket.off(EVENTS.POST_LIKED, handlePostLiked);
    };
  }, [id]);

  const handleCommentAdded = (newComment: any) => {
    setComments((prev) => [newComment, ...prev]);
    setPost((prev: any) => ({
      ...prev,
      commentsCount: prev.commentsCount + 1,
    }));
  };

  const handleToggleCommentLike = async (commentId: string) => {
    setComments(prev => prev.map(c => {
      if (c._id === commentId) {
        const isLiked = !c.isLiked;
        return {
          ...c,
          isLiked,
          likesCount: isLiked ? c.likesCount + 1 : Math.max(0, c.likesCount - 1)
        };
      }
      return c;
    }));

    try {
      const comment = comments.find(c => c._id === commentId);
      await toggleCommentLike(commentId, comment.isLiked ? "unlike" : "like");
    } catch (error) {
      console.error("Error toggling comment like:", error);
    }
  };

  const handleMarkBestAnswer = async (commentId: string) => {
    try {
      await markBestAnswer(commentId);
      setComments(prev => prev.map(c => ({
        ...c,
        isBestAnswer: c._id === commentId
      })));
      Alert.alert("Success", "Marked as best answer!");
    } catch (error) {
      console.error("Error marking best answer:", error);
      Alert.alert("Error", "Could not mark as best answer");
    }
  };

  const handleVerifyComment = async (commentId: string) => {
    try {
      await verifyComment(commentId);
      setComments(prev => prev.map(c => {
        if (c._id === commentId) return { ...c, isExpertVerified: true };
        return c;
      }));
      Alert.alert("Success", "Answer verified by expert!");
    } catch (error) {
      console.error("Error verifying comment:", error);
      Alert.alert("Error", "Could not verify answer");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.center}>
        <Text>Post not found</Text>
      </View>
    );
  }

  const isAsker = currentUser?.id === post.user._id || currentUser?.username === post.user.username;
  const isExpert = currentUser?.role === 'expert';

  const renderHeader = () => (
    <View>
      <View style={[styles.postContainer, post.postType === 'question' && styles.questionContainer]}>
        <View style={styles.userRow}>
          <Image
            source={{
              uri: post.user.profilePicture || "https://via.placeholder.com/150",
            }}
            style={styles.avatar}
          />
          <View>
            <View style={styles.usernameRow}>
              <Text style={styles.username}>{post.user.username}</Text>
              {post.postType === 'question' && (
                <View style={styles.questionBadge}>
                  <Text style={styles.questionBadgeText}>QUESTION</Text>
                </View>
              )}
            </View>
            <Text style={styles.timeAgo}>
              {formatDistanceToNow(post.createdAt)}
            </Text>
          </View>
        </View>

        {post.postType === 'question' ? (
          <View style={styles.questionContentArea}>
            <Text style={styles.questionMainText}>{post.caption}</Text>
            {post.media?.length > 0 && (
              <Image source={{ uri: post.media[0].url }} style={styles.questionImage} />
            )}
          </View>
        ) : (
          <>
            {post.media?.length > 0 && (
              <Image
                source={{ uri: post.media[0].url }}
                style={styles.postImage}
              />
            )}
            <Text style={styles.caption}>
              <Text style={styles.username}>{post.user.username}</Text>{" "}
              {post.caption}
            </Text>
          </>
        )}

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionIcon} onPress={handleToggleLike}>
            <Ionicons
              name={post.isLiked ? "heart" : "heart-outline"}
              size={26}
              color={post.isLiked ? "#FF3040" : "#262626"}
            />
            <Text style={styles.actionLabel}>{post.likesCount}</Text>
          </TouchableOpacity>

          <View style={styles.actionIcon}>
            <Ionicons name="chatbubble-outline" size={24} color="#262626" />
            <Text style={styles.actionLabel}>{post.commentsCount}</Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />
      <View style={styles.commentsHeader}>
        <Text style={styles.commentsTitle}>
          {post.postType === 'question' ? 'Answers' : 'Comments'}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#262626" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{post.postType === 'question' ? 'Question Discussion' : 'Post Details'}</Text>
        <View style={{ width: 28 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={{ flex: 1 }}>
          <FlatList
            data={comments}
            keyExtractor={(item) => item._id}
            ListHeaderComponent={renderHeader}
            contentContainerStyle={{ paddingBottom: 120 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.commentItemWrapper}>
                <CommentItem
                  id={item._id}
                  user={{
                    name: item.user.username,
                    profilePhoto: item.user.profilePicture || "https://via.placeholder.com/150",
                    role: item.user.role
                  }}
                  comment={item.text}
                  uploadedAt={formatDistanceToNow(item.createdAt)}
                  likes={item.likesCount}
                  isLiked={item.isLiked}
                  isBestAnswer={item.isBestAnswer}
                  isExpertVerified={item.isExpertVerified}
                  onLike={() => handleToggleCommentLike(item._id)}
                  onMarkBest={() => handleMarkBestAnswer(item._id)}
                  onVerify={() => handleVerifyComment(item._id)}
                  canMarkBest={isAsker && post.postType === 'question'}
                  canVerify={isExpert}
                />
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.noComments}>
                <Ionicons name="chatbubble-outline" size={36} color="#ccc" />
                <Text style={styles.noCommentsText}>No {post.postType === 'question' ? 'answers' : 'comments'} yet</Text>
              </View>
            }
          />

          <View style={styles.commentWrapper}>
            <AddComment
              postId={id}
              onCommentAdded={handleCommentAdded}
              placeholder={post.postType === 'question' ? "Write an answer..." : "Add a comment..."}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    backgroundColor: "#FFFFFF",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  postContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  questionContainer: {
    backgroundColor: '#F9FEF9',
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  usernameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  username: {
    fontWeight: "800",
    fontSize: 15,
    color: "#111827",
  },
  questionBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  questionBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#2E7D32',
  },
  timeAgo: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  questionContentArea: {
    marginBottom: 16,
  },
  questionMainText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 28,
    marginBottom: 12,
  },
  questionImage: {
    width: '100%',
    height: 250,
    borderRadius: 14,
  },
  postImage: {
    width: "100%",
    height: 400,
    borderRadius: 14,
    marginBottom: 12,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 20,
  },
  actionIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },
  caption: {
    fontSize: 15,
    color: "#1F2937",
    lineHeight: 22,
    marginTop: 8,
  },
  divider: {
    height: 8,
    backgroundColor: "#F3F4F6",
  },
  commentsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  commentItemWrapper: {
    paddingHorizontal: 12,
    marginTop: 8,
  },
  noComments: {
    alignItems: "center",
    paddingVertical: 60,
  },
  noCommentsText: {
    marginTop: 12,
    fontSize: 15,
    color: "#9CA3AF",
    fontWeight: '600',
  },
  commentWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 20,
  },
});