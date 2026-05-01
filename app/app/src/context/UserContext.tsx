import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { getFollowing, getFollowers, toggleFollow as toggleFollowApi } from "../services/userService";
import { useAuth } from "./AuthContext";

interface UserContextType {
  followingIds: Set<string>;
  followerIds: Set<string>;
  isFollowing: (userId: string) => boolean;
  isFollower: (userId: string) => boolean;
  toggleFollow: (userId: string) => Promise<boolean>;
  refreshRelationships: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set());
  const [followerIds, setFollowerIds] = useState<Set<string>>(new Set());

  const refreshRelationships = useCallback(async () => {
    if (!user) {
      setFollowingIds(new Set());
      setFollowerIds(new Set());
      return;
    }

    try {
      const [following, followers] = await Promise.all([
        getFollowing(user.id),
        getFollowers(user.id)
      ]);

      setFollowingIds(new Set(following.map((u: any) => u._id)));
      setFollowerIds(new Set(followers.map((u: any) => u._id)));
    } catch (error) {
      console.error("Error refreshing relationships:", error);
    }
  }, [user]);

  useEffect(() => {
    refreshRelationships();
  }, [refreshRelationships]);

  const isFollowing = useCallback((userId: string) => {
    return followingIds.has(userId);
  }, [followingIds]);

  const isFollower = useCallback((userId: string) => {
    return followerIds.has(userId);
  }, [followerIds]);

  const toggleFollow = useCallback(async (userId: string) => {
    try {
      const result = await toggleFollowApi(userId);
      const newIsFollowing = result.isFollowing;

      setFollowingIds((prev) => {
        const next = new Set(prev);
        if (newIsFollowing) {
          next.add(userId);
        } else {
          next.delete(userId);
        }
        return next;
      });

      return newIsFollowing;
    } catch (error) {
      console.error("Error toggling follow:", error);
      throw error;
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        followingIds,
        followerIds,
        isFollowing,
        isFollower,
        toggleFollow,
        refreshRelationships,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUsers must be used within a UserProvider");
  }
  return context;
};
