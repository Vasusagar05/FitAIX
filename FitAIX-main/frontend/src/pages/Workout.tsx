'use client';

import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from '@/shared/components/GlassCard';
import { Badge } from '@/shared/components/Badge';
import { Button } from '@/shared/components/Button';
import { apiClient } from '@/lib/apiClient';
import { useAppStore } from '@/lib/store';
import { useQueryClient } from '@tanstack/react-query';
import {
  Dumbbell, Sparkles, Plus, Zap, CheckCircle2, X, ChevronDown, ChevronUp,
  Clock, Flame, RefreshCw, Trophy, Play, Pause, RotateCcw, Brain, Trash2
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface WorkoutSet {
  setNumber: number;
  targetReps: number;
  completedReps: number;
  weightLbs: number;
  completed: boolean;
}

interface ActiveExercise {
  id: string;
  name: string;
  category: string;
  restTimerSeconds: number;
  sets: WorkoutSet[];
}

interface ActiveWorkout {
  id: string | number;
  title: string;
  estimatedDurationMins: number;
  exercises: ActiveExercise[];
}

const MUSCLE_OPTIONS = [
  { label: 'Chest', value: 'chest' },
  { label: 'Back', value: 'back' },
  { label: 'Legs', value: 'legs' },
  { label: 'Shoulders', value: 'shoulders' },
  { label: 'Arms', value: 'arms' },
  { label: 'Core', value: 'core' },
  { label: 'Cardio', value: 'cardio' },
];

const EXERCISE_PRESETS: Record<string, { name: string; reps: number }[]> = {
  chest: [
    { name: 'Barbell Bench Press', reps: 10 },
    { name: 'Incline Dumbbell Press', reps: 12 },
    { name: 'Cable Chest Flyes', reps: 15 },
    { name: 'Push-Ups', reps: 20 },
  ],
  back: [
    { name: 'Deadlift', reps: 6 },
    { name: 'Lat Pulldown', reps: 12 },
    { name: 'Bent Over Row', reps: 10 },
    { name: 'Pull-Ups', reps: 8 },
  ],
  legs: [
    { name: 'Barbell Back Squat', reps: 10 },
    { name: 'Romanian Deadlift', reps: 10 },
    { name: 'Leg Press', reps: 12 },
    { name: 'Walking Lunges', reps: 12 },
  ],
  shoulders: [
    { name: 'Overhead Barbell Press', reps: 8 },
    { name: 'Dumbbell Lateral Raise', reps: 15 },
    { name: 'Face Pulls', reps: 15 },
    { name: 'Pike Push-Ups', reps: 10 },
  ],
  arms: [
    { name: 'Barbell Bicep Curl', reps: 12 },
    { name: 'Tricep Rope Extension', reps: 12 },
    { name: 'Hammer Curl', reps: 12 },
    { name: 'Bench Dips', reps: 15 },
  ],
  core: [
    { name: 'Hanging Leg Raise', reps: 12 },
    { name: 'Plank', reps: 60 },
    { name: 'Russian Twist', reps: 20 },
    { name: 'Ab Wheel Rollout', reps: 10 },
  ],
  cardio: [
    { name: 'Burpees', reps: 15 },
    { name: 'Mountain Climbers', reps: 30 },
    { name: 'Jump Rope', reps: 60 },
    { name: 'Box Jumps', reps: 10 },
  ],
};

// ─── RestTimer Component ──────────────────────────────────────────────────────
const RestTimer: React.FC<{ seconds: number; onDone: () => void }> = ({ seconds, onDone }) => {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const [running, setRunning] = useState(true);
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    if (running && timeLeft > 0) {
      intervalRef.current = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      clearInterval(intervalRef.current);
      onDone();
    }
    return () => clearInterval(intervalRef.current);
  }, [running, timeLeft]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const pct = ((seconds - timeLeft) / seconds) * 100;

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30">
      <div className="relative w-12 h-12 shrink-0">
        <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="20" fill="none" stroke="#1F293D" strokeWidth="4" />
          <circle cx="24" cy="24" r="20" fill="none" stroke="#00F0FF" strokeWidth="4"
            strokeDasharray={`${2 * Math.PI * 20}`}
            strokeDashoffset={`${2 * Math.PI * 20 * (1 - pct / 100)}`}
            strokeLinecap="round" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-mono font-bold text-neon-cyan">
          {mins}:{secs.toString().padStart(2, '0')}
        </span>
      </div>
      <div className="flex-1">
        <p className="text-xs font-mono text-neon-cyan font-bold">REST TIMER</p>
        <p className="text-[11px] text-slate-400">Recovery in progress…</p>
      </div>
      <button
        onClick={() => setRunning(r => !r)}
        className="p-1.5 rounded-lg bg-obsidian-800 border border-obsidian-700 text-slate-300 hover:text-white"
      >
        {running ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
      </button>
      <button onClick={onDone} className="p-1.5 rounded-lg bg-obsidian-800 border border-obsidian-700 text-slate-300 hover:text-rose-400">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

// ─── ExerciseRow Component ─────────────────────────────────────────────────────
const ExerciseRow: React.FC<{
  exercise: ActiveExercise;
  onUpdateSet: (exId: string, setNum: number, field: keyof WorkoutSet, val: any) => void;
  onRemove: (exId: string) => void;
}> = ({ exercise, onUpdateSet, onRemove }) => {
  const [expanded, setExpanded] = useState(true);
  const [restTimer, setRestTimer] = useState<{ active: boolean; seconds: number }>({ active: false, seconds: 0 });

  const completedSets = exercise.sets.filter(s => s.completed).length;
  const allDone = completedSets === exercise.sets.length;

  const categoryColors: Record<string, string> = {
    chest: 'cyan', back: 'violet', legs: 'emerald', shoulders: 'cyan',
    arms: 'violet', core: 'emerald', cardio: 'amber', custom: 'cyan',
  };
  const glow = categoryColors[exercise.category] || 'cyan';

  return (
    <div className={`rounded-xl border transition-all ${allDone ? 'border-neon-emerald/40 bg-neon-emerald/5' : 'border-obsidian-700 bg-obsidian-900/60'}`}>
      {/* Exercise Header */}
      <div
        className="flex items-center justify-between p-3 cursor-pointer"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex items-center gap-2.5">
          {allDone
            ? <CheckCircle2 className="w-4 h-4 text-neon-emerald shrink-0" />
            : <Dumbbell className="w-4 h-4 text-neon-cyan shrink-0" />
          }
          <div>
            <h4 className="text-sm font-bold text-white">{exercise.name}</h4>
            <p className="text-[11px] text-slate-400 font-mono capitalize">{exercise.category} · {exercise.sets.length} sets</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-neon-cyan">{completedSets}/{exercise.sets.length}</span>
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(exercise.id); }}
            className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </div>

      {/* Sets Table */}
      {expanded && (
        <div className="px-3 pb-3 space-y-2">
          {restTimer.active && (
            <RestTimer seconds={restTimer.seconds} onDone={() => setRestTimer({ active: false, seconds: 0 })} />
          )}
          <div className="overflow-x-auto scrollbar-none">
            <table className="w-full text-xs font-mono min-w-[280px]">
            <thead>
              <tr className="text-slate-500 border-b border-obsidian-800">
                <th className="pb-1.5 text-left font-medium">SET</th>
                <th className="pb-1.5 text-left font-medium">REPS</th>
                <th className="pb-1.5 text-left font-medium">WEIGHT (lbs)</th>
                <th className="pb-1.5 text-right font-medium">DONE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-obsidian-800/50">
              {exercise.sets.map((set) => (
                <tr key={set.setNumber} className={`transition-colors ${set.completed ? 'opacity-60' : 'hover:bg-obsidian-800/30'}`}>
                  <td className="py-2 font-bold text-white">#{set.setNumber}</td>
                  <td className="py-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onUpdateSet(exercise.id, set.setNumber, 'targetReps', Math.max(1, set.targetReps - 1))}
                        className="w-6 h-6 rounded bg-obsidian-800 border border-obsidian-700 text-slate-300 flex items-center justify-center hover:bg-obsidian-700 text-xs"
                      >-</button>
                      <span className="w-7 text-center text-white font-bold">{set.targetReps}</span>
                      <button
                        onClick={() => onUpdateSet(exercise.id, set.setNumber, 'targetReps', set.targetReps + 1)}
                        className="w-6 h-6 rounded bg-obsidian-800 border border-obsidian-700 text-slate-300 flex items-center justify-center hover:bg-obsidian-700 text-xs"
                      >+</button>
                    </div>
                  </td>
                  <td className="py-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onUpdateSet(exercise.id, set.setNumber, 'weightLbs', Math.max(0, set.weightLbs - 5))}
                        className="w-6 h-6 rounded bg-obsidian-800 border border-obsidian-700 text-slate-300 flex items-center justify-center hover:bg-obsidian-700 text-xs"
                      >-</button>
                      <span className="w-8 text-center text-white font-bold">{set.weightLbs}</span>
                      <button
                        onClick={() => onUpdateSet(exercise.id, set.setNumber, 'weightLbs', set.weightLbs + 5)}
                        className="w-6 h-6 rounded bg-obsidian-800 border border-obsidian-700 text-slate-300 flex items-center justify-center hover:bg-obsidian-700 text-xs"
                      >+</button>
                    </div>
                  </td>
                  <td className="py-2 text-right">
                    <button
                      onClick={() => {
                        const newDone = !set.completed;
                        onUpdateSet(exercise.id, set.setNumber, 'completed', newDone);
                        if (newDone) setRestTimer({ active: true, seconds: exercise.restTimerSeconds });
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-sans font-medium flex items-center gap-1 ml-auto transition-all ${set.completed
                        ? 'bg-neon-emerald/20 text-neon-emerald border border-neon-emerald/40'
                        : 'bg-obsidian-800 text-slate-300 border border-obsidian-700 hover:border-slate-500'
                        }`}
                    >
                      {set.completed ? <><CheckCircle2 className="w-3 h-3" /> Done</> : '✓ Mark'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── CreateWorkoutModal ───────────────────────────────────────────────────────
const CreateWorkoutModal: React.FC<{
  mode: 'manual' | 'ai';
  onClose: () => void;
  onCreated: (workout: ActiveWorkout) => void;
}> = ({ mode, onClose, onCreated }) => {
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState(45);
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>([]);
  const [level, setLevel] = useState('Intermediate');
  const [equipment, setEquipment] = useState('Gym');
  const [manualExercises, setManualExercises] = useState<{ name: string; sets: number; reps: number; rest: number; category: string }[]>([]);
  const [newEx, setNewEx] = useState({ name: '', sets: 3, reps: 10, rest: 60, category: 'chest' });
  const [loading, setLoading] = useState(false);
  // AI two-step: 'config' | 'preview'
  const [aiStep, setAiStep] = useState<'config' | 'preview'>('config');
  const [aiPreviewWorkout, setAiPreviewWorkout] = useState<ActiveWorkout | null>(null);

  const addPresetExercise = (name: string, reps: number, category: string) => {
    setManualExercises(prev => [...prev, { name, sets: 3, reps, rest: 60, category }]);
  };

  const buildWorkoutFromPlan = (plan: any): ActiveWorkout => ({
    id: plan.id,
    title: plan.title,
    estimatedDurationMins: plan.duration_mins || duration,
    exercises: (plan.exercises || []).map((ex: any) => ({
      id: ex.id || String(Math.random()),
      name: ex.name,
      category: ex.category || 'custom',
      restTimerSeconds: parseInt(ex.rest_time || ex.restTimerSeconds) || 60,
      sets: typeof ex.sets === 'number'
        ? Array.from({ length: ex.sets }).map((_: any, i: number) => ({
            setNumber: i + 1, targetReps: 10, completedReps: 0, weightLbs: 45, completed: false
          }))
        : (Array.isArray(ex.sets) ? ex.sets : Array.from({ length: 3 })).map((s: any, i: number) => ({
            setNumber: i + 1,
            targetReps: typeof s === 'object' ? s.targetReps || 10 : 10,
            completedReps: 0,
            weightLbs: 45,
            completed: false
          }))
    }))
  });

  const handleAiGenerate = async () => {
    if (selectedMuscles.length === 0) return;
    setLoading(true);
    try {
      const res = await apiClient.post('/workouts/generate', { muscles: selectedMuscles, duration, level, equipment });
      const workout = buildWorkoutFromPlan(res.data.data);
      setAiPreviewWorkout(workout);
      setAiStep('preview');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (mode === 'ai') {
      if (aiStep === 'config') {
        handleAiGenerate();
        return;
      }
      if (aiPreviewWorkout) {
        onCreated(aiPreviewWorkout);
      }
      return;
    }
    if (!title.trim()) return;
    setLoading(true);
    try {
      const exercises = manualExercises.length > 0 ? manualExercises : [newEx];
      const res = await apiClient.post('/workouts/manual', { title, exercises, duration });
      const plan = res.data.data;
      const workout: ActiveWorkout = {
        id: plan.id,
        title: plan.title,
        estimatedDurationMins: plan.duration_mins || duration,
        exercises: (plan.exercises || exercises.map((ex, i) => ({
          id: String(i + 1), name: ex.name, category: ex.category, restTimerSeconds: ex.rest,
          sets: Array.from({ length: ex.sets }).map((_, si) => ({ setNumber: si + 1, targetReps: ex.reps, completedReps: 0, weightLbs: 45, completed: false }))
        }))).map((ex: any) => ({
          id: ex.id || String(Math.random()),
          name: ex.name,
          category: ex.category || 'custom',
          restTimerSeconds: ex.restTimerSeconds || ex.rest || 60,
          sets: Array.isArray(ex.sets) && typeof ex.sets[0] === 'object' && 'setNumber' in ex.sets[0]
            ? ex.sets
            : Array.from({ length: typeof ex.sets === 'number' ? ex.sets : 3 }).map((_: any, si: number) => ({
                setNumber: si + 1, targetReps: 10, completedReps: 0, weightLbs: 45, completed: false
              }))
        }))
      };
      onCreated(workout);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian-950/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl bg-obsidian-900 border border-obsidian-700 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-obsidian-700">
          <div className="flex items-center gap-2">
            {mode === 'ai'
              ? <Brain className="w-5 h-5 text-neon-violet" />
              : <Dumbbell className="w-5 h-5 text-neon-cyan" />
            }
            <h2 className="text-lg font-bold text-white">
              {mode === 'ai' ? 'AI Workout Generator' : 'Create Workout Manually'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-obsidian-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin">
          {mode === 'manual' && (
            <>
              {/* Title */}
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">Workout Title</label>
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Tuesday Push Day"
                  className="w-full px-3 py-2.5 rounded-xl bg-obsidian-950 border border-obsidian-700 text-white text-sm focus:outline-none focus:border-neon-cyan font-mono placeholder-slate-600"
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">Duration (mins)</label>
                <div className="flex gap-2">
                  {[20, 30, 45, 60, 90].map(d => (
                    <button key={d} onClick={() => setDuration(d)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${duration === d ? 'bg-neon-cyan text-obsidian-950 border-neon-cyan' : 'bg-obsidian-800 text-slate-400 border-obsidian-700 hover:text-white'}`}>
                      {d}m
                    </button>
                  ))}
                </div>
              </div>

              {/* Preset exercises by muscle */}
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-2">Add Exercises (Quick Select)</label>
                <div className="space-y-2">
                  {MUSCLE_OPTIONS.map(m => (
                    <details key={m.value} className="group">
                      <summary className="flex items-center justify-between cursor-pointer px-3 py-2 rounded-lg bg-obsidian-800 border border-obsidian-700 text-sm text-white hover:border-neon-cyan transition-all list-none">
                        <span className="font-medium capitalize">{m.label}</span>
                        <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform" />
                      </summary>
                      <div className="mt-1 p-2 rounded-lg bg-obsidian-950/60 border border-obsidian-800 grid grid-cols-2 gap-1.5">
                        {(EXERCISE_PRESETS[m.value] || []).map(ex => {
                          const alreadyAdded = manualExercises.some(me => me.name === ex.name);
                          return (
                            <button
                              key={ex.name}
                              onClick={() => alreadyAdded
                                ? setManualExercises(prev => prev.filter(me => me.name !== ex.name))
                                : addPresetExercise(ex.name, ex.reps, m.value)
                              }
                              className={`px-2 py-1.5 rounded-lg text-xs text-left transition-all ${alreadyAdded
                                ? 'bg-neon-emerald/20 text-neon-emerald border border-neon-emerald/40'
                                : 'bg-obsidian-800 text-slate-300 border border-obsidian-700 hover:border-neon-cyan hover:text-white'
                                }`}
                            >
                              {alreadyAdded ? '✓ ' : '+ '}{ex.name}
                            </button>
                          );
                        })}
                      </div>
                    </details>
                  ))}
                </div>
              </div>

              {/* Selected exercises summary */}
              {manualExercises.length > 0 && (
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-2">Selected ({manualExercises.length} exercises)</label>
                  <div className="space-y-1.5">
                    {manualExercises.map((ex, i) => (
                      <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg bg-neon-cyan/5 border border-neon-cyan/20">
                        <div>
                          <span className="text-sm text-white font-medium">{ex.name}</span>
                          <span className="ml-2 text-xs text-slate-400 font-mono">{ex.sets}×{ex.reps} reps</span>
                        </div>
                        <button onClick={() => setManualExercises(prev => prev.filter((_, idx) => idx !== i))}
                          className="text-slate-500 hover:text-rose-400">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {mode === 'ai' && aiStep === 'config' && (
            <>
              {/* Muscle Groups */}
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-2">Target Muscle Groups</label>
                <div className="flex flex-wrap gap-2">
                  {MUSCLE_OPTIONS.map(m => (
                    <button
                      key={m.value}
                      onClick={() => setSelectedMuscles(prev =>
                        prev.includes(m.value) ? prev.filter(x => x !== m.value) : [...prev, m.value]
                      )}
                      className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold border transition-all ${selectedMuscles.includes(m.value)
                        ? 'bg-neon-violet/20 text-neon-violet border-neon-violet/50'
                        : 'bg-obsidian-800 text-slate-400 border-obsidian-700 hover:text-white'
                        }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">Duration</label>
                <div className="flex gap-2">
                  {[20, 30, 45, 60, 90].map(d => (
                    <button key={d} onClick={() => setDuration(d)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${duration === d ? 'bg-neon-violet text-white border-neon-violet' : 'bg-obsidian-800 text-slate-400 border-obsidian-700 hover:text-white'}`}>
                      {d}m
                    </button>
                  ))}
                </div>
              </div>

              {/* Level */}
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">Difficulty Level</label>
                <div className="flex gap-2">
                  {['Beginner', 'Intermediate', 'Advanced'].map(l => (
                    <button key={l} onClick={() => setLevel(l)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${level === l ? 'bg-neon-violet text-white border-neon-violet' : 'bg-obsidian-800 text-slate-400 border-obsidian-700 hover:text-white'}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Equipment */}
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">Equipment</label>
                <div className="flex gap-2">
                  {['Gym', 'Home', 'No Equipment'].map(eq => (
                    <button key={eq} onClick={() => setEquipment(eq)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${equipment === eq ? 'bg-neon-violet text-white border-neon-violet' : 'bg-obsidian-800 text-slate-400 border-obsidian-700 hover:text-white'}`}>
                      {eq}
                    </button>
                  ))}
                </div>
              </div>

              {selectedMuscles.length > 0 && (
                <div className="p-3 rounded-xl bg-neon-violet/10 border border-neon-violet/20 text-xs font-mono text-neon-violet">
                  <Sparkles className="w-3.5 h-3.5 inline mr-1" />
                  AI will generate {duration}-min {level.toLowerCase()} {equipment.toLowerCase()} workout for: {selectedMuscles.join(', ')}
                </div>
              )}
            </>
          )}

          {mode === 'ai' && aiStep === 'preview' && aiPreviewWorkout && (
            <>
              {/* Plan Title */}
              <div className="p-3 rounded-xl bg-neon-violet/10 border border-neon-violet/20">
                <div className="flex items-center gap-2 mb-1">
                  <Brain className="w-4 h-4 text-neon-violet" />
                  <span className="text-sm font-bold text-white">{aiPreviewWorkout.title}</span>
                </div>
                <span className="text-xs font-mono text-neon-violet">{aiPreviewWorkout.exercises.length} exercises · {aiPreviewWorkout.estimatedDurationMins} mins</span>
              </div>

              {/* Exercise List — same style as manual */}
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-2">Generated Exercises ({aiPreviewWorkout.exercises.length})</label>
                <div className="space-y-1.5">
                  {aiPreviewWorkout.exercises.map((ex, i) => (
                    <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg bg-neon-violet/5 border border-neon-violet/20">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-neon-violet/20 text-neon-violet text-xs flex items-center justify-center font-bold">{i + 1}</span>
                        <div>
                          <span className="text-sm text-white font-medium">{ex.name}</span>
                          <span className="ml-2 text-xs text-slate-400 font-mono capitalize">{ex.category}</span>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-slate-400">{ex.sets.length} sets · {ex.restTimerSeconds}s rest</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Regenerate option */}
              <button
                onClick={() => { setAiStep('config'); setAiPreviewWorkout(null); }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-obsidian-700 text-xs font-mono text-slate-400 hover:text-white hover:border-neon-violet/50 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Regenerate with different settings
              </button>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-obsidian-700 flex gap-3">
          <Button onClick={onClose} className="flex-1">Cancel</Button>
          <button
            onClick={handleSubmit}
            disabled={
              loading ||
              (mode === 'ai' && aiStep === 'config' && selectedMuscles.length === 0) ||
              (mode === 'manual' && !title.trim())
            }
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${mode === 'ai'
              ? 'bg-neon-violet text-white hover:bg-neon-violet/90'
              : 'bg-neon-cyan text-obsidian-950 hover:bg-neon-cyan/90'
              }`}
          >
            {loading
              ? <><RefreshCw className="w-4 h-4 animate-spin" /> Generating...</>
              : mode === 'ai'
                ? aiStep === 'config'
                  ? <><Brain className="w-4 h-4" /> Generate with AI</>
                  : <><Play className="w-4 h-4" /> Start Workout</>
                : <><Plus className="w-4 h-4" /> Create Workout</>
            }
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── StreakSaverBanner ─────────────────────────────────────────────────────────
const StreakSaverBanner: React.FC<{ onLoad: (w: ActiveWorkout) => void }> = ({ onLoad }) => {
  const [loading, setLoading] = useState(false);

  const handleLoad = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/workouts/streak-saver');
      onLoad(res.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassCard glow="amber" className="flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-neon-amber/20 border border-neon-amber/40 flex items-center justify-center shrink-0">
          <Zap className="w-5 h-5 text-neon-amber" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">15-Min Streak Saver</h3>
          <p className="text-xs text-slate-400 font-mono">No workout today yet — protect your streak with a quick session</p>
        </div>
      </div>
      <button
        onClick={handleLoad}
        disabled={loading}
        className="sm:ml-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-neon-amber text-obsidian-950 font-bold text-sm hover:bg-neon-amber/90 transition-all shrink-0 disabled:opacity-60"
      >
        {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><Zap className="w-4 h-4" /> Load Quick Session</>}
      </button>
    </GlassCard>
  );
};

// ─── Main Workout Page ─────────────────────────────────────────────────────────
export default function WorkoutPage() {
  const [modal, setModal] = useState<'manual' | 'ai' | null>(null);
  const [activeWorkout, setActiveWorkout] = useState<ActiveWorkout | null>(null);
  const [completing, setCompleting] = useState(false);
  const [completionResult, setCompletionResult] = useState<{ streak: any } | null>(null);
  const queryClient = useQueryClient();
  const addCaloriesToday = useAppStore((state) => state.addCaloriesToday);
  const setCaloriesToday = useAppStore((state) => state.setCaloriesToday);

  // Track previous calorie baseline to avoid double-counting on re-renders
  const calorieBaseRef = useRef(0);

  // Update a set field — and update real-time calories if a set is being completed
  const handleUpdateSet = (exId: string, setNum: number, field: keyof WorkoutSet, val: any) => {
    setActiveWorkout(prev => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        exercises: prev.exercises.map(ex =>
          ex.id === exId
            ? { ...ex, sets: ex.sets.map(s => s.setNumber === setNum ? { ...s, [field]: val } : s) }
            : ex
        )
      };

      // Real-time calorie tracking: add calories when a set is marked as done
      if (field === 'completed' && val === true) {
        const totalSets = prev.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
        if (totalSets > 0) {
          // Distribute workout's total estimated calories equally across all sets
          const caloriesPerSet = Math.round((prev.estimatedDurationMins * 8) / totalSets);
          addCaloriesToday(caloriesPerSet);
        }
      }
      // If a set is un-marked, subtract the calories back
      if (field === 'completed' && val === false) {
        const totalSets = prev.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
        if (totalSets > 0) {
          const caloriesPerSet = Math.round((prev.estimatedDurationMins * 8) / totalSets);
          // Subtract by adding a negative value
          addCaloriesToday(-caloriesPerSet);
        }
      }

      return updated;
    });
  };

  const handleRemoveExercise = (exId: string) => {
    setActiveWorkout(prev => {
      if (!prev) return prev;
      return { ...prev, exercises: prev.exercises.filter(ex => ex.id !== exId) };
    });
  };

  const totalSets = activeWorkout?.exercises.reduce((s, ex) => s + ex.sets.length, 0) || 0;
  const completedSets = activeWorkout?.exercises.reduce((s, ex) => s + ex.sets.filter(set => set.completed).length, 0) || 0;
  const progressPct = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

  const handleComplete = async () => {
    if (!activeWorkout) return;
    setCompleting(true);
    try {
      const musclesTrained = [...new Set(activeWorkout.exercises.map(ex => ex.category))].join(', ');
      const caloriesBurned = Math.round(activeWorkout.estimatedDurationMins * 8);
      const res = await apiClient.post('/workouts/complete', {
        planId: activeWorkout.id,
        title: activeWorkout.title,
        durationMins: activeWorkout.estimatedDurationMins,
        caloriesBurned,
        musclesTrained
      });
      setCompletionResult(res.data.data);
      queryClient.invalidateQueries({ queryKey: ['todayWorkout'] });
      queryClient.invalidateQueries({ queryKey: ['streaks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    } catch (e) {
      console.error(e);
    } finally {
      setCompleting(false);
    }
  };

  // Completion success screen
  if (completionResult) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center p-8">
        <div className="w-20 h-20 rounded-full bg-neon-emerald/20 border-2 border-neon-emerald flex items-center justify-center animate-pulse">
          <Trophy className="w-10 h-10 text-neon-emerald" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-white">Workout Complete! 🏆</h2>
          <p className="text-slate-400 font-mono text-sm mt-2">{activeWorkout?.title}</p>
        </div>
        <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
          <div className="p-4 rounded-xl bg-obsidian-900 border border-obsidian-700 text-center">
            <span className="block text-2xl font-black text-neon-cyan">{completionResult.streak?.current_streak ?? 0}</span>
            <span className="text-xs font-mono text-slate-400">Day Streak</span>
          </div>
          <div className="p-4 rounded-xl bg-obsidian-900 border border-obsidian-700 text-center">
            <span className="block text-2xl font-black text-neon-emerald">{completedSets}</span>
            <span className="text-xs font-mono text-slate-400">Sets Done</span>
          </div>
          <div className="p-4 rounded-xl bg-obsidian-900 border border-obsidian-700 text-center">
            <span className="block text-2xl font-black text-neon-amber">{Math.round((activeWorkout?.estimatedDurationMins || 0) * 8)}</span>
            <span className="text-xs font-mono text-slate-400">kcal</span>
          </div>
        </div>
        <button
          onClick={() => { setActiveWorkout(null); setCompletionResult(null); }}
          className="px-6 py-3 rounded-xl bg-neon-cyan text-obsidian-950 font-bold hover:bg-neon-cyan/90 transition-all"
        >
          Back to Workout Tracker
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-obsidian-900 via-obsidian-800 to-obsidian-900 border border-obsidian-700/80 shadow-glass">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-neon-cyan" />
            <span className="text-xs uppercase font-mono text-neon-cyan tracking-wider">Workout Engine</span>
            <Badge variant="cyan">Adaptive AI v1.0</Badge>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            {activeWorkout ? activeWorkout.title : "Workout Tracker"}
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            {activeWorkout
              ? `${activeWorkout.exercises.length} exercises · ${activeWorkout.estimatedDurationMins} mins`
              : "Create today's workout or load a quick streak saver"
            }
          </p>
        </div>

        {!activeWorkout && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setModal('manual')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-obsidian-800 border border-obsidian-700 text-white text-sm font-bold hover:border-neon-cyan transition-all"
            >
              <Plus className="w-4 h-4 text-neon-cyan" />
              Create Manually
            </button>
            <button
              onClick={() => setModal('ai')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neon-violet text-white text-sm font-bold hover:bg-neon-violet/90 transition-all"
            >
              <Brain className="w-4 h-4" />
              Create with AI
            </button>
          </div>
        )}
      </div>

      {/* ── Streak Saver (when no active workout) ── */}
      {!activeWorkout && (
        <StreakSaverBanner onLoad={setActiveWorkout} />
      )}

      {/* ── Active Workout Tracker ── */}
      {activeWorkout && (
        <div className="space-y-4">
          {/* Progress bar */}
          <GlassCard glow="cyan" className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-neon-cyan" />
                <span className="text-sm font-bold text-white">Progress</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-neon-cyan">{completedSets}/{totalSets} sets</span>
                <button
                  onClick={() => setActiveWorkout(null)}
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-rose-400 transition-colors font-mono"
                >
                  <X className="w-3.5 h-3.5" /> Discard
                </button>
              </div>
            </div>
            <div className="relative h-2.5 rounded-full bg-obsidian-800 overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-neon-cyan to-neon-emerald transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-neon-amber" />{Math.round(activeWorkout.estimatedDurationMins * 8 * (progressPct / 100))} kcal</span>
              <span className="text-neon-cyan font-bold">{progressPct}% complete</span>
            </div>
          </GlassCard>

          {/* Exercise list */}
          <div className="space-y-3">
            {activeWorkout.exercises.map(ex => (
              <ExerciseRow
                key={ex.id}
                exercise={ex}
                onUpdateSet={handleUpdateSet}
                onRemove={handleRemoveExercise}
              />
            ))}
          </div>

          {/* Complete button */}
          <button
            onClick={handleComplete}
            disabled={completing || completedSets === 0}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-neon-emerald to-neon-cyan text-obsidian-950 font-black text-base flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-neon-emerald"
          >
            {completing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <><CheckCircle2 className="w-5 h-5" /> Complete Workout</>}
          </button>
        </div>
      )}

      {/* ── No Workout / Info State ── */}
      {!activeWorkout && (
        <GlassCard glow="violet" className="space-y-4">
          <div className="flex items-center gap-2 border-b border-obsidian-700/60 pb-3">
            <Sparkles className="w-4 h-4 text-neon-violet" />
            <h3 className="text-base font-bold text-white">How to start</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: <Dumbbell className="w-6 h-6 text-neon-cyan" />, title: 'Create Manually', desc: 'Pick exercises, sets & reps yourself from our exercise library', color: 'cyan' },
              { icon: <Brain className="w-6 h-6 text-neon-violet" />, title: 'Generate with AI', desc: 'Choose muscle groups & duration — AI builds a personalized plan', color: 'violet' },
              { icon: <Zap className="w-6 h-6 text-neon-amber" />, title: '15-Min Streak Saver', desc: 'Quick bodyweight session to protect your workout streak today', color: 'amber' },
            ].map(item => (
              <div key={item.title} className={`p-4 rounded-xl bg-obsidian-900/60 border border-obsidian-700 space-y-2`}>
                <div className={`w-10 h-10 rounded-xl bg-neon-${item.color}/10 border border-neon-${item.color}/20 flex items-center justify-center`}>
                  {item.icon}
                </div>
                <h4 className="text-sm font-bold text-white">{item.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* ── Modals ── */}
      {modal && (
        <CreateWorkoutModal
          mode={modal}
          onClose={() => setModal(null)}
          onCreated={(w) => { setActiveWorkout(w); setModal(null); }}
        />
      )}
    </div>
  );
}
