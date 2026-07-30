'use client';

import React, { useEffect, useState } from 'react';
import { useDashboard } from '@/features/dashboard/hooks/useDashboard';
import { useAppStore } from '@/lib/store';
import { apiClient } from '@/lib/apiClient';
import { RecoveryScoreMeter } from '@/features/dashboard/components/RecoveryScoreMeter';
import { TodayWorkoutCard } from '@/features/dashboard/components/TodayWorkoutCard';
import { DashboardMetricsRow } from '@/features/dashboard/components/DashboardMetricsRow';
import { GlassCard } from '@/shared/components/GlassCard';
import {
  Cpu, RefreshCw, Flame, Trophy, CalendarCheck, Dumbbell,
  TrendingUp, BarChart3, CheckCircle2, Circle
} from 'lucide-react';

// ─── Inline Streak + Weekly Summary Card ──────────────────────────────────────
const StreakSummaryCard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/workouts/analytics')
      .then(res => setData(res.data.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <GlassCard glow="amber" className="flex items-center justify-center min-h-[200px]">
        <RefreshCw className="w-5 h-5 text-neon-amber animate-spin" />
      </GlassCard>
    );
  }

  const streakDays = data?.streakDays ?? 0;
  const totalWeeklyCalories = data?.totalWeeklyCalories ?? 0;
  const avgDuration = data?.avgDuration ?? 0;
  const weeklyWorkouts = data?.weeklyWorkouts ?? [];
  const completedCount = weeklyWorkouts.filter((d: any) => d.completed).length;

  return (
    <GlassCard glow="amber" className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-obsidian-700/60 pb-3">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-neon-amber fill-neon-amber/20 animate-pulse" />
          <span className="text-xs uppercase font-mono text-neon-amber tracking-wider">Weekly Streak</span>
        </div>
        <span className="text-xs font-mono text-slate-400">This Week</span>
      </div>

      {/* Big streak number + stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-1 flex flex-col items-center justify-center p-3 rounded-xl bg-neon-amber/10 border border-neon-amber/20 min-h-[90px]">
          <span className="text-3xl sm:text-4xl font-black text-neon-amber">{streakDays}</span>
          <span className="text-[10px] font-mono text-slate-400 mt-0.5">Day Streak</span>
        </div>
        <div className="sm:col-span-2 grid grid-cols-2 gap-2">
          <div className="flex flex-col justify-center p-2.5 rounded-xl bg-obsidian-950/60 border border-obsidian-800">
            <div className="flex items-center gap-1.5 mb-1">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-[10px] font-mono text-slate-400 uppercase">Calories</span>
            </div>
            <span className="text-sm sm:text-base font-black text-white">{totalWeeklyCalories} <span className="text-xs font-mono text-slate-400">kcal</span></span>
          </div>
          <div className="flex flex-col justify-center p-2.5 rounded-xl bg-obsidian-950/60 border border-obsidian-800">
            <div className="flex items-center gap-1.5 mb-1">
              <Dumbbell className="w-3.5 h-3.5 text-neon-violet" />
              <span className="text-[10px] font-mono text-slate-400 uppercase">Sessions</span>
            </div>
            <span className="text-sm sm:text-base font-black text-white">{completedCount} <span className="text-xs font-mono text-slate-400">/ 7</span></span>
          </div>
          <div className="col-span-2 flex flex-col justify-center p-2.5 rounded-xl bg-obsidian-950/60 border border-obsidian-800">
            <div className="flex items-center gap-1.5 mb-1">
              <BarChart3 className="w-3.5 h-3.5 text-neon-cyan" />
              <span className="text-[10px] font-mono text-slate-400 uppercase">Avg Duration</span>
            </div>
            <span className="text-sm sm:text-base font-black text-white">{avgDuration} <span className="text-xs font-mono text-slate-400">mins/session</span></span>
          </div>
        </div>
      </div>

      {/* Day-by-day dots */}
      <div className="flex items-center justify-between pt-1 overflow-x-auto scrollbar-none gap-2">
        {weeklyWorkouts.map((day: any, i: number) => (
          <div key={i} className="flex flex-col items-center gap-1 shrink-0 min-w-[36px]">
            {day.completed
              ? <CheckCircle2 className="w-5 h-5 text-neon-emerald" />
              : <Circle className="w-5 h-5 text-obsidian-700" />
            }
            <span className="text-[10px] font-mono text-slate-500">{day.day}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

// ─── Dashboard Page ────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { data, isLoading, isError, refetch } = useDashboard();
  
  const setStepsToday = useAppStore((state) => state.setStepsToday);
  const setCaloriesToday = useAppStore((state) => state.setCaloriesToday);
  const setWaterConsumed = useAppStore((state) => state.setWaterConsumed);
  const setWaterGoal = useAppStore((state) => state.setWaterGoal);

  useEffect(() => {
    if (data) {
      const state = useAppStore.getState();
      if (state.stepsToday === 0) setStepsToday(data.steps);
      if (state.caloriesToday === 0) setCaloriesToday(data.calories.burned);
      if (state.waterConsumedMl === 2250) setWaterConsumed(data.hydration.consumedMl);
      setWaterGoal(data.hydration.targetMl);
    }
  }, [data, setStepsToday, setCaloriesToday, setWaterConsumed, setWaterGoal]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-3">
        <RefreshCw className="w-8 h-8 text-neon-cyan animate-spin" />
        <p className="text-sm font-mono text-slate-400">Fetching telemetry via REST /api/v1/dashboard...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-6 text-center space-y-3">
        <p className="text-rose-400 font-mono text-sm">Failed to connect to REST backend telemetry.</p>
        <button onClick={() => refetch()} className="px-4 py-2 rounded-xl bg-neon-cyan text-obsidian-950 font-bold text-xs">
          Retry REST Fetch
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-obsidian-900 via-obsidian-800 to-obsidian-900 border border-obsidian-700/80 shadow-glass">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Welcome back, <span className="text-neon-cyan">{data.user.name}</span>
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-400 font-mono mt-0.5">
            RESTful API Connected • Neural Engine v4.2 Active
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-obsidian-950/60 border border-obsidian-700 font-mono text-xs text-neon-emerald self-start sm:self-auto">
          <Cpu className="w-4 h-4" />
          <span>CNS Readiness: 88%</span>
        </div>
      </div>

      {/* Horizontal Metrics Row */}
      <DashboardMetricsRow
        initialRecovery={data.recoveryScore}
        initialCalories={data.calories}
        initialHydration={data.hydration}
        initialSteps={data.steps}
        distanceKm={data.distanceKm}
      />

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecoveryScoreMeter
            score={data.recoveryScore.overall}
            hrvMs={data.recoveryScore.hrvMs}
            sleepHours={data.recoveryScore.sleepHours}
            readiness={data.recoveryScore.readiness}
          />
        </div>
        <div>
          <TodayWorkoutCard />
        </div>
      </div>

      {/* Streak & Weekly Summary (replaces old streak + socket feed) */}
      <StreakSummaryCard />
    </div>
  );
}


