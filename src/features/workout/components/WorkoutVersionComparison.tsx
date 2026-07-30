'use client';

import React from 'react';
import { GlassCard } from '@/shared/components/GlassCard';
import { Badge } from '@/shared/components/Badge';
import { ArrowRight, Sparkles, History, Cpu } from 'lucide-react';

export const WorkoutVersionComparison: React.FC = () => {
  return (
    <GlassCard glow="violet" className="space-y-4">
      <div className="flex items-center justify-between border-b border-obsidian-700/60 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-neon-violet" />
          <h3 className="text-base font-bold text-white">AI Version Comparison Matrix</h3>
        </div>
        <Badge variant="violet">v2.4-AI-Optimized</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Previous Version */}
        <div className="p-4 rounded-xl bg-obsidian-900/80 border border-obsidian-700 space-y-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
              <History className="w-3.5 h-3.5" />
              Previous Standard Plan
            </span>
            <span className="text-xs text-slate-400">v1.0 Baseline</span>
          </div>
          <h4 className="text-sm font-bold text-white">Standard Hypertrophy Push A</h4>
          <ul className="text-xs space-y-1 text-slate-300 font-mono">
            <li>• Barbell Bench Press: 4 sets x 10 reps @ 225 lbs</li>
            <li>• Barbell Overhead Press: 4 sets x 10 reps @ 135 lbs</li>
            <li>• Skullcrushers: 3 sets x 12 reps @ 75 lbs</li>
          </ul>
          <div className="pt-2 text-[11px] text-slate-500 border-t border-obsidian-800">
            Total Load Volume: 14,200 lbs • Est: 60 mins
          </div>
        </div>

        {/* AI Adapted Version */}
        <div className="p-4 rounded-xl bg-neon-cyan/5 border border-neon-cyan/30 space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 px-3 py-1 bg-neon-cyan text-obsidian-950 font-mono text-[10px] font-bold rounded-bl-xl">
            96% AI CONFIDENCE
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-neon-cyan">
            <Cpu className="w-3.5 h-3.5" />
            AI Calibrated Version
          </div>
          <h4 className="text-sm font-bold text-white">Neural Adapted Push A (HRV 68ms)</h4>
          <ul className="text-xs space-y-1 text-neon-cyan/90 font-mono">
            <li>• Incline DB Press: 3 sets x 10 reps @ 70 lbs (Rotator Protection)</li>
            <li>• Seated DB OHP: 3 sets x 12 reps @ 50 lbs (Spine Unloading)</li>
            <li>• Cable Rope Pushdowns: 2 sets x 15 reps @ 45 lbs (Pump Focus)</li>
          </ul>
          <div className="pt-2 text-[11px] text-neon-emerald font-mono border-t border-neon-cyan/20">
            Total Load Volume: 11,400 lbs (-19% Load) • Est: 45 mins (-15m)
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
