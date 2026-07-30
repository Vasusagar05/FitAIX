'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/apiClient';
import { GlassCard } from '@/shared/components/GlassCard';
import { Badge } from '@/shared/components/Badge';
import { Button } from '@/shared/components/Button';
import { StrengthChart } from '@/features/progress/components/StrengthChart';
import { AIMemoryTimeline } from '@/features/progress/components/AIMemoryTimeline';
import {
  TrendingUp, RefreshCw, Brain, Flame, Trophy, Activity,
  AlertTriangle, CheckCircle2, Clock, Zap, BarChart3
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell
} from 'recharts';

// ─── Types ────────────────────────────────────────────────────────────────────
interface WeekDay { day: string; completed: boolean; duration: number; calories: number; muscles: string }
interface MuscleStatus { muscle: string; sessionsThisWeek: number; recoveryPercent: number; status?: string; advice?: string }
interface AIRec { overtrained: MuscleStatus[]; undertrained: MuscleStatus[]; wellBalanced: MuscleStatus[]; recommendation: string; reason: string }
interface Analytics { weeklyWorkouts: WeekDay[]; totalWeeklyCalories: number; avgDuration: number; streakDays: number; strengthProgress: any[] }

// ─── Weekly Progress Bar Chart ─────────────────────────────────────────────────
const WeeklyProgressPanel: React.FC<{ data: WeekDay[] }> = ({ data }) => {
  const chartData = data.map(d => ({
    day: d.day,
    duration: d.duration,
    calories: d.calories,
    completed: d.completed,
  }));

  return (
    <GlassCard glow="violet" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-obsidian-700/60 pb-3 gap-2">
        <div>
          <span className="text-xs font-mono text-neon-violet uppercase tracking-wider">This Week</span>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-neon-violet" /> Weekly Workout Activity
          </h3>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-neon-violet">
            <span className="w-2.5 h-2.5 rounded-full bg-neon-violet inline-block" />Duration (mins)
          </span>
          <span className="flex items-center gap-1.5 text-neon-amber">
            <span className="w-2.5 h-2.5 rounded-full bg-neon-amber inline-block" />Calories
          </span>
        </div>
      </div>

      <div className="h-44 sm:h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barGap={4} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F293D" vertical={false} />
            <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
            <Tooltip
              cursor={{ fill: 'rgba(139,92,246,0.08)' }}
              contentStyle={{
                backgroundColor: '#1E293B',
                borderColor: '#334155',
                borderRadius: '12px',
                color: '#F1F5F9',
                fontSize: '12px',
                fontFamily: 'monospace',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                padding: '10px 14px',
              }}
              labelStyle={{ color: '#94A3B8', marginBottom: '4px', fontWeight: 600 }}
              itemStyle={{ color: '#F1F5F9', padding: '1px 0' }}
              formatter={(value: any, name: string) => [
                name === 'Duration (mins)' ? `${value} mins` : `${value} kcal`,
                name,
              ]}
            />
            <Bar dataKey="duration" name="Duration (mins)" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.completed ? '#8B5CF6' : '#1F293D'} />
              ))}
            </Bar>
            <Bar dataKey="calories" name="Calories" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.completed ? '#F59E0B' : '#131B2E'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Day checkmarks */}
      <div className="flex items-center justify-around overflow-x-auto scrollbar-none gap-2 py-1">
        {data.map((d) => (
          <div key={d.day} className="flex flex-col items-center gap-1 shrink-0 min-w-[36px]">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center border ${d.completed
              ? 'bg-neon-emerald/20 border-neon-emerald text-neon-emerald'
              : 'bg-obsidian-800 border-obsidian-700 text-slate-600'
              }`}>
              {d.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
            </div>
            <span className="text-[10px] font-mono text-slate-400">{d.day}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

// ─── AI Recommendations Panel ────────────────────────────────────────────────
const AIRecommendationPanel: React.FC<{ data: AIRec }> = ({ data }) => {
  const MuscleStatusBar: React.FC<{ item: MuscleStatus; type: 'over' | 'under' | 'good' }> = ({ item, type }) => {
    const colors = { over: 'neon-rose', under: 'neon-amber', good: 'neon-emerald' };
    const hexColors = { over: '#F43F5E', under: '#F59E0B', good: '#10B981' };
    const colorKey = type === 'over' ? 'over' : type === 'under' ? 'under' : 'good';
    const pct = item.recoveryPercent;

    return (
      <div className="p-3 rounded-xl bg-obsidian-900/60 border border-obsidian-700 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {type === 'over' && <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />}
            {type === 'under' && <Zap className="w-3.5 h-3.5 text-neon-amber" />}
            {type === 'good' && <CheckCircle2 className="w-3.5 h-3.5 text-neon-emerald" />}
            <span className="text-sm font-bold text-white">{item.muscle}</span>
          </div>
          <span className="text-xs font-mono" style={{ color: hexColors[colorKey] }}>{item.sessionsThisWeek}x / week</span>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>Recovery</span>
            <span style={{ color: hexColors[colorKey] }}>{pct}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-obsidian-800">
            <div
              className="h-1.5 rounded-full transition-all duration-700"
              style={{ width: `${pct}%`, backgroundColor: hexColors[colorKey] }}
            />
          </div>
        </div>

        {item.advice && (
          <p className="text-[11px] text-slate-400 font-mono leading-relaxed">{item.advice}</p>
        )}
      </div>
    );
  };

  return (
    <GlassCard glow="violet" className="space-y-4">
      <div className="flex items-center justify-between border-b border-obsidian-700/60 pb-3">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-neon-violet" />
          <div>
            <span className="text-xs font-mono text-neon-violet uppercase tracking-wider">AI Muscle Analysis</span>
            <h3 className="text-base font-bold text-white">Overtrained & Undertrained Groups</h3>
          </div>
        </div>
        <Badge variant="violet" glow>AI Active</Badge>
      </div>

      {/* Recommendation Banner */}
      <div className="p-3 rounded-xl bg-neon-violet/10 border border-neon-violet/20">
        <p className="text-xs font-bold text-neon-violet mb-0.5">{data.recommendation}</p>
        <p className="text-[11px] text-slate-400 font-mono">{data.reason}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Overtrained */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 mb-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <h4 className="text-xs font-mono font-bold text-rose-400 uppercase">Overtrained</h4>
          </div>
          {data.overtrained.length > 0
            ? data.overtrained.map(item => <MuscleStatusBar key={item.muscle} item={item} type="over" />)
            : <p className="text-xs text-slate-500 font-mono italic">None detected</p>
          }
        </div>

        {/* Undertrained */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 mb-2">
            <Zap className="w-4 h-4 text-neon-amber" />
            <h4 className="text-xs font-mono font-bold text-neon-amber uppercase">Undertrained</h4>
          </div>
          {data.undertrained.length > 0
            ? data.undertrained.map(item => <MuscleStatusBar key={item.muscle} item={item} type="under" />)
            : <p className="text-xs text-slate-500 font-mono italic">None detected</p>
          }
        </div>

        {/* Well Balanced */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 mb-2">
            <CheckCircle2 className="w-4 h-4 text-neon-emerald" />
            <h4 className="text-xs font-mono font-bold text-neon-emerald uppercase">Well Balanced</h4>
          </div>
          {data.wellBalanced.length > 0
            ? data.wellBalanced.map(item => <MuscleStatusBar key={item.muscle} item={item} type="good" />)
            : <p className="text-xs text-slate-500 font-mono italic">Train more to get data</p>
          }
        </div>
      </div>
    </GlassCard>
  );
};

// ─── Stats Row ────────────────────────────────────────────────────────────────
const StatsRow: React.FC<{ analytics: Analytics }> = ({ analytics }) => {
  const stats = [
    { label: 'Streak', value: `${analytics.streakDays}`, unit: 'days', icon: <Trophy className="w-5 h-5 text-neon-amber" />, color: 'amber' },
    { label: 'Weekly Calories', value: `${analytics.totalWeeklyCalories}`, unit: 'kcal', icon: <Flame className="w-5 h-5 text-neon-cyan" />, color: 'cyan' },
    { label: 'Avg Duration', value: `${analytics.avgDuration}`, unit: 'mins', icon: <Clock className="w-5 h-5 text-neon-violet" />, color: 'violet' },
    {
      label: 'Completion Rate',
      value: `${analytics.weeklyWorkouts ? Math.round((analytics.weeklyWorkouts.filter(d => d.completed).length / 7) * 100) : 0}`,
      unit: '%',
      icon: <Activity className="w-5 h-5 text-neon-emerald" />,
      color: 'emerald'
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(stat => (
        <GlassCard key={stat.label} glow={stat.color as any} className="space-y-3 !p-4">
          <div className={`w-10 h-10 rounded-xl bg-neon-${stat.color}/10 border border-neon-${stat.color}/20 flex items-center justify-center`}>
            {stat.icon}
          </div>
          <div>
            <div className="flex items-end gap-1">
              <span className={`text-2xl font-black text-neon-${stat.color}`}>{stat.value}</span>
              <span className="text-xs font-mono text-slate-400 mb-0.5">{stat.unit}</span>
            </div>
            <p className="text-xs text-slate-400 font-mono">{stat.label}</p>
          </div>
        </GlassCard>
      ))}
    </div>
  );
};

// ─── Main Progress Page ───────────────────────────────────────────────────────
export default function ProgressPage() {
  const [progressData, setProgressData] = useState<any>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [aiRec, setAiRec] = useState<AIRec | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    setError(false);
    try {
      // Fetch all data in parallel; handle partial failures gracefully
      const [progressRes, analyticsRes, aiRecRes] = await Promise.allSettled([
        apiClient.get('/progress'),
        apiClient.get('/workouts/analytics'),
        apiClient.get('/workouts/ai-recommendations'),
      ]);

      if (progressRes.status === 'fulfilled') {
        setProgressData(progressRes.value.data.data);
      } else {
        // fallback empty progress
        setProgressData({ points: [], aiEvents: [] });
      }

      if (analyticsRes.status === 'fulfilled') {
        setAnalytics(analyticsRes.value.data.data);
      } else {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const now = new Date();
        setAnalytics({
          weeklyWorkouts: Array.from({ length: 7 }, (_, i) => {
            const d = new Date(now);
            d.setDate(now.getDate() - (6 - i));
            return { day: days[d.getDay()], completed: false, duration: 0, calories: 0, muscles: '' };
          }),
          totalWeeklyCalories: 0,
          avgDuration: 0,
          streakDays: 0,
          strengthProgress: [],
        });
      }

      if (aiRecRes.status === 'fulfilled') {
        setAiRec(aiRecRes.value.data.data);
      } else {
        setAiRec(null);
      }
    } catch (e) {
      console.error(e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-3">
        <RefreshCw className="w-8 h-8 text-neon-cyan animate-spin" />
        <p className="text-sm font-mono text-slate-400">Loading progress analytics & AI analysis...</p>
      </div>
    );
  }

  if (error && !progressData) {
    return (
      <div className="p-6 text-center space-y-3">
        <p className="text-rose-400 font-mono text-sm">Failed to load progress analytics.</p>
        <Button onClick={fetchAll}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-obsidian-900 via-obsidian-800 to-obsidian-900 border border-obsidian-700/80 shadow-glass flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-neon-cyan" />
            <span className="text-xs font-mono text-neon-cyan uppercase tracking-wider">Neural Analytics</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-neon-cyan" />
            Progress & AI Memory
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            1RM tracking, fatigue events, and muscle frequency analysis
          </p>
        </div>
        <button
          onClick={fetchAll}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-obsidian-800 border border-obsidian-700 text-xs font-mono text-slate-400 hover:text-white hover:border-neon-cyan transition-all shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Data
        </button>
      </div>

      {/* ── Stats Row ── */}
      {analytics && <StatsRow analytics={analytics} />}

      {/* ── Weekly Progress ── */}
      {analytics?.weeklyWorkouts && <WeeklyProgressPanel data={analytics.weeklyWorkouts} />}

      {/* ── Recent Workouts List ── */}
      {progressData?.aiEvents && progressData.aiEvents.length > 0 && (
        <GlassCard glow="cyan" className="space-y-4">
          <div className="flex items-center gap-2 border-b border-obsidian-700/60 pb-3">
            <Activity className="w-4 h-4 text-neon-cyan" />
            <h3 className="text-base font-bold text-white">Workout History</h3>
            <span className="ml-auto text-xs font-mono text-slate-400">{progressData.aiEvents.length} sessions</span>
          </div>
          <div className="space-y-2">
            {progressData.aiEvents.map((ev: any) => (
              <div key={ev.id} className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-obsidian-950/60 border border-obsidian-800 hover:border-neon-cyan/30 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center shrink-0">
                    <Flame className="w-4 h-4 text-neon-cyan" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{ev.title}</p>
                    <p className="text-xs text-slate-400 font-mono">{ev.description}</p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <span className="text-xs font-mono text-slate-500">{ev.date}</span>
                  {ev.impactBadge && (
                    <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-neon-emerald/10 text-neon-emerald border border-neon-emerald/30">{ev.impactBadge}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* ── Strength Chart (real data from analytics) ── */}
      <StrengthChart data={
        analytics?.strengthProgress?.length
          ? analytics.strengthProgress
          : (progressData?.points || [])
      } />

      {/* ── AI Recommendations ── */}
      {aiRec && <AIRecommendationPanel data={aiRec} />}

      {/* ── AI Memory Timeline ── */}
      <AIMemoryTimeline events={progressData?.aiEvents || []} />
    </div>
  );
}

// Fix missing Sparkles import
function Sparkles({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
      <path d="M19 17l.75 2.25L22 20l-2.25.75L19 23l-.75-2.25L16 20l2.25-.75L19 17z" />
      <path d="M5 6l.5 1.5L7 8l-1.5.5L5 10l-.5-1.5L3 8l1.5-.5L5 6z" />
    </svg>
  );
}
