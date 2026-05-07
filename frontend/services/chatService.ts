import api from "./api";

export const createChat = async (chatData: any) => {
  const response = await api.post("/chats", chatData);
  return response.data;
};

export const getUserChats = async () => {
  const response = await api.get("/chats");
  return response.data;
};

export const addParticipant = async (chatId: string, userId: string) => {
  const response = await api.put(`/chats/${chatId}/add`, { userId });
  return response.data;
};

export const removeParticipant = async (chatId: string, userId: string) => {
  const response = await api.put(`/chats/${chatId}/remove`, { userId });
  return response.data;
};

export const deleteChat = async (chatId: string) => {
  const response = await api.delete(`/chats/${chatId}`);
  return response.data;
};

export const getChatMessages = async (chatId: string, params = {}) => {
  const response = await api.get(`/chats/${chatId}/messages`, { params });
  return response.data;
};

export const exitChat = async (chatId: string) => {
  const response = await api.put(`/chats/${chatId}/exit`);
  return response.data;
};
