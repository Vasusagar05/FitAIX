'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/shared/components/GlassCard';
import { useSocketEvents } from '@/shared/hooks/useSocketEvents';
import { Activity, Radio, Cpu } from 'lucide-react';

interface FeedLog {
  id: string;
  message: string;
  timestamp: string;
}

export const LiveSocketFeed: React.FC = () => {
  const [logs, setLogs] = useState<FeedLog[]>([
    { id: '1', message: 'Socket.io connection online. Monitoring neural muscle readiness...', timestamp: '12:56:00' },
    { id: '2', message: 'AI Neural Node #42: Bench Press load calibrated -5% (68ms HRV baseline).', timestamp: '12:56:08' },
    { id: '3', message: 'Coach Rachel: Hydration status verified optimal for Push A session.', timestamp: '12:56:15' },
  ]);

  // Subscribe to real-time socket events using the custom hook
  useSocketEvents('live_feed', (data: any) => {
    if (data?.message) {
      setLogs((prev) => [
        {
          id: `log-${Date.now()}`,
          message: data.message,
          timestamp: data.timestamp || new Date().toLocaleTimeString(),
        },
        ...prev.slice(0, 7),
      ]);
    }
  });

  return (
    <GlassCard glow="cyan" className="p-5">
      <div className="flex items-center justify-between mb-3 border-b border-obsidian-700/60 pb-3">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-neon-cyan animate-pulse" />
          <h3 className="text-sm font-bold text-white tracking-wide">Real-Time Socket Stream</h3>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-mono text-neon-emerald">
          <Cpu className="w-3.5 h-3.5" />
          <span>Socket.io Broadcast</span>
        </div>
      </div>

      <div className="space-y-2 max-h-36 overflow-y-auto pr-1 scrollbar-thin">
        {logs.map((log) => (
          <div
            key={log.id}
            className="flex items-start gap-2.5 p-2 rounded-lg bg-obsidian-900/60 border border-obsidian-700/40 text-xs transition-all hover:border-neon-cyan/40"
          >
            <Activity className="w-3.5 h-3.5 text-neon-cyan shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-slate-200">{log.message}</p>
            </div>
            <span className="text-[10px] text-slate-500 font-mono shrink-0">{log.timestamp}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};
