'use client';

import React from 'react';
import { useSchedule } from '@/features/calendar/hooks/useCalendar';
import { WeeklyGrid } from '@/features/calendar/components/WeeklyGrid';
import { Calendar, RefreshCw } from 'lucide-react';
import { Button } from '@/shared/components/Button';

export default function CalendarPage() {
  const { data, isLoading, isError, refetch } = useSchedule();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-3">
        <RefreshCw className="w-8 h-8 text-neon-cyan animate-spin" />
        <p className="text-sm font-mono text-slate-400">Loading schedule heatmap via REST /api/v1/schedule...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-6 text-center space-y-3">
        <p className="text-rose-400 font-mono text-sm">Failed to load weekly schedule.</p>
        <Button onClick={() => refetch()}>Retry REST Fetch</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-gradient-to-r from-obsidian-900 via-obsidian-800 to-obsidian-900 border border-obsidian-700/80 shadow-glass flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Calendar className="w-6 h-6 text-neon-cyan" />
            Smart Weekly Planner & Heatmap
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Real-time muscle strain heatmap tracking and overuse risk detection.
          </p>
        </div>
      </div>

      <WeeklyGrid schedule={data} />
    </div>
  );
}
