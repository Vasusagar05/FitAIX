export interface ProgressPoint {
  date: string;
  bench1RM: number;
  squat1RM: number;
  bodyWeightLbs: number;
  adherenceRatePercent: number;
}

export interface AIMemoryEvent {
  id: string;
  date: string;
  title: string;
  category: string;
  description: string;
  impactBadge: string;
}

export interface ProgressResponseData {
  points: ProgressPoint[];
  aiEvents: AIMemoryEvent[];
}
