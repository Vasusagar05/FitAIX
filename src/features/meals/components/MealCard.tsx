'use client';

import React from 'react';
import { GlassCard } from '@/shared/components/GlassCard';
import { Badge } from '@/shared/components/Badge';
import { Meal } from '../types';
import { Utensils, Clock, Flame, DollarSign } from 'lucide-react';

interface MealCardProps {
  meal: Meal;
}

export const MealCard: React.FC<MealCardProps> = ({ meal }) => {
  return (
    <GlassCard glow="emerald" className="space-y-3">
      <div className="flex items-center justify-between">
        <Badge variant="emerald">{meal.mealType.toUpperCase()}</Badge>
        <span className="font-mono text-xs font-bold text-neon-emerald">{meal.budgetTier} Budget</span>
      </div>

      <h3 className="text-base font-bold text-white leading-tight">{meal.title}</h3>

      <div className="grid grid-cols-3 gap-2 py-2 border-y border-obsidian-700/60 font-mono text-center text-xs">
        <div>
          <span className="block text-[10px] text-slate-400">Protein</span>
          <span className="font-bold text-white">{meal.proteinGrams}g</span>
        </div>
        <div>
          <span className="block text-[10px] text-slate-400">Carbs</span>
          <span className="font-bold text-white">{meal.carbsGrams}g</span>
        </div>
        <div>
          <span className="block text-[10px] text-slate-400">Fats</span>
          <span className="font-bold text-white">{meal.fatGrams}g</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
        <span className="flex items-center gap-1">
          <Flame className="w-3.5 h-3.5 text-neon-amber" />
          {meal.calories} kcal
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-neon-cyan" />
          {meal.prepTimeMins} mins prep
        </span>
      </div>
    </GlassCard>
  );
};
