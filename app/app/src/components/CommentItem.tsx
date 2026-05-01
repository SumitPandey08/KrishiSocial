import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

interface CommentItemProps {
  id: string;
  user: {
    name: string;
    profilePhoto: string;
    role?: string;
  };
  comment: string;
  uploadedAt: string;
  likes?: number;
  isLiked?: boolean;
  isBestAnswer?: boolean;
  isExpertVerified?: boolean;
  onLike?: () => void;
  onMarkBest?: () => void;
  onVerify?: () => void;
  canMarkBest?: boolean;
  canVerify?: boolean;
}

export default function CommentItem({
  id,
  user,
  comment,
  uploadedAt,
  likes = 0,
  isLiked = false,
  isBestAnswer = false,
  isExpertVerified = false,
  onLike,
  onMarkBest,
  onVerify,
  canMarkBest = false,
  canVerify = false,
}: CommentItemProps) {
  return (
    <View style={[styles.container, isBestAnswer && styles.bestAnswerContainer]}>
      <Image source={{ uri: user.profilePhoto }} style={styles.avatar} />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.userRow}>
            <Text style={styles.username}>{user.name}</Text>
            {user.role === 'expert' && (
              <View style={styles.expertBadge}>
                <MaterialCommunityIcons name="certificate" size={12} color="#D4AF37" />
                <Text style={styles.expertBadgeText}>EXPERT</Text>
              </View>
            )}
          </View>
          
          {isBestAnswer && (
            <View style={styles.bestBadge}>
              <Ionicons name="checkmark-circle" size={14} color="#2E7D32" />
              <Text style={styles.bestBadgeText}>Best Answer</Text>
            </View>
          )}
        </View>

        <Text style={styles.commentText}>{comment}</Text>

        {isExpertVerified && (
          <View style={styles.verifiedByExpert}>
            <Ionicons name="shield-checkmark" size={14} color="#2E7D32" />
            <Text style={styles.verifiedText}>Expert Verified</Text>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.timeAgo}>{uploadedAt}</Text>
          
          <TouchableOpacity style={styles.actionItem} onPress={onLike}>
            <Ionicons name={isLiked ? "arrow-up-circle" : "arrow-up-circle-outline"} size={18} color={isLiked ? "#2E7D32" : "#666"} />
            <Text style={[styles.actionText, isLiked && { color: '#2E7D32' }]}>{likes} votes</Text>
          </TouchableOpacity>

          {canMarkBest && !isBestAnswer && (
            <TouchableOpacity style={styles.actionItem} onPress={onMarkBest}>
              <Ionicons name="checkmark-done-outline" size={18} color="#666" />
              <Text style={styles.actionText}>Mark Best</Text>
            </TouchableOpacity>
          )}

          {canVerify && !isExpertVerified && (
            <TouchableOpacity style={styles.actionItem} onPress={onVerify}>
              <MaterialCommunityIcons name="check-decagram-outline" size={18} color="#666" />
              <Text style={styles.actionText}>Verify</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  bestAnswerContainer: {
    backgroundColor: '#F1F8F1',
    borderColor: '#2E7D32',
    borderWidth: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  username: {
    fontWeight: "700",
    fontSize: 14,
    color: "#111827",
  },
  expertBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 2,
  },
  expertBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#92400E',
  },
  bestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 4,
  },
  bestBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#2E7D32',
  },
  commentText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  verifiedByExpert: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2E7D32',
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    gap: 16,
  },
  timeAgo: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7280",
  },
});
