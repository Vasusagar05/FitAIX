import React from 'react';
import { GlassCard } from '@/shared/components/GlassCard';
import { Activity } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

type Props = {
  steps: number;
  distanceKm: number;
};

export const StepsWidget: React.FC<Props> = ({ steps, distanceKm }) => {
  const percent = Math.min(100, Math.round((steps / 10000) * 100)); // assuming 10k goal
  return (
    <GlassCard glow="cyan" className="flex flex-col items-center p-4">
      <Activity className="w-6 h-6 text-neon-cyan mb-2" />
      <p className="text-xs uppercase font-mono text-neon-cyan tracking-wider">Steps</p>
      <p className="text-2xl font-bold text-white">{steps.toLocaleString()}</p>
      <p className="text-sm text-slate-400">{distanceKm} km • {Math.round((steps / 2000) * 100) / 100} mi</p>
      <div className="w-full bg-obsidian-700 h-2 rounded-full overflow-hidden mt-2">
        <div
          className="bg-gradient-to-r from-neon-cyan to-neon-violet h-full rounded-full"
          style={{ width: `${percent}%` }}
        />
      </div>
    </GlassCard>
  );
};
