import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchSchedule, updateScheduleDay } from '../services/calendarService';
import { ScheduleDay } from '../types';

export const useSchedule = () => {
  return useQuery({
    queryKey: ['schedule'],
    queryFn: fetchSchedule,
  });
};

export const useUpdateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<ScheduleDay> }) =>
      updateScheduleDay(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule'] });
    },
  });
};
