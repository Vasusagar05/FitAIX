'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/shared/components/GlassCard';
import { Button } from '@/shared/components/Button';
import { Badge } from '@/shared/components/Badge';
import { useAppStore } from '@/lib/store';
import { Zap, X, Play, ShieldCheck, Check } from 'lucide-react';

export const MicroWorkoutModal: React.FC = () => {
  const { isMicroWorkoutOpen, setMicroWorkoutOpen, activateStreakShield } = useAppStore();
  const [completed, setCompleted] = useState(false);

  if (!isMicroWorkoutOpen) return null;

  const handleFinish = () => {
    setCompleted(true);
    activateStreakShield();
    setTimeout(() => {
      setCompleted(false);
      setMicroWorkoutOpen(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-md">
      <div className="w-full max-w-md">
        <GlassCard glow="amber" className="space-y-4 relative">
          <button
            onClick={() => setMicroWorkoutOpen(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-neon-amber" />
            <h3 className="text-lg font-bold text-white">7-Minute Micro Workout Launcher</h3>
          </div>

          {!completed ? (
            <>
              <p className="text-xs text-slate-300">
                Short on time? Complete this 7-minute bodyweight density circuit to preserve your 14-day streak and keep neural motor pathways primed.
              </p>

              <div className="space-y-2 bg-obsidian-900/60 p-3 rounded-xl border border-obsidian-700/60 font-mono text-xs text-slate-200">
                <div className="flex justify-between py-1 border-b border-obsidian-800">
                  <span>1. Bodyweight Push-Ups</span>
                  <span className="text-neon-amber">45 sec work</span>
                </div>
                <div className="flex justify-between py-1 border-b border-obsidian-800">
                  <span>2. Air Squats to Iso-Hold</span>
                  <span className="text-neon-amber">45 sec work</span>
                </div>
                <div className="flex justify-between py-1 border-b border-obsidian-800">
                  <span>3. High Knees Sprint</span>
                  <span className="text-neon-amber">45 sec work</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>4. Plank Hold</span>
                  <span className="text-neon-amber">45 sec work</span>
                </div>
              </div>

              <Button variant="amber" className="w-full" onClick={handleFinish}>
                <Play className="w-4 h-4 fill-current" />
                Complete Micro Session (Save Streak)
              </Button>
            </>
          ) : (
            <div className="py-8 text-center space-y-3">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-neon-emerald/20 text-neon-emerald">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Streak Saved!</h4>
              <p className="text-xs text-neon-emerald font-mono">14 Day Streak Protected via Micro Session</p>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
};
