import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTodayWorkout, updateExercise } from '../services/workoutService';
import { Exercise } from '../types';

export const useWorkout = () => {
  return useQuery({
    queryKey: ['todayWorkout'],
    queryFn: fetchTodayWorkout,
  });
};

export const useUpdateExercise = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ exerciseId, payload }: { exerciseId: string; payload: Partial<Exercise> }) =>
      updateExercise(exerciseId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todayWorkout'] });
    },
  });
};
