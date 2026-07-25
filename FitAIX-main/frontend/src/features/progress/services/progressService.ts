import { apiClient, ApiResponse } from '@/lib/apiClient';
import { ProgressResponseData } from '../types';

export const fetchProgressData = async (): Promise<ProgressResponseData> => {
  const response = await apiClient.get<ApiResponse<ProgressResponseData>>('/progress');
  return response.data.data;
};
