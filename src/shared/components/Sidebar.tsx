'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Dumbbell, 
  Bot, 
  TrendingUp, 
  Calendar, 
  Utensils, 
  Settings, 
  Flame, 
  ShieldCheck 
} from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { useAppStore } from '@/lib/store';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { streakShieldActive } = useAppStore();

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Workout Engine', href: '/workout', icon: Dumbbell },
    { label: 'AI Coach Rachel', href: '/coach', icon: Bot, badge: 'Live AI' },
    { label: 'Progress & Memory', href: '/progress', icon: TrendingUp },
    { label: 'Smart Calendar', href: '/calendar', icon: Calendar },
    { label: 'Meals & Grocery', href: '/meals', icon: Utensils },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-obsidian-700/60 bg-obsidian-900/90 backdrop-blur-2xl p-4 justify-between select-none">
      <div>
        {/* Brand Logo */}
        <Link href="/dashboard" className="flex items-center gap-3 px-3 py-4 mb-6 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan via-neon-violet to-neon-emerald p-[1px] shadow-neon-cyan/40 shadow-lg">
            <div className="w-full h-full bg-obsidian-950 rounded-[11px] flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-neon-cyan group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-wider text-white">FitAI<span className="text-neon-cyan">x</span></span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30">v4.2</span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">Neural Performance OS</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href === '/dashboard' && pathname === '/');

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
                  isActive
                    ? 'bg-gradient-to-r from-neon-cyan/20 to-neon-violet/10 text-white border border-neon-cyan/40 shadow-neon-cyan/20 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-obsidian-800/50'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn('w-4 h-4 transition-colors', isActive ? 'text-neon-cyan' : 'text-slate-400 group-hover:text-slate-200')} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-neon-violet/20 text-neon-violet border border-neon-violet/30 animate-pulse">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Streak Shield Card */}
      <div className="rounded-xl bg-obsidian-800/50 border border-obsidian-700 p-3.5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-neon-amber fill-neon-amber/20" />
            <span className="text-xs font-semibold text-slate-200">14 Day Streak</span>
          </div>
          <span className="flex items-center gap-1 text-[11px] text-neon-emerald font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            Active
          </span>
        </div>
        <div className="w-full bg-obsidian-700 h-1.5 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-neon-amber to-neon-cyan h-full rounded-full w-4/5" />
        </div>
        <p className="text-[10px] text-slate-400 mt-2">Shield auto-protects missed session.</p>
      </div>
    </aside>
  );
};
