import { create } from 'zustand';

export type ScenarioMode = 'normal' | 'travel' | 'low-equipment';
export type ViewMode = 'simple' | 'advanced';

interface AppState {
  scenarioMode: ScenarioMode;
  viewMode: ViewMode;
  isMicroWorkoutOpen: boolean;
  waterConsumedMl: number;
  streakShieldActive: boolean;
  
  // Actions
  setScenarioMode: (mode: ScenarioMode) => void;
  setViewMode: (mode: ViewMode) => void;
  setMicroWorkoutOpen: (open: boolean) => void;
  logWater: (amountMl: number) => void;
  activateStreakShield: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  scenarioMode: 'normal',
  viewMode: 'advanced',
  isMicroWorkoutOpen: false,
  waterConsumedMl: 2250,
  streakShieldActive: true,

  setScenarioMode: (mode) => set({ scenarioMode: mode }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setMicroWorkoutOpen: (open) => set({ isMicroWorkoutOpen: open }),
  logWater: (amountMl) => set((state) => ({ waterConsumedMl: state.waterConsumedMl + amountMl })),
  activateStreakShield: () => set({ streakShieldActive: true }),
}));
