'use client';

import React from 'react';
import { useDashboard } from '@/features/dashboard/hooks/useDashboard';
import { RecoveryScoreMeter } from '@/features/dashboard/components/RecoveryScoreMeter';
import { TodayWorkoutCard } from '@/features/dashboard/components/TodayWorkoutCard';
import { StreakCounterWidget } from '@/features/dashboard/components/StreakCounterWidget';
import { CalorieHydrationWidget } from '@/features/dashboard/components/CalorieHydrationWidget';
import { LiveSocketFeed } from '@/features/dashboard/components/LiveSocketFeed';
import { Cpu, RefreshCw } from 'lucide-react';

export default function DashboardPage() {
  const { data, isLoading, isError, refetch } = useDashboard();

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
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-obsidian-900 via-obsidian-800 to-obsidian-900 border border-obsidian-700/80 shadow-glass">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Welcome back, <span className="text-neon-cyan">{data.user.name}</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            RESTful API Connected • Neural Engine v4.2 Active • Goal: Hypertrophy
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-obsidian-950/60 border border-obsidian-700 font-mono text-xs text-neon-emerald">
          <Cpu className="w-4 h-4" />
          <span>CNS Readiness: 88%</span>
        </div>
      </div>

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

      {/* Secondary Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StreakCounterWidget />
        <CalorieHydrationWidget calories={data.calories} hydration={data.hydration} />
        <LiveSocketFeed />
      </div>
    </div>
  );
}
