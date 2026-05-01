import api from "./api";

export const searchUsers = async (query: string) => {
  try {
    const response = await api.get(`/users/search?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error("Search users error:", error);
    throw error;
  }
};

export const getUserProfile = async (username: string) => {
  try {
    const response = await api.get(`/users/${username}`);
    return response.data;
  } catch (error) {
    console.error("Get user profile error:", error);
    throw error;
  }
};

export const toggleFollow = async (userId: string) => {
  try {
    const response = await api.post(`/users/${userId}/toggle-follow`, {});
    return response.data;
  } catch (error) {
    console.error("Toggle follow error:", error);
    throw error;
  }
};

export const followUser = async (userId: string) => {
  try {
    const response = await api.post(`/users/${userId}/follow`, {});
    return response.data;
  } catch (error) {
    console.error("Follow user error:", error);
    throw error;
  }
};

export const unfollowUser = async (userId: string) => {
  try {
    const response = await api.post(`/users/${userId}/unfollow`, {});
    return response.data;
  } catch (error) {
    console.error("Unfollow user error:", error);
    throw error;
  }
};

export const getFollowers = async (userId: string) => {
  try {
    const response = await api.get(`/users/${userId}/followers`);
    return response.data;
  } catch (error) {
    console.error("Get followers error:", error);
    throw error;
  }
};

export const getFollowing = async (userId: string) => {
  try {
    const response = await api.get(`/users/${userId}/following`);
    return response.data;
  } catch (error) {
    console.error("Get following error:", error);
    throw error;
  }
};

export const updateProfile = async (data: {
  name?: string;
  bio?: string;
  website?: string;
  accountType?: "public" | "private";
  village?: string;
  district?: string;
  state?: string;
  farmSize?: number;
  cropsGrown?: string[];
  farmingType?: string;
}) => {
  try {
    const response = await api.put("/users/me", data);
    return response.data;
  } catch (error) {
    console.error("Update profile error:", error);
    throw error;
  }
};

export const updateProfilePicture = async (imageUri: string) => {
  try {
    const formData = new FormData();
    // @ts-ignore
    formData.append("profilePicture", {
      uri: imageUri,
      name: "profile.jpg",
      type: "image/jpeg",
    });

    const response = await api.put("/users/me/picture", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Update profile picture error:", error);
    throw error;
  }
};
