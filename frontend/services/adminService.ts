import api from "./api";

export const getAdminStats = async () => {
  const response = await api.get("/admin/stats");
  return response.data;
};

export const getCommunityRequests = async () => {
  const response = await api.get("/admin/community-requests");
  return response.data;
};

export const updateCommunityStatus = async (id: string, status: "approved" | "rejected") => {
  const response = await api.patch(`/admin/community-status/${id}`, { status });
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get("/admin/users");
  return response.data;
};

export const updateUserRole = async (id: string, role: string) => {
  const response = await api.patch(`/admin/user-role/${id}`, { role });
  return response.data;
};
