export interface WorkoutSet {
  setNumber: number;
  targetReps: number;
  completedReps: number;
  weightLbs: number;
  completed: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  category: string;
  targetMuscles: string[];
  equipmentNeeded: string;
  tempo?: string;
  restTimerSeconds: number;
  aiAdjustmentReason?: string;
  aiConfidencePercent?: number;
  sets: WorkoutSet[];
}

export interface WorkoutPlan {
  id: string;
  title: string;
  subtitle: string;
  estimatedDurationMins: number;
  targetMuscles: string[];
  scenario: string;
  version: string;
  isCompleted: boolean;
  exercises: Exercise[];
}
