import { apiClient, ApiResponse } from '@/lib/apiClient';
import { ChatMessage } from '../types';

export const sendChatMessage = async (message: string): Promise<ChatMessage> => {
  const response = await apiClient.post<ApiResponse<ChatMessage>>('/chat', { message });
  return response.data.data;
};
