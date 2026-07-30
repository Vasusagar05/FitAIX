'use client';

import React from 'react';
import { useAppStore, ScenarioMode, ViewMode } from '@/lib/store';
import { Wifi, Activity, Luggage, Dumbbell, Sliders, Zap } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

export const Header: React.FC = () => {
  const { scenarioMode, setScenarioMode, viewMode, setViewMode } = useAppStore();

  const scenarios: { id: ScenarioMode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'normal', label: 'Normal Gym', icon: Dumbbell },
    { id: 'travel', label: 'Travel Mode', icon: Luggage },
    { id: 'low-equipment', label: 'Low Equipment', icon: Sliders },
  ];

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-3 border-b border-obsidian-700/60 bg-obsidian-900/80 backdrop-blur-xl">
      {/* Live System Telemetry Status */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-neon-emerald/10 border border-neon-emerald/30 text-neon-emerald text-xs font-mono">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-emerald opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-emerald"></span>
          </span>
          <span>REST & Socket.io Live</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-mono">
          <Activity className="w-3.5 h-3.5 text-neon-cyan" />
          <span>Latency: 14ms</span>
        </div>
      </div>

      {/* Controls: Scenario Switcher & View Mode Toggle */}
      <div className="flex items-center gap-3">
        {/* Scenario Selector */}
        <div className="flex items-center p-1 rounded-xl bg-obsidian-800/80 border border-obsidian-700">
          {scenarios.map((sc) => {
            const Icon = sc.icon;
            const isActive = scenarioMode === sc.id;
            return (
              <button
                key={sc.id}
                onClick={() => setScenarioMode(sc.id)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer',
                  isActive
                    ? 'bg-neon-cyan text-obsidian-950 shadow-neon-cyan/30 shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-white'
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{sc.label}</span>
              </button>
            );
          })}
        </div>

        {/* View Mode Switcher (Simple vs Advanced) */}
        <button
          onClick={() => setViewMode(viewMode === 'simple' ? 'advanced' : 'simple')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-obsidian-700 bg-obsidian-800/50 hover:bg-obsidian-700 text-xs text-slate-300 transition-all cursor-pointer"
        >
          <Zap className={cn('w-3.5 h-3.5', viewMode === 'advanced' ? 'text-neon-violet' : 'text-slate-400')} />
          <span className="capitalize">{viewMode} Mode</span>
        </button>
      </div>
    </header>
  );
};
