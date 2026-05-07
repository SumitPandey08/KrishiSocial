import api from "./api";

export const sendMessage = async (messageData: any) => {
  const response = await api.post("/messages", messageData);
  return response.data;
};

export const editMessage = async (messageId: string, content: string) => {
  const response = await api.put(`/messages/${messageId}`, { content });
  return response.data;
};

export const deleteMessage = async (messageId: string) => {
  const response = await api.delete(`/messages/${messageId}`);
  return response.data;
};

export const markAsRead = async (chatId: string) => {
  const response = await api.put(`/messages/chat/${chatId}/read`);
  return response.data;
};
