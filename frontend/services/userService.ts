import api from "./api";

export const searchUsers = async (query: string) => {
  try {
    const response = await api.get(`/users/search?q=${query}`);
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
    const response = await api.post(`/users/${userId}/toggle-follow`);
    return response.data;
  } catch (error) {
    console.error("Toggle follow error:", error);
    throw error;
  }
};

export const updateProfile = async (data: any) => {
  try {
    const response = await api.put("/users/me", data);
    return response.data;
  } catch (error) {
    console.error("Update profile error:", error);
    throw error;
  }
};

export const updateProfilePicture = async (formData: FormData) => {
  try {
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
