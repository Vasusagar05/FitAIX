'use client';

import React from 'react';
import { GlassCard } from '@/shared/components/GlassCard';
import { ProgressPoint } from '../types';
import { TrendingUp, Award } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface StrengthChartProps {
  data: ProgressPoint[];
}

export const StrengthChart: React.FC<StrengthChartProps> = ({ data }) => {
  return (
    <GlassCard glow="cyan" className="space-y-4">
      <div className="flex items-center justify-between border-b border-obsidian-700/60 pb-3">
        <div>
          <span className="text-xs uppercase font-mono text-neon-cyan tracking-wider">1RM Trajectory</span>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            Estimated Strength Progressions
            <Award className="w-4 h-4 text-neon-amber" />
          </h3>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-neon-cyan">
            <span className="w-2.5 h-2.5 rounded-full bg-neon-cyan inline-block"></span>
            Bench Press (242 lbs)
          </span>
          <span className="flex items-center gap-1.5 text-neon-violet">
            <span className="w-2.5 h-2.5 rounded-full bg-neon-violet inline-block"></span>
            Squat (325 lbs)
          </span>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="benchGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#00F0FF" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="squatGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F293D" vertical={false} />
            <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748B" fontSize={11} tickLine={false} domain={['dataMin - 10', 'dataMax + 10']} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0B0F19',
                borderColor: '#1F293D',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '12px',
                fontFamily: 'monospace',
              }}
            />
            <Area type="monotone" dataKey="bench1RM" stroke="#00F0FF" strokeWidth={3} fillOpacity={1} fill="url(#benchGlow)" />
            <Area type="monotone" dataKey="squat1RM" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#squatGlow)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
};
