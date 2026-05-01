import api from "./api";

export const getPosts = async () => {
  try {
    const response = await api.get("/posts/feed");
    return response.data;
  } catch (error) {
    console.error("Get posts error:", error);
    throw error;
  }
};

export const toggleLike = async (postId: string, action: "like" | "unlike" = "like") => {
  try {
    const response = await api.post(`/posts/${postId}/like?action=${action}`, {});
    return response.data;
  } catch (error) {
    console.error("Toggle like error:", error);
    throw error;
  }
};

export const deletePost = async (postId: string) => {
  try {
    const response = await api.delete(`/posts/${postId}`);
    return response.data;
  } catch (error) {
    console.error("Delete post error:", error);
    throw error;
  }
};
