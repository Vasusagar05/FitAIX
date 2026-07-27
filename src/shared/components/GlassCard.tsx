import React from 'react';
import { cn } from '@/shared/utils/cn';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glow?: 'cyan' | 'violet' | 'emerald' | 'amber' | 'rose' | 'none';
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  glow = 'none',
  hoverEffect = true,
  ...props
}) => {
  const glowClasses = {
    cyan: 'border-neon-cyan/30 shadow-neon-cyan/15 hover:border-neon-cyan/60 hover:shadow-neon-cyan/30',
    violet: 'border-neon-violet/30 shadow-neon-violet/15 hover:border-neon-violet/60 hover:shadow-neon-violet/30',
    emerald: 'border-neon-emerald/30 shadow-neon-emerald/15 hover:border-neon-emerald/60 hover:shadow-neon-emerald/30',
    amber: 'border-neon-amber/30 shadow-neon-amber/15 hover:border-neon-amber/60 hover:shadow-neon-amber/30',
    rose: 'border-neon-rose/30 shadow-neon-rose/15 hover:border-neon-rose/60 hover:shadow-neon-rose/30',
    none: 'border-obsidian-700/60 shadow-glass hover:border-obsidian-600',
  };

  return (
    <div
      className={cn(
        'relative rounded-2xl bg-obsidian-800/60 backdrop-blur-xl border p-6 transition-all duration-300',
        glowClasses[glow],
        hoverEffect && 'hover:-translate-y-0.5',
        className
      )}
      {...props}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent rounded-t-2xl" />
      {children}
    </div>
  );
};
