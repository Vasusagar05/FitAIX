'use client';

import React from 'react';
import { GlassCard } from '@/shared/components/GlassCard';
import { Button } from '@/shared/components/Button';
import { Flame, ShieldCheck, Zap } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export const StreakCounterWidget: React.FC = () => {
  const { streakShieldActive, setMicroWorkoutOpen } = useAppStore();

  return (
    <GlassCard glow="amber" className="flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-neon-amber fill-neon-amber/20 animate-pulse" />
          <span className="text-xs uppercase font-mono text-neon-amber tracking-wider">Streak Engine</span>
        </div>
        <span className="text-xs font-mono text-slate-400">Best: 28 Days</span>
      </div>

      <div className="my-2">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-black text-white tracking-tight">14</span>
          <span className="text-sm font-semibold text-slate-300">Days Active</span>
        </div>
        <p className="text-xs text-slate-400 mt-1">Consistency score is 96% top percentile.</p>
      </div>

      <div className="p-3 rounded-xl bg-obsidian-900/60 border border-obsidian-700/60 my-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-neon-emerald" />
          <div>
            <span className="block text-xs font-bold text-white">Streak Shield</span>
            <span className="text-[10px] text-slate-400">Auto-protects if missed</span>
          </div>
        </div>
        <span className="text-xs font-mono text-neon-emerald font-semibold">2 Active</span>
      </div>

      <Button
        variant="amber"
        size="sm"
        className="w-full mt-2"
        onClick={() => setMicroWorkoutOpen(true)}
      >
        <Zap className="w-3.5 h-3.5" />
        Short on time? 7-Min Micro Workout
      </Button>
    </GlassCard>
  );
};
