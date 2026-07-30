'use client';

import React from 'react';
import { GlassCard } from '@/shared/components/GlassCard';
import { Badge } from '@/shared/components/Badge';
import { ScheduleDay } from '../types';
import { Calendar as CalendarIcon, AlertTriangle, CheckCircle, Flame } from 'lucide-react';

interface WeeklyGridProps {
  schedule: ScheduleDay[];
}

export const WeeklyGrid: React.FC<WeeklyGridProps> = ({ schedule }) => {
  const stressStyles = {
    emerald: 'border-neon-emerald/40 bg-neon-emerald/5 text-neon-emerald',
    amber: 'border-neon-amber/40 bg-neon-amber/5 text-neon-amber',
    rose: 'border-neon-rose/40 bg-neon-rose/5 text-neon-rose',
  };

  return (
    <GlassCard glow="cyan" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-obsidian-700/60 pb-3 gap-2">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-neon-cyan" />
          <h3 className="text-base sm:text-lg font-bold text-white">Smart Weekly Planner & Heatmap</h3>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-xs font-mono">
          <span className="flex items-center gap-1 text-neon-emerald">● Low Stress</span>
          <span className="flex items-center gap-1 text-neon-amber">● Optimal</span>
          <span className="flex items-center gap-1 text-neon-rose">● Overuse Alert</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-3">
        {schedule.map((item, idx) => (
          <div
            key={idx}
            className={`p-3.5 rounded-2xl border flex flex-col justify-between h-auto min-h-[120px] md:h-44 transition-all hover:-translate-y-1 ${
              stressStyles[item.stressLevel]
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono font-black text-sm uppercase">{item.day}</span>
                {item.isCompleted && <CheckCircle className="w-4 h-4 text-neon-emerald" />}
              </div>
              <h4 className="text-xs font-bold text-white line-clamp-2">{item.title}</h4>
              <p className="text-[10px] text-slate-400 font-mono mt-1">{item.muscle}</p>
            </div>

            {item.warning && (
              <div className="p-1.5 rounded-lg bg-neon-rose/20 border border-neon-rose/40 text-[10px] text-neon-rose flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 shrink-0" />
                <span className="line-clamp-2">{item.warning}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </GlassCard>
  );
};
