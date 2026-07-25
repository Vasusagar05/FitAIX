'use client';

import React from 'react';
import { GlassCard } from '@/shared/components/GlassCard';
import { Badge } from '@/shared/components/Badge';
import { HeartPulse, Moon, Zap, ShieldCheck } from 'lucide-react';

interface RecoveryScoreMeterProps {
  score: number;
  hrvMs: number;
  sleepHours: number;
  readiness: Record<string, number>;
}

export const RecoveryScoreMeter: React.FC<RecoveryScoreMeterProps> = ({
  score,
  hrvMs,
  sleepHours,
  readiness,
}) => {
  // Radial SVG math
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <GlassCard glow="cyan" className="flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs uppercase font-mono text-neon-cyan tracking-wider">Neural Telemetry</span>
          <h3 className="text-lg font-bold text-white">AI Recovery Score</h3>
        </div>
        <Badge variant="cyan" glow>Optimal Readiness</Badge>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 my-2">
        {/* Radial SVG Meter */}
        <div className="relative flex items-center justify-center w-36 h-36">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="72"
              cy="72"
              r={radius}
              className="text-obsidian-700"
              strokeWidth="10"
              stroke="currentColor"
              fill="transparent"
            />
            <circle
              cx="72"
              cy="72"
              r={radius}
              className="text-neon-cyan transition-all duration-1000 ease-out"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-extrabold text-white tracking-tight">{score}%</span>
            <span className="text-[10px] text-slate-400 font-mono">CNS READINESS</span>
          </div>
        </div>

        {/* Breakdown Stats */}
        <div className="flex-1 grid grid-cols-2 gap-3 w-full">
          <div className="p-3 rounded-xl bg-obsidian-900/60 border border-obsidian-700/60">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <HeartPulse className="w-3.5 h-3.5 text-neon-rose" />
              <span>HRV Baseline</span>
            </div>
            <p className="text-lg font-bold text-white">{hrvMs} <span className="text-xs font-normal text-slate-400">ms</span></p>
            <span className="text-[10px] text-neon-emerald">+4ms vs 7d avg</span>
          </div>

          <div className="p-3 rounded-xl bg-obsidian-900/60 border border-obsidian-700/60">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Moon className="w-3.5 h-3.5 text-neon-violet" />
              <span>Deep Sleep</span>
            </div>
            <p className="text-lg font-bold text-white">{sleepHours} <span className="text-xs font-normal text-slate-400">hrs</span></p>
            <span className="text-[10px] text-neon-cyan">91% Sleep Score</span>
          </div>

          <div className="col-span-2 p-3 rounded-xl bg-obsidian-900/60 border border-obsidian-700/60">
            <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-neon-amber" />
                Target Readiness
              </span>
              <span className="font-mono text-neon-emerald">Chest 85% • Back 95%</span>
            </div>
            <div className="w-full bg-obsidian-700 h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-neon-cyan via-neon-violet to-neon-emerald h-full rounded-full w-5/6" />
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
