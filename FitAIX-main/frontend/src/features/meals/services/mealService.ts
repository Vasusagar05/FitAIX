import { apiClient, ApiResponse } from '@/lib/apiClient';
import { Meal } from '../types';

export const fetchMeals = async (budgetTier?: string): Promise<Meal[]> => {
  try {
    const response = await apiClient.get<ApiResponse<Meal[]>>('/meals', {
      params: { budget: budgetTier },
    });

    return Array.isArray(response?.data?.data)
      ? response.data.data
      : [];
  } catch (error) {
    console.error('fetchMeals failed:', error);
    return [];
  }
};

export const createMeal = async (payload: Omit<Meal, 'id'>): Promise<Meal> => {
  const response = await apiClient.post<ApiResponse<Meal>>('/meals', payload);
  return response.data.data;
};

export const deleteMeal = async (mealId: string): Promise<void> => {
  await apiClient.delete(`/meals/${mealId}`);
};

export const generateAIMeal = async (
  mealType: string, goal: string = 'Muscle Gain', budget: string = '$'
): Promise<Meal> => {
  const response = await apiClient.post<ApiResponse<Meal>>('/meals/ai-generate', {
    mealType, goal, budget
  });
  return response.data.data;
};

export const generateGroceryList = async (): Promise<{ items: string[] }> => {
  try {
    const response = await apiClient.post<ApiResponse<{ items: string[] }>>('/grocery-list');
    return response?.data?.data || { items: [] };
  } catch (error) {
    console.error('grocery list failed:', error);
    return { items: [] };
  }
};