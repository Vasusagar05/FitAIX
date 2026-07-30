import { apiClient, ApiResponse } from '@/lib/apiClient';
import { ScheduleDay } from '../types';

export const fetchSchedule = async (): Promise<ScheduleDay[]> => {
  const response = await apiClient.get<ApiResponse<ScheduleDay[]>>('/schedule');
  return response.data.data;
};

export const updateScheduleDay = async (id: string, payload: Partial<ScheduleDay>): Promise<ScheduleDay> => {
  const response = await apiClient.patch<ApiResponse<ScheduleDay>>(`/schedule/${id}`, payload);
  return response.data.data;
};
