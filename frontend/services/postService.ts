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

export const createPost = async (formData: FormData) => {
  try {
    const response = await api.post("/posts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Create post error:", error);
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

export const toggleVote = async (postId: string, type: "upvote" | "downvote") => {
  try {
    const response = await api.patch(`/posts/${postId}/vote`, { type });
    return response.data;
  } catch (error) {
    console.error("Toggle vote error:", error);
    throw error;
  }
};

export const toggleCommentVote = async (commentId: string, type: "upvote" | "downvote") => {
  try {
    const response = await api.patch(`/posts/comment/${commentId}/vote`, { type });
    return response.data;
  } catch (error) {
    console.error("Toggle comment vote error:", error);
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
