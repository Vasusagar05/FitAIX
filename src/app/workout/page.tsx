'use client';

import React, { useState } from 'react';
import { useWorkout } from '@/features/workout/hooks/useWorkout';
import { ExerciseCard } from '@/features/workout/components/ExerciseCard';
import { WorkoutVersionComparison } from '@/features/workout/components/WorkoutVersionComparison';
import { AIExplanationPanel } from '@/features/workout/components/AIExplanationPanel';
import { Exercise } from '@/features/workout/types';
import { Dumbbell, Sparkles, RefreshCw, Zap } from 'lucide-react';
import { Button } from '@/shared/components/Button';
import { Badge } from '@/shared/components/Badge';

export default function WorkoutPage() {
  const { data: workout, isLoading, isError, refetch } = useWorkout();
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-3">
        <RefreshCw className="w-8 h-8 text-neon-violet animate-spin" />
        <p className="text-sm font-mono text-slate-400">Loading workout plan via REST /api/v1/workouts/today...</p>
      </div>
    );
  }

  if (isError || !workout) {
    return (
      <div className="p-6 text-center space-y-3">
        <p className="text-rose-400 font-mono text-sm">Failed to load workout plan.</p>
        <Button onClick={() => refetch()}>Retry REST Fetch</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-obsidian-900 via-obsidian-800 to-obsidian-900 border border-obsidian-700/80 shadow-glass">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-neon-cyan" />
            <span className="text-xs uppercase font-mono text-neon-cyan tracking-wider">Workout Engine</span>
            <Badge variant="cyan">{workout.version}</Badge>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">{workout.title}</h1>
          <p className="text-xs text-slate-400 font-mono mt-1">{workout.subtitle}</p>
        </div>
      </div>

      {/* Version Comparison */}
      <WorkoutVersionComparison />

      {/* Exercises List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-neon-cyan" />
            Exercise Progression ({workout.exercises.length} Exercises)
          </h2>
          <span className="text-xs font-mono text-slate-400">REST Auto-Sync Enabled</span>
        </div>

        {workout.exercises.map((ex) => (
          <ExerciseCard
            key={ex.id}
            exercise={ex}
            onOpenExplanation={(exercise) => setSelectedExercise(exercise)}
          />
        ))}
      </div>

      {/* AI Explanation Drawer Modal */}
      <AIExplanationPanel
        exercise={selectedExercise}
        onClose={() => setSelectedExercise(null)}
      />
    </div>
  );
}
