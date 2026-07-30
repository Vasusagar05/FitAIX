import React from 'react';
import { useAppStore, ScenarioMode } from '@/lib/store';
import { useAuthStore } from '@/lib/authStore';
import { Activity, Dumbbell, Menu } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { scenarioMode, setScenarioMode } = useAppStore();
  const { user } = useAuthStore();

  const scenarios: { id: ScenarioMode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'normal', label: 'Normal Gym', icon: Dumbbell },
  ];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-3 sm:px-6 py-3 border-b border-obsidian-700/60 bg-obsidian-900/80 backdrop-blur-xl">
      {/* Live System Telemetry Status & Mobile Toggle */}
      <div className="flex items-center gap-2 sm:gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-xl border border-obsidian-700 bg-obsidian-800/80 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-neon-emerald/10 border border-neon-emerald/30 text-neon-emerald text-[10px] sm:text-xs font-mono">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-emerald opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-emerald"></span>
          </span>
          <span className="truncate">REST & Socket.io Live</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-mono">
          <Activity className="w-3.5 h-3.5 text-neon-cyan" />
          <span>14ms</span>
        </div>
      </div>

      {/* Controls: Scenario Switcher & View Mode Toggle */}
      <div className="flex items-center gap-2 sm:gap-3">
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
                  'flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg text-[11px] sm:text-xs font-medium transition-all duration-200 cursor-pointer',
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

        {/* User Identity widget */}
        <div className="flex items-center gap-2 border-l border-obsidian-800/80 pl-2 sm:pl-3 ml-1 select-none">
          <img 
            src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} 
            alt={user?.name} 
            className="w-7 h-7 rounded-lg object-cover border border-obsidian-700/60" 
          />
          <span className="hidden md:inline text-[11px] text-slate-300 font-bold tracking-tight">{user?.name}</span>
        </div>
      </div>
    </header>
  );
};

