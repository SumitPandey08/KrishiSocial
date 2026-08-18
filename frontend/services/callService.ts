import api from '@/services/api';

export const initiateCall = async (callId: string, userId: string, peerId: string) => {
  const response = await api.post('/call/initiate', { callId, userId, peerId });
  return response.data;
};

export const toggleParticipate = async (callId: string, userId: string, action: 'accept' | 'reject' | 'end') => {
  const response = await api.post('/call/toggle-participate', { callId, userId , action });
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


