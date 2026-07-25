'use client';

import React from 'react';
import { GlassCard } from '@/shared/components/GlassCard';
import { Button } from '@/shared/components/Button';
import { Flame, Droplets, Plus } from 'lucide-react';
import { useAppStore } from '@/lib/store';

interface CalorieHydrationWidgetProps {
  calories: { target: number; burned: number; consumed: number };
  hydration: { targetMl: number; consumedMl: number };
}

export const CalorieHydrationWidget: React.FC<CalorieHydrationWidgetProps> = ({
  calories,
  hydration,
}) => {
  const { waterConsumedMl, logWater } = useAppStore();

  const currentWater = Math.max(hydration.consumedMl, waterConsumedMl);
  const waterPercent = Math.min(100, Math.round((currentWater / hydration.targetMl) * 100));

  return (
    <GlassCard glow="emerald" className="flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase font-mono text-neon-emerald tracking-wider">Nutrition & Hydro</span>
        <span className="text-xs font-mono text-slate-400">Daily Balance</span>
      </div>

      <div className="space-y-4 my-2">
        {/* Calorie Progress */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Flame className="w-3.5 h-3.5 text-neon-amber" />
              Calories Consumed
            </span>
            <span className="font-mono text-white font-bold">{calories.consumed} / {calories.target} <span className="text-[10px] text-slate-400">kcal</span></span>
          </div>
          <div className="w-full bg-obsidian-700 h-2 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-neon-amber to-neon-emerald h-full rounded-full" style={{ width: `${(calories.consumed / calories.target) * 100}%` }} />
          </div>
        </div>

        {/* Hydration Logger */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Droplets className="w-3.5 h-3.5 text-neon-cyan" />
              Water Intake ({waterPercent}%)
            </span>
            <span className="font-mono text-white font-bold">{currentWater} / {hydration.targetMl} <span className="text-[10px] text-slate-400">ml</span></span>
          </div>
          <div className="w-full bg-obsidian-700 h-2 rounded-full overflow-hidden mb-2">
            <div className="bg-gradient-to-r from-neon-cyan to-neon-violet h-full rounded-full transition-all duration-500" style={{ width: `${waterPercent}%` }} />
          </div>
        </div>
      </div>

      <Button
        variant="cyan"
        size="sm"
        className="w-full"
        onClick={() => logWater(250)}
      >
        <Plus className="w-3.5 h-3.5" />
        Log +250ml Water
      </Button>
    </GlassCard>
  );
};
