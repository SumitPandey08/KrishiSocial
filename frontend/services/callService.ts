import api from '@/services/api';

export const initiateCall = async (initiatorId: string, chatId: string, callType: 'video' | 'audio' = 'audio') => {
  const response = await api.post('/call/initiate', { initiatorId, chatId, callType });
  return response.data;
};

export const toggleParticipate = async (callId: string, userId: string, action: 'accept' | 'reject' | 'decline' | 'end') => {
  const response = await api.post('/call/toggle-participate', { callId, userId, action });
  return response.data;
};

export const getCallHistory = async (userId: string) => {
  const response = await api.get(`/call/history/${userId}`);
  return response.data;
};

export const getCallDetails = async (callId: string) => {
  const response = await api.get(`/call/details/${callId}`);
  return response.data;
};

export const getUserActiveCall = async (userId: string) => {
  const response = await api.get(`/call/active/${userId}`);
  return response.data;
};



