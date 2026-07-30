'use client';

import React from 'react';
import { GlassCard } from '@/shared/components/GlassCard';
import { useAppStore } from '@/lib/store';
import { HeartPulse, Activity, Droplets, Flame, Plus } from 'lucide-react';

interface DashboardMetricsRowProps {
  initialRecovery: {
    overall: number;
    hrvMs: number;
    sleepHours: number;
  };
  initialCalories: {
    target: number;
    burned: number;
    consumed: number;
  };
  initialHydration: {
    targetMl: number;
    consumedMl: number;
  };
  initialSteps: number;
  distanceKm: number;
}

export const DashboardMetricsRow: React.FC<DashboardMetricsRowProps> = ({
  initialRecovery,
  initialCalories,
  initialHydration,
  initialSteps,
  distanceKm,
}) => {
  const { waterConsumedMl, waterGoalMl, stepsToday, caloriesToday, logWater } = useAppStore();

  // Calculate percentages
  const stepPercent = Math.min(100, Math.round((stepsToday / 10000) * 100));
  const waterPercent = Math.min(100, Math.round((waterConsumedMl / waterGoalMl) * 100));
  
  // Calculate distance based on steps if not initialized, otherwise use the backend's relative km
  const displayKm = stepsToday > 0 ? (stepsToday * 0.00075).toFixed(2) : distanceKm.toFixed(2);

  // Calories burnt progress — driven by real-time workout tracker via global store
  const caloriesBurntTarget = initialCalories.target || 800;
  const caloriesBurntPercent = Math.min(100, Math.round((caloriesToday / caloriesBurntTarget) * 100));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
      {/* Recovery Score Card */}
      <GlassCard glow="violet" className="flex flex-col justify-between p-4 sm:p-5 min-h-[140px] sm:min-h-[160px]">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase font-mono text-neon-violet tracking-wider">Recovery telemetry</span>
            <HeartPulse className="w-5 h-5 text-neon-violet" />
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{initialRecovery.overall}%</span>
            <span className="text-xs font-mono text-neon-emerald">Optimal</span>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-obsidian-700/50 flex justify-between text-xs text-slate-400 font-mono">
          <div>HRV: <span className="text-white font-bold">{initialRecovery.hrvMs} ms</span></div>
          <div>Sleep: <span className="text-white font-bold">{initialRecovery.sleepHours} hrs</span></div>
        </div>
      </GlassCard>

      {/* Step Counts Card */}
      <GlassCard glow="cyan" className="flex flex-col justify-between p-5 min-h-[160px]">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase font-mono text-neon-cyan tracking-wider">Step Count</span>
            <Activity className="w-5 h-5 text-neon-cyan" />
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-extrabold text-white tracking-tight">{stepsToday.toLocaleString()}</span>
            <span className="text-xs text-slate-400 font-mono">/ 10k goal</span>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="w-full bg-obsidian-700 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-neon-cyan to-neon-violet h-full rounded-full transition-all duration-500" style={{ width: `${stepPercent}%` }} />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>{stepPercent}% completed</span>
            <span>{displayKm} km</span>
          </div>
        </div>
      </GlassCard>

      {/* Water Intake Card */}
      <GlassCard glow="emerald" className="flex flex-col justify-between p-5 min-h-[160px]">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase font-mono text-neon-emerald tracking-wider">Hydration</span>
            <Droplets className="w-5 h-5 text-neon-emerald" />
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-extrabold text-white tracking-tight">{waterConsumedMl.toLocaleString()} ml</span>
            <span className="text-xs text-slate-400 font-mono">/ {waterGoalMl / 1000}L</span>
          </div>
        </div>
        <div className="mt-4 space-y-3">
          <div className="w-full bg-obsidian-700 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-neon-emerald to-neon-cyan h-full rounded-full transition-all duration-500" style={{ width: `${waterPercent}%` }} />
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] text-slate-400 font-mono">{waterPercent}% logged</span>
            <button
              onClick={() => logWater(250)}
              className="px-2 py-0.5 rounded-lg bg-neon-emerald/20 hover:bg-neon-emerald/30 border border-neon-emerald/40 text-neon-emerald text-[10px] font-bold flex items-center gap-0.5 transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Log 250ml
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Calories Burnt Card */}
      <GlassCard glow="amber" className="flex flex-col justify-between p-5 min-h-[160px]">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase font-mono text-neon-amber tracking-wider">Active Energy</span>
            <Flame className="w-5 h-5 text-neon-amber" />
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-extrabold text-white tracking-tight transition-all duration-300">{caloriesToday} kcal</span>
            <span className="text-xs text-slate-400 font-mono">burnt</span>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="w-full bg-obsidian-700 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-neon-amber to-neon-rose h-full rounded-full transition-all duration-500" style={{ width: `${caloriesBurntPercent}%` }} />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>Burn Goal: {caloriesBurntTarget} kcal</span>
            <span>{caloriesBurntPercent}%</span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
