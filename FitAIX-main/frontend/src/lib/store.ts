import { create } from 'zustand';

export type ScenarioMode = 'normal';

interface AppState {
  scenarioMode: ScenarioMode;
  isMicroWorkoutOpen: boolean;
  waterConsumedMl: number;
  streakShieldActive: boolean;
  // New fitness tracking fields
  stepsToday: number;
  caloriesToday: number;
  waterGoalMl: number;
  
  // Actions
  setScenarioMode: (mode: ScenarioMode) => void;
  setMicroWorkoutOpen: (open: boolean) => void;
  logWater: (amountMl: number) => void;
  activateStreakShield: () => void;
  setStepsToday: (steps: number) => void;
  setCaloriesToday: (calories: number) => void;
  addCaloriesToday: (calories: number) => void;
  setWaterGoal: (goalMl: number) => void;
  setWaterConsumed: (amountMl: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  scenarioMode: 'normal',
  isMicroWorkoutOpen: false,
  waterConsumedMl: 2250,
  streakShieldActive: true,
  // Initialize new tracking fields
  stepsToday: 0,
  caloriesToday: 0,
  waterGoalMl: 3000,

  setScenarioMode: (mode) => set({ scenarioMode: mode }),
  setMicroWorkoutOpen: (open) => set({ isMicroWorkoutOpen: open }),
  logWater: (amountMl) => set((state) => ({ waterConsumedMl: state.waterConsumedMl + amountMl })),
  activateStreakShield: () => set({ streakShieldActive: true }),
  setStepsToday: (steps) => set({ stepsToday: steps }),
  setCaloriesToday: (calories) => set({ caloriesToday: calories }),
  addCaloriesToday: (calories) => set((state) => ({ caloriesToday: state.caloriesToday + calories })),
  setWaterGoal: (goalMl) => set({ waterGoalMl: goalMl }),
  setWaterConsumed: (amountMl) => set({ waterConsumedMl: amountMl }),
}));
