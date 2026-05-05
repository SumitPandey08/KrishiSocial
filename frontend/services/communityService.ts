import api from "./api";

export const getCommunities = async (status: string = "approved") => {
  try {
    const response = await api.get(`/communities?status=${status}`);
    return response.data;
  } catch (error) {
    console.error("Get communities error:", error);
    throw error;
  }
};

export const getCommunity = async (id: string) => {
  try {
    const response = await api.get(`/communities/${id}`);
    return response.data;
  } catch (error) {
    console.error("Get community error:", error);
    throw error;
  }
};

export const createCommunity = async (data: { name: string, description: string, tags: string[] }) => {
  try {
    const response = await api.post("/communities", data);
    return response.data;
  } catch (error) {
    console.error("Create community error:", error);
    throw error;
  }
};

export const joinCommunity = async (id: string) => {
  try {
    const response = await api.post(`/communities/${id}/join`);
    return response.data;
  } catch (error) {
    console.error("Join community error:", error);
    throw error;
  }
};

export const leaveCommunity = async (id: string) => {
  try {
    const response = await api.delete(`/communities/${id}`);
    return response.data;
  } catch (error) {
    console.error("Leave community error:", error);
    throw error;
  }
};

export const updateCommunityStatus = async (id: string, status: "approved" | "rejected") => {
  try {
    const response = await api.patch(`/communities/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error("Update community status error:", error);
    throw error;
  }
};
