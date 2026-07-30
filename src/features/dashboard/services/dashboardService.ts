import { apiClient, ApiResponse } from '@/lib/apiClient';
import { DashboardData } from '../types';

export const fetchDashboardData = async (): Promise<DashboardData> => {
  const response = await apiClient.get<ApiResponse<DashboardData>>('/dashboard');
  return response.data.data;
};
