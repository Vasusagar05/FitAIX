import { apiClient, ApiResponse, withRetry } from '@/lib/apiClient';
import { ChatMessage } from '../types';

export const sendChatMessage = async (message: string): Promise<ChatMessage> => {
  const response = await withRetry(() => apiClient.post<ApiResponse<ChatMessage>>('/chat', { message }));
  return response.data.data;
};
