import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useUsers } from "../context/UserContext";
import { useRouter } from "expo-router";

export default function ListProfile({ item, onFollowToggle }: any) {
  const { isFollowing: checkIsFollowing } = useUsers();
  const isFollowing = checkIsFollowing(item._id);
  const router = useRouter();

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      className="flex-row items-center px-4 py-3 bg-white dark:bg-slate-800 rounded-2xl mb-3"
      style={styles.container}
      onPress={() =>
        router.push(`/profile/${item.username}`)
      }
    >
      {/* Avatar Section */}
      <View className="relative" style={styles.avatarContainer}>
        <Image
          source={{
            uri: item.profilePicture || "https://via.placeholder.com/150",
          }}
          className="w-14 h-14 rounded-full"
          style={styles.avatar}
        />

        {item.isVerified && (
          <View className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 rounded-full" style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={18} color="#3B82F6" />
          </View>
        )}
      </View>

      {/* User Info */}
      <View className="flex-1 ml-4" style={styles.userInfo}>
        <View className="flex-row items-center" style={styles.usernameRow}>
          <Text 
            className="text-base font-semibold text-gray-900 dark:text-white mr-1"
            style={styles.username}
          >
            {item.username}
          </Text>
        </View>

        <Text
          className="text-sm text-gray-500 dark:text-gray-400"
          numberOfLines={1}
          style={styles.name}
        >
          {item.name}
        </Text>

        {item.followersCount !== undefined && (
          <Text className="text-xs text-gray-400 mt-0.5" style={styles.followers}>
            {item.followersCount.toLocaleString()} followers
          </Text>
        )}
      </View>

      {/* Follow Button */}
      {onFollowToggle && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={(e) => {
            e.stopPropagation();
            onFollowToggle(item._id);
          }}
          className={`px-4 py-1.5 rounded-full ${
            isFollowing
              ? "bg-gray-200 dark:bg-slate-700"
              : "bg-indigo-500"
          }`}
          style={[
            styles.followButton,
            isFollowing ? styles.followingButton : styles.notFollowingButton
          ]}
        >
          <Text
            className={`text-sm font-medium ${
              isFollowing
                ? "text-gray-800 dark:text-white"
                : "text-white"
            }`}
            style={[
                styles.followButtonText,
                isFollowing ? styles.followingButtonText : styles.notFollowingButtonText
            ]}
          >
            {isFollowing ? "Following" : "Follow"}
          </Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 12,
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#F3F4F6',
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        backgroundColor: '#fff',
        borderRadius: 10,
    },
    userInfo: {
        flex: 1,
        marginLeft: 16,
    },
    usernameRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    username: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    name: {
        fontSize: 14,
        color: '#6B7280',
    },
    followers: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 2,
    },
    followButton: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
    },
    notFollowingButton: {
        backgroundColor: '#6366F1',
    },
    followingButton: {
        backgroundColor: '#E5E7EB',
    },
    followButtonText: {
        fontSize: 14,
        fontWeight: '500',
    },
    notFollowingButtonText: {
        color: '#fff',
    },
    followingButtonText: {
        color: '#1F2937',
    }
});
