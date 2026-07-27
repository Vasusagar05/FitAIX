import { useQuery } from '@tanstack/react-query';
import { fetchProgressData } from '../services/progressService';

export const useProgress = () => {
  return useQuery({
    queryKey: ['progress'],
    queryFn: fetchProgressData,
  });
};
