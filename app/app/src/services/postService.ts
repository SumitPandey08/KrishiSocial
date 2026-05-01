import api from "./api";

export const createPost = async (
  caption: string,
  location: string,
  images: any[],
  privacy: string,
  postType: string = "update",
  community?: string,
) => {
  try {
    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("location", location);
    formData.append("privacy", privacy);
    formData.append("postType", postType);
    if (community) {
      formData.append("community", community);
    }

    images.forEach((image, index) => {
      // @ts-ignore
      formData.append("media", {
        uri: image.uri,
        name: `image_${index}.jpg`,
        type: "image/jpeg",
      });
    });

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

export const getPosts = async () => {
  try {
    const response = await api.get("/posts/feed");
    return response.data;
  } catch (error) {
    console.error("Get posts error:", error);
    throw error;
  }
};

export const getPostById = async (postId: string) => {
  try {
    const response = await api.get(`/posts/${postId}`);
    return response.data;
  } catch (error) {
    console.error("Get post by ID error:", error);
    throw error;
  }
};

export const likePost = async (postId: string) => {
  try {
    const response = await api.post(`/posts/${postId}/like`, {});
    return response.data;
  } catch (error) {
    console.error("Like post error:", error);
    throw error;
  }
};

export const commentOnPost = async (postId: string, comment: string) => {
  try {
    const response = await api.post(`/posts/${postId}/comment`, { comment });
    return response.data;
  } catch (error) {
    console.error("Comment on post error:", error);
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

export const toggleLike = async (postId: string, action: "like" | "unlike" = "like") => {
  try {
    const response = await api.post(`/posts/${postId}/like?action=${action}`, {});
    return response.data;
  } catch (error) {
    console.error("Toggle like error:", error);
    throw error;
  }
};

export const getComments = async (postId: string) => {
  try {
    const response = await api.get(`/posts/${postId}/comments`);
    return response.data;
  } catch (error) {
    console.error("Get comments error:", error);
    throw error;
  }
};

export const getLikes = async (postId: string) => {
  try {
    const response = await api.get(`/posts/${postId}/likes`);
    return response.data;
  } catch (error) {
    console.error("Get likes error:", error);
    throw error;
  }
};

export const toggleCommentLike = async (commentId: string, action: "like" | "unlike" = "like") => {
  try {
    const response = await api.post(`/posts/comment/${commentId}/like?action=${action}`, {});
    return response.data;
  } catch (error) {
    console.error("Toggle comment like error:", error);
    throw error;
  }
};

export const markBestAnswer = async (commentId: string) => {
  try {
    const response = await api.post(`/posts/comment/${commentId}/best`, {});
    return response.data;
  } catch (error) {
    console.error("Mark best answer error:", error);
    throw error;
  }
};

export const verifyComment = async (commentId: string) => {
  try {
    const response = await api.post(`/posts/comment/${commentId}/verify`, {});
    return response.data;
  } catch (error) {
    console.error("Verify comment error:", error);
    throw error;
  }
};

export const getUserPosts = async (userId: string) => {
  try {
    const response = await api.get(`/users/${userId}/posts`);
    return response.data;
  } catch (error) {
    console.error("Get user posts error:", error);
    throw error;
  }
};
