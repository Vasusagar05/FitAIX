export interface ScheduleDay {
  day: string;
  title: string;
  muscle: string;
  stressLevel: 'emerald' | 'amber' | 'rose';
  isCompleted: boolean;
  warning?: string;
}
