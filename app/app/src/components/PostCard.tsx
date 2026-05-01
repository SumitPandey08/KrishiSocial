import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, Alert, Linking, ActionSheetIOS, Platform } from "react-native";
import { Ionicons, FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { usePosts } from "../context/PostContext";
import { useRouter } from "expo-router";
import { useUser } from "../context/AuthContext";

const { width } = Dimensions.get("window");

interface PostCardProps {
  postId: string;
  user: {
    id?: string;
    name: string;
    profilePhoto: string;
  };
  postImage?: string;
  caption: string;
  likes: number;
  commentsCount: number;
  uploadedAt: string;
  isLiked: boolean;
  hasVoiceNote?: boolean;
  postType?: "update" | "question" | "community";
}

export default function PostCard({
  postId,
  user,
  postImage,
  caption,
  likes,
  commentsCount,
  uploadedAt,
  isLiked,
  hasVoiceNote = false,
  postType = "update",
}: PostCardProps) {
  const { toggleLike, deletePost } = usePosts();
  const { user: currentUser } = useUser();
  const router = useRouter();

  const isCreator = currentUser?.username === user.name || currentUser?.id === user.id;

  const handleLike = () => {
    toggleLike(postId);
  };

  const handleNavigateToPostDetail = () => {
    router.push(`/post/${postId}`);
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Post",
      "Are you sure you want to delete this post?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: () => deletePost(postId) 
        }
      ]
    );
  };

  const handleEdit = () => {
    Alert.alert("Coming Soon", "Edit feature is under development.");
  };

  const handleReport = () => {
    Alert.alert("Report", "Thank you for reporting. We will review this post.");
  };

  const handleShare = () => {
    handleWhatsAppShare();
  };

  const showActionMenu = () => {
    const options = ["Share", "Report", "Cancel"];
    if (isCreator) {
      options.unshift("Edit", "Delete");
    }

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          destructiveButtonIndex: isCreator ? 1 : -1,
          cancelButtonIndex: options.length - 1,
        },
        (buttonIndex) => {
          handleAction(options[buttonIndex]);
        }
      );
    } else {
      // For Android, we can use a custom Modal or simple Alert for now
      Alert.alert(
        "Post Options",
        "Choose an action",
        options.map(opt => ({
          text: opt,
          style: opt === "Delete" ? "destructive" : (opt === "Cancel" ? "cancel" : "default"),
          onPress: () => handleAction(opt)
        })),
        { cancelable: true }
      );
    }
  };

  const handleAction = (action: string) => {
    switch (action) {
      case "Edit": handleEdit(); break;
      case "Delete": handleDelete(); break;
      case "Share": handleShare(); break;
      case "Report": handleReport(); break;
    }
  };

  const handleNavigateToProfile = () => {
    router.push(`/profile/${user.name}`);
  };

  const handleWhatsAppShare = () => {
    const message = `Check out this ${postType === 'question' ? 'question' : 'post'} from ${user.name}: ${caption}`;
    const url = `whatsapp://send?text=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(() => {
      Alert.alert("Error", "WhatsApp is not installed on your device");
    });
  };

  return (
    <View style={[styles.container, postType === 'question' && styles.questionContainer]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerLeft} 
          onPress={handleNavigateToProfile}
          activeOpacity={0.7}
        >
          <Image source={{ uri: user.profilePhoto }} style={styles.avatar} />
          <View>
            <View style={styles.usernameRow}>
              <Text style={styles.username}>{user.name}</Text>
              {postType === 'question' && (
                <View style={styles.questionBadge}>
                  <Text style={styles.questionBadgeText}>QUESTION</Text>
                </View>
              )}
            </View>
            <Text style={styles.location}>Nearby • {uploadedAt}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={showActionMenu} style={styles.menuButton}>
          <Ionicons name="ellipsis-horizontal" size={22} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Main Content Area */}
      {postType === 'question' ? (
        <TouchableOpacity 
          activeOpacity={0.9} 
          onPress={handleNavigateToPostDetail} 
          style={styles.questionContentArea}
        >
          <MaterialCommunityIcons name="help-circle-outline" size={32} color="#2E7D32" style={styles.questionIcon} />
          <Text style={styles.questionMainText}>{caption}</Text>
          
          {postImage && postImage !== 'https://via.placeholder.com/400' && (
            <Image source={{ uri: postImage }} style={styles.questionImage} />
          )}
        </TouchableOpacity>
      ) : (
        <>
          <TouchableOpacity activeOpacity={0.9} onPress={handleNavigateToPostDetail} style={styles.imageContainer}>
            <Image source={{ uri: postImage }} style={styles.postImage} />
            {hasVoiceNote && (
              <TouchableOpacity style={styles.playButton}>
                <Ionicons name="play" size={30} color="#FFF" />
                <Text style={styles.playText}>Listen</Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>

          <View style={styles.captionArea}>
            <Text style={styles.caption}>
              <Text style={styles.username}>{user.name}</Text> {caption}
            </Text>
          </View>
        </>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <View style={styles.leftActions}>
          <TouchableOpacity style={styles.actionIcon} onPress={handleLike}>
            <Ionicons name={isLiked ? "heart" : "heart-outline"} size={28} color={isLiked ? "#FF3040" : "#262626"} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionIcon} onPress={handleNavigateToPostDetail}>
            <Ionicons name="chatbubble-outline" size={26} color="#262626" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionIcon} onPress={handleWhatsAppShare}>
            <FontAwesome name="whatsapp" size={28} color="#25D366" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <Ionicons name="bookmark-outline" size={26} color="#262626" />
        </TouchableOpacity>
      </View>

      {/* Footer Info */}
      <View style={styles.footer}>
        <Text style={styles.likes}>{likes.toLocaleString()} likes</Text>
        
        {commentsCount > 0 && (
          <TouchableOpacity style={styles.commentsButton} onPress={handleNavigateToPostDetail}>
            <Text style={styles.commentsText}>
              {postType === 'question' ? `View all ${commentsCount} answers` : `View all ${commentsCount} comments`}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginHorizontal: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  questionContainer: {
    borderColor: '#E8F5E9',
    backgroundColor: '#F9FEF9',
    borderLeftWidth: 5,
    borderLeftColor: '#2E7D32',
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuButton: {
    padding: 4,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 12,
    borderWidth: 1.5,
    borderColor: '#E8F5E9',
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
  location: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 1,
  },
  imageContainer: {
    position: 'relative',
  },
  postImage: {
    width: '100%',
    aspectRatio: 1,
  },
  questionContentArea: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    alignItems: 'center',
  },
  questionIcon: {
    marginBottom: 12,
  },
  questionMainText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    lineHeight: 26,
  },
  questionImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginTop: 15,
  },
  captionArea: {
    paddingHorizontal: 15,
    paddingTop: 12,
  },
  playButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(46, 125, 50, 0.8)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 25,
  },
  playText: {
    color: '#FFF',
    fontWeight: '700',
    marginLeft: 5,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  leftActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  actionIcon: {
    padding: 2,
  },
  footer: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  likes: {
    fontWeight: "700",
    fontSize: 14,
    color: "#374151",
    marginBottom: 6,
  },
  caption: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  commentsButton: {
    marginTop: 4,
  },
  commentsText: {
    color: "#2E7D32",
    fontSize: 14,
    fontWeight: '700',
  },
});
