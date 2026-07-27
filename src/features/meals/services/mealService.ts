import { apiClient, ApiResponse } from '@/lib/apiClient';
import { Meal } from '../types';

export const fetchMeals = async (budgetTier?: string): Promise<Meal[]> => {
  const response = await apiClient.get<ApiResponse<Meal[]>>('/meals', {
    params: { budget: budgetTier },
  });
  return response.data.data;
};

export const generateGroceryList = async (): Promise<{ items: string[] }> => {
  const response = await apiClient.post<ApiResponse<{ items: string[] }>>('/grocery-list');
  return response.data.data;
};
