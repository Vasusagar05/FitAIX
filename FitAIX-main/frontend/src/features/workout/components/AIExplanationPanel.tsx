'use client';

import React from 'react';
import { GlassCard } from '@/shared/components/GlassCard';
import { Button } from '@/shared/components/Button';
import { Badge } from '@/shared/components/Badge';
import { Exercise } from '../types';
import { Cpu, X, Brain, CheckCircle } from 'lucide-react';

interface AIExplanationPanelProps {
  exercise: Exercise | null;
  onClose: () => void;
}

export const AIExplanationPanel: React.FC<AIExplanationPanelProps> = ({
  exercise,
  onClose,
}) => {
  if (!exercise) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-md">
      <div className="w-full max-w-lg">
        <GlassCard glow="cyan" className="space-y-4 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-neon-cyan" />
            <h3 className="text-lg font-bold text-white">AI Adaptation Decision Tree</h3>
          </div>

          <div className="p-3 rounded-xl bg-obsidian-900 border border-obsidian-700 space-y-1">
            <span className="text-xs font-mono text-neon-cyan uppercase">Target Exercise</span>
            <p className="text-base font-bold text-white">{exercise.name}</p>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-mono text-slate-400 uppercase">Reasoning Breakdown</h4>
            <p className="text-sm text-slate-200 leading-relaxed bg-obsidian-900/60 p-3 rounded-xl border border-obsidian-700/60">
              {exercise.aiAdjustmentReason || 'Load auto-calibrated based on neural fatigue signals.'}
            </p>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-neon-cyan" />
              <span className="text-slate-200">Neural Engine Confidence</span>
            </div>
            <span className="font-mono font-bold text-neon-cyan text-sm">{exercise.aiConfidencePercent || 95}%</span>
          </div>

          <Button variant="cyan" className="w-full" onClick={onClose}>
            Got it, continue workout
          </Button>
        </GlassCard>
      </div>
    </div>
  );
};
