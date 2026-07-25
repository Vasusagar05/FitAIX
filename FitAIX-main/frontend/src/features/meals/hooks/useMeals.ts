import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchMeals, generateGroceryList } from '../services/mealService';

export const useMealPlan = (budgetTier?: string) => {
  return useQuery({
    queryKey: ['meals', budgetTier],
    queryFn: () => fetchMeals(budgetTier),
  });
};

export const useGenerateGroceryList = () => {
  return useMutation({
    mutationFn: generateGroceryList,
  });
};
