export interface DashboardData {
  user: {
    id: string;
    name: string;
    avatarUrl: string;
    goal: string;
    scenarioMode: string;
    viewMode: string;
  };
  recoveryScore: {
    overall: number;
    hrvMs: number;
    sleepHours: number;
    readiness: Record<string, number>;
  };
  streak: {
    currentDays: number;
    shieldActive: boolean;
    shieldsLeft: number;
  };
  calories: {
    target: number;
    burned: number;
    consumed: number;
  };
  hydration: {
    targetMl: number;
    consumedMl: number;
  };
}
