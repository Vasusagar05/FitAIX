import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Dumbbell,
  Bot,
  Utensils,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/shared/utils/cn';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Workout', href: '/workout', icon: Dumbbell },
    { label: 'AI Coach', href: '/coach', icon: Bot, badge: 'AI' },
    { label: 'Meals', href: '/meals', icon: Utensils },
    { label: 'Progress', href: '/progress', icon: TrendingUp },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-obsidian-900/95 backdrop-blur-xl border-t border-obsidian-700/60 px-2 py-1.5 flex items-center justify-around shadow-2xl">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (item.href === '/dashboard' && pathname === '/');

        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              'flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 relative min-w-[56px]',
              isActive
                ? 'text-neon-cyan'
                : 'text-slate-400 hover:text-slate-200'
            )}
          >
            {isActive && (
              <span className="absolute -top-1.5 w-6 h-0.5 rounded-full bg-neon-cyan shadow-neon-cyan shadow-sm" />
            )}
            <div className="relative">
              <Icon className={cn('w-5 h-5 transition-transform', isActive ? 'scale-110 text-neon-cyan' : '')} />
              {item.badge && (
                <span className="absolute -top-1 -right-2 text-[8px] font-mono px-1 rounded bg-neon-violet/30 text-neon-violet border border-neon-violet/40 font-bold">
                  {item.badge}
                </span>
              )}
            </div>
            <span className={cn('text-[10px] font-medium mt-1 tracking-tight', isActive ? 'text-white font-bold' : 'text-slate-400')}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};
