'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/shared/components/GlassCard';
import { Button } from '@/shared/components/Button';
import { Badge } from '@/shared/components/Badge';
import { Exercise } from '../types';
import { useUpdateExercise } from '../hooks/useWorkout';
import { Check, Info, RefreshCw, Minus, Plus } from 'lucide-react';

interface ExerciseCardProps {
  exercise: Exercise;
  onOpenExplanation: (exercise: Exercise) => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  onOpenExplanation,
}) => {
  const [localSets, setLocalSets] = useState(exercise.sets);
  const updateMutation = useUpdateExercise();

  const toggleSet = (index: number) => {
    const newSets = localSets.map((s, idx) => {
      if (idx !== index) return s;
      const isCompleted = !s.completed;
      return { ...s, completed: isCompleted, completedReps: isCompleted ? s.targetReps : 0 };
    });
    setLocalSets(newSets);

    // Call REST API via service hook
    updateMutation.mutate({
      exerciseId: exercise.id,
      payload: { sets: newSets },
    });
  };

  const adjustWeight = (index: number, delta: number) => {
    const newSets = localSets.map((s, idx) => {
      if (idx !== index) return s;
      return { ...s, weightLbs: Math.max(0, s.weightLbs + delta) };
    });
    setLocalSets(newSets);
    updateMutation.mutate({
      exerciseId: exercise.id,
      payload: { sets: newSets },
    });
  };

  return (
    <GlassCard glow="cyan" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-obsidian-700/60 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white">{exercise.name}</h3>
            <Badge variant="cyan">{exercise.category.toUpperCase()}</Badge>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Equipment: {exercise.equipmentNeeded} • Tempo: {exercise.tempo || '2-0-1-0'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {exercise.aiAdjustmentReason && (
            <button
              onClick={() => onOpenExplanation(exercise)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-xs font-medium hover:bg-neon-cyan/20 transition-all cursor-pointer"
            >
              <Info className="w-3.5 h-3.5" />
              <span>AI Logic ({exercise.aiConfidencePercent}%)</span>
            </button>
          )}
        </div>
      </div>

      {/* Sets Table */}
      <div className="space-y-2">
        <div className="grid grid-cols-12 text-[11px] font-mono text-slate-400 px-2 uppercase">
          <span className="col-span-2">Set</span>
          <span className="col-span-3 text-center">Target</span>
          <span className="col-span-4 text-center">Weight (lbs)</span>
          <span className="col-span-3 text-right">Status</span>
        </div>

        {localSets.map((set, idx) => (
          <div
            key={idx}
            className={`grid grid-cols-12 items-center p-2.5 rounded-xl border transition-all ${
              set.completed
                ? 'bg-neon-emerald/10 border-neon-emerald/40'
                : 'bg-obsidian-900/60 border-obsidian-700/60'
            }`}
          >
            <span className="col-span-2 font-mono font-bold text-white text-xs">#{set.setNumber}</span>
            <span className="col-span-3 text-center text-xs text-slate-300">{set.targetReps} reps</span>
            
            {/* Weight Controls */}
            <div className="col-span-4 flex items-center justify-center gap-1.5">
              <button
                onClick={() => adjustWeight(idx, -5)}
                className="w-5 h-5 rounded bg-obsidian-700 hover:bg-obsidian-600 text-slate-300 flex items-center justify-center cursor-pointer"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="font-mono text-xs font-bold text-white w-10 text-center">{set.weightLbs}</span>
              <button
                onClick={() => adjustWeight(idx, 5)}
                className="w-5 h-5 rounded bg-obsidian-700 hover:bg-obsidian-600 text-slate-300 flex items-center justify-center cursor-pointer"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            {/* Checkbox Complete */}
            <div className="col-span-3 flex justify-end">
              <button
                onClick={() => toggleSet(idx)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  set.completed
                    ? 'bg-neon-emerald text-obsidian-950 shadow-neon-emerald/30 shadow-sm'
                    : 'bg-obsidian-700 text-slate-300 hover:bg-obsidian-600'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>{set.completed ? 'Done' : 'Mark'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};
