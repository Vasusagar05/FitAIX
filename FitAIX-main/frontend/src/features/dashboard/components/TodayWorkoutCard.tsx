import React from 'react';
import { Link } from 'react-router-dom';
import { GlassCard } from '@/shared/components/GlassCard';
import { Button } from '@/shared/components/Button';
import { Badge } from '@/shared/components/Badge';
import { Dumbbell, Clock, Sparkles, Play, ShieldAlert } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export const TodayWorkoutCard: React.FC = () => {
  const { scenarioMode } = useAppStore();

  return (
    <GlassCard glow="violet" className="flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-neon-violet" />
            <span className="text-xs uppercase font-mono text-neon-violet tracking-wider">AI Workout Engine</span>
          </div>
          <Badge variant="violet" glow>
            {scenarioMode.toUpperCase()} MODE
          </Badge>
        </div>

        <h2 className="text-2xl font-black text-white tracking-tight mb-1">Hypertrophy Push & Core A</h2>
        <p className="text-xs text-slate-300 mb-4 line-clamp-2">
          AI Adapted: Volume calibrated -5% to protect rotator cuff tendons while maximizing upper chest hypertrophy.
        </p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-obsidian-900/60 border border-obsidian-700/60">
            <Clock className="w-4 h-4 text-neon-cyan" />
            <div>
              <span className="block text-[10px] text-slate-400">Est. Duration</span>
              <span className="text-sm font-bold text-white">45 Mins</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-obsidian-900/60 border border-obsidian-700/60">
            <Dumbbell className="w-4 h-4 text-neon-emerald" />
            <div>
              <span className="block text-[10px] text-slate-400">Target Muscles</span>
              <span className="text-xs font-bold text-white">Chest, Delts, Triceps</span>
            </div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-neon-violet/10 border border-neon-violet/30 text-xs text-slate-200 flex items-start gap-2 mb-4">
          <ShieldAlert className="w-4 h-4 text-neon-violet shrink-0 mt-0.5" />
          <span>RPE target set to 7.5. Deload protection auto-applied by Neural Node.</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link to="/workout" className="flex-1">
          <Button variant="violet" size="lg" className="w-full">
            <Play className="w-4 h-4 fill-current" />
            Start Session Now
          </Button>
        </Link>
      </div>
    </GlassCard>
  );
};
