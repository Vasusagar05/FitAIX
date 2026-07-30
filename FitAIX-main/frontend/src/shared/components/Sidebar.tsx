import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Dumbbell,
  Bot,
  TrendingUp,
  Calendar,
  Utensils,
  Settings,
  Flame,
  ShieldCheck,
  ShieldAlert,
  LogOut,
  X
} from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { useAppStore } from '@/lib/store';
import { useAuthStore } from '@/lib/authStore';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const pathname = location.pathname;
  const { streakShieldActive } = useAppStore();
  const { user, logout } = useAuthStore();

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Workout Engine', href: '/workout', icon: Dumbbell },
    { label: 'AI Coach Rachel', href: '/coach', icon: Bot, badge: 'Live AI' },
    { label: 'Progress & Memory', href: '/progress', icon: TrendingUp },
    { label: 'Smart Calendar', href: '/calendar', icon: Calendar },
    { label: 'Meals & Grocery', href: '/meals', icon: Utensils },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  const content = (
    <div className="flex flex-col h-full justify-between select-none">
      <div>
        {/* Brand Logo */}
        <div className="flex items-center justify-between px-3 py-4 mb-4">
          <Link to="/dashboard" onClick={onClose} className="flex items-center gap-3 group">
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
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-obsidian-800"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href === '/dashboard' && pathname === '/');

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
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
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-neon-violet/20 text-neon-violet border border-neon-violet/30">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User profile & Logout */}
      <div className="pt-3.5 border-t border-obsidian-800/60 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <img
            src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt={user?.name}
            className="w-9 h-9 rounded-xl object-cover border border-obsidian-700/60"
          />
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-white truncate">{user?.name}</h4>
            <p className="text-[10px] text-slate-400 font-mono capitalize truncate">{user?.role} Session</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="p-2 rounded-lg border border-obsidian-700 bg-obsidian-800/40 hover:bg-rose-950/20 hover:border-rose-500/30 text-slate-400 hover:text-rose-400 transition-all cursor-pointer"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop static sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-obsidian-700/60 bg-obsidian-900/90 backdrop-blur-2xl p-4 shrink-0">
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-obsidian-950/80 backdrop-blur-md transition-opacity"
            onClick={onClose}
          />
          {/* Slide-out Panel */}
          <div className="relative w-72 max-w-[80vw] bg-obsidian-900 border-r border-obsidian-700 p-4 shadow-2xl z-10 flex flex-col h-full">
            {content}
          </div>
        </div>
      )}
    </>
  );
};

