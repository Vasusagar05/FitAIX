'use client';

import React from 'react';
import { GlassCard } from '@/shared/components/GlassCard';
import { Button } from '@/shared/components/Button';
import { Badge } from '@/shared/components/Badge';
import { useAppStore, ScenarioMode, ViewMode } from '@/lib/store';
import { Settings as SettingsIcon, Sliders, Dumbbell, ShieldCheck, Zap, Check } from 'lucide-react';

export default function SettingsPage() {
  const { scenarioMode, setScenarioMode, viewMode, setViewMode } = useAppStore();

  const scenarios: { id: ScenarioMode; name: string; desc: string }[] = [
    { id: 'normal', name: 'Normal Gym Mode', desc: 'Full barbell, dumbbell, and cable machine access.' },
    { id: 'travel', name: 'Travel Mode', desc: 'Bodyweight, hotel bed, and resistance band adaptations.' },
    { id: 'low-equipment', name: 'Low Equipment Mode', desc: 'Single dumbbell or limited home setup.' },
  ];

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-gradient-to-r from-obsidian-900 via-obsidian-800 to-obsidian-900 border border-obsidian-700/80 shadow-glass flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-neon-cyan" />
            Settings & Performance Preferences
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Configure neural scenario defaults, view modes, and available gym equipment.
          </p>
        </div>
      </div>

      {/* Scenario Modes */}
      <GlassCard glow="cyan" className="space-y-4">
        <div className="border-b border-obsidian-700/60 pb-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-neon-cyan" />
            Neural Scenario Mode
          </h3>
          <p className="text-xs text-slate-400 font-mono">
            Automatically recalibrates exercise selection across all API responses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {scenarios.map((sc) => {
            const isActive = scenarioMode === sc.id;
            return (
              <div
                key={sc.id}
                onClick={() => setScenarioMode(sc.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isActive
                    ? 'bg-neon-cyan/15 border-neon-cyan text-white shadow-neon-cyan/20 shadow-md'
                    : 'bg-obsidian-900/60 border-obsidian-700 text-slate-300 hover:border-obsidian-600'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold">{sc.name}</h4>
                  {isActive && <Check className="w-4 h-4 text-neon-cyan" />}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{sc.desc}</p>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* View Mode */}
      <GlassCard glow="violet" className="space-y-4">
        <div className="border-b border-obsidian-700/60 pb-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-neon-violet" />
            UI Complexity & View Mode
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            onClick={() => setViewMode('simple')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              viewMode === 'simple'
                ? 'bg-neon-violet/15 border-neon-violet text-white shadow-neon-violet/20 shadow-md'
                : 'bg-obsidian-900/60 border-obsidian-700 text-slate-300'
            }`}
          >
            <h4 className="text-sm font-bold mb-1">Simple Mode</h4>
            <p className="text-xs text-slate-400">Clean, distraction-free view focused strictly on reps and sets.</p>
          </div>

          <div
            onClick={() => setViewMode('advanced')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              viewMode === 'advanced'
                ? 'bg-neon-violet/15 border-neon-violet text-white shadow-neon-violet/20 shadow-md'
                : 'bg-obsidian-900/60 border-obsidian-700 text-slate-300'
            }`}
          >
            <h4 className="text-sm font-bold mb-1">Advanced Mode</h4>
            <p className="text-xs text-slate-400">Deep telemetry analytics, RPE logs, velocity metrics, and AI confidence ratings.</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
