import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { searchUsers, toggleFollow } from "../../services/userService";
import { useNavigation } from "@react-navigation/native";
import ListProfile from "../../components/ListProfile";

interface User {
  _id: string;
  name: string;
  username: string;
  profilePicture?: string;
  isVerified?: boolean;
  followersCount?: number;
  isFollowing?: boolean;
}

export default function SearchResult({ query }: { query: string }) {
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>();

  // 🔎 Debounced Search
  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      setLoading(true);
      try {
        const results = await searchUsers(query);
        setSearchResults(results);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchResults, 400);
    return () => clearTimeout(timeoutId);
  }, [query]);

  // 🔥 Optimistic Follow Toggle
  const handleFollowToggle = async (id: string) => {
    const user = searchResults.find(u => u._id === id);
    if (!user) return;

    const wasFollowing = user.isFollowing;

    // Optimistic Update
    setSearchResults((prev) =>
      prev.map((u) =>
        u._id === id
          ? { 
              ...u, 
              isFollowing: !wasFollowing,
              followersCount: (u.followersCount || 0) + (wasFollowing ? -1 : 1)
            }
          : u
      )
    );

    try {
        const result = await toggleFollow(id);
        // Sync with actual result from server just in case
        setSearchResults((prev) =>
            prev.map((u) =>
              u._id === id
                ? { 
                    ...u, 
                    isFollowing: result.isFollowing,
                  }
                : u
            )
        );
    } catch (error) {
        console.error("Follow toggle error:", error);
        // Revert on error
        setSearchResults((prev) =>
            prev.map((u) =>
              u._id === id
                ? { 
                    ...u, 
                    isFollowing: wasFollowing,
                    followersCount: (u.followersCount || 0) + (wasFollowing ? 0 : -1)
                  }
                : u
            )
        );
    }
  };

  // 💀 Skeleton Loader
  if (loading && searchResults.length === 0) {
    return (
      <View className="px-4 pt-6" style={styles.loaderContainer}>
        {[1, 2, 3, 4].map((_, index) => (
          <View
            key={index}
            className="flex-row items-center mb-5 animate-pulse"
            style={styles.skeletonItem}
          >
            <View 
                className="w-14 h-14 bg-gray-200 dark:bg-slate-700 rounded-full" 
                style={styles.skeletonAvatar}
            />
            <View className="ml-4 flex-1" style={styles.skeletonTextContainer}>
              <View 
                className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/3 mb-2" 
                style={styles.skeletonTitle}
              />
              <View 
                className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/2" 
                style={styles.skeletonSubtitle}
              />
            </View>
          </View>
        ))}
      </View>
    );
  }

  // ❌ Empty State
  if (!loading && query.trim() && searchResults.length === 0) {
    return (
      <View 
        className="flex-1 justify-center items-center px-8"
        style={styles.emptyContainer}
      >
        <View 
            className="bg-gray-100 dark:bg-slate-800 p-6 rounded-full mb-5"
            style={styles.emptyIconContainer}
        >
          <Ionicons name="search-outline" size={28} color="#9CA3AF" />
        </View>

        <Text 
            className="text-lg font-semibold text-gray-900 dark:text-white"
            style={styles.emptyTitle}
        >
          No results found
        </Text>

        <Text 
            className="text-gray-500 dark:text-gray-400 text-center mt-2 text-sm"
            style={styles.emptySubtitle}
        >
          We couldn’t find anything for "{query}". Try another username.
        </Text>
      </View>
    );
  }

  // 📋 Search Results
  return (
    <FlatList
      data={searchResults}
      keyExtractor={(item) => item._id}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 40,
      }}
      ItemSeparatorComponent={() => (
        <View 
            className="h-px bg-gray-100 dark:bg-slate-700 ml-20" 
            style={styles.separator}
        />
      )}
      renderItem={({ item }) => (
        <ListProfile
          item={item}
          navigation={navigation}
          onFollowToggle={handleFollowToggle}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
    loaderContainer: {
        paddingHorizontal: 16,
        paddingTop: 24,
    },
    skeletonItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    skeletonAvatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#F3F4F6',
    },
    skeletonTextContainer: {
        marginLeft: 16,
        flex: 1,
    },
    skeletonTitle: {
        height: 16,
        backgroundColor: '#F3F4F6',
        borderRadius: 4,
        width: '40%',
        marginBottom: 8,
    },
    skeletonSubtitle: {
        height: 12,
        backgroundColor: '#F3F4F6',
        borderRadius: 4,
        width: '60%',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    emptyIconContainer: {
        backgroundColor: '#F3F4F6',
        padding: 24,
        borderRadius: 50,
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        marginTop: 8,
    },
    separator: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginLeft: 72, // Adjust based on avatar size + margin
    }
});
