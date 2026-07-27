'use client';

import React from 'react';
import { GlassCard } from '@/shared/components/GlassCard';
import { Badge } from '@/shared/components/Badge';
import { AIMemoryEvent } from '../types';
import { Brain, Calendar, ShieldCheck, Zap, RefreshCw } from 'lucide-react';

interface AIMemoryTimelineProps {
  events: AIMemoryEvent[];
}

export const AIMemoryTimeline: React.FC<AIMemoryTimelineProps> = ({ events }) => {
  return (
    <GlassCard glow="violet" className="space-y-4">
      <div className="flex items-center justify-between border-b border-obsidian-700/60 pb-3">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-neon-violet" />
          <h3 className="text-lg font-bold text-white">AI Memory & Neural Intervention Timeline</h3>
        </div>
        <Badge variant="violet">Persistent Memory</Badge>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-obsidian-700">
        {events.map((evt) => (
          <div key={evt.id} className="relative group">
            {/* Timeline Dot */}
            <div className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-neon-cyan border-2 border-obsidian-950 group-hover:scale-125 transition-transform" />

            <div className="p-3.5 rounded-xl bg-obsidian-900/80 border border-obsidian-700/80 hover:border-neon-cyan/40 transition-all space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">{evt.date}</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30">
                  {evt.impactBadge}
                </span>
              </div>

              <h4 className="text-sm font-bold text-white">{evt.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{evt.description}</p>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};
