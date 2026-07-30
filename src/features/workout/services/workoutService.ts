import { apiClient, ApiResponse } from '@/lib/apiClient';
import { WorkoutPlan, Exercise } from '../types';

export const fetchTodayWorkout = async (): Promise<WorkoutPlan> => {
  const response = await apiClient.get<ApiResponse<WorkoutPlan>>('/workouts/today');
  return response.data.data;
};

export const updateExercise = async (exerciseId: string, payload: Partial<Exercise>): Promise<any> => {
  const response = await apiClient.patch<ApiResponse>(`/exercises/${exerciseId}`, payload);
  return response.data.data;
};

export const generateWorkoutPlan = async (scenario: string): Promise<WorkoutPlan> => {
  const response = await apiClient.post<ApiResponse<WorkoutPlan>>('/workouts', { scenario });
  return response.data.data;
};
