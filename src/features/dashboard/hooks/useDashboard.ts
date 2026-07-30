import { useQuery } from '@tanstack/react-query';
import { fetchDashboardData } from '../services/dashboardService';

export const useDashboard = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardData,
  });
};
