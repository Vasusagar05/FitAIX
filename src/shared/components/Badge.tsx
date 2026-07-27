import React from 'react';
import { cn } from '@/shared/utils/cn';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'cyan' | 'violet' | 'emerald' | 'amber' | 'rose' | 'slate';
  glow?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'cyan',
  glow = false,
  ...props
}) => {
  const variantStyles = {
    cyan: 'bg-neon-cyan/15 text-neon-cyan border-neon-cyan/30',
    violet: 'bg-neon-violet/15 text-neon-violet border-neon-violet/30',
    emerald: 'bg-neon-emerald/15 text-neon-emerald border-neon-emerald/30',
    amber: 'bg-neon-amber/15 text-neon-amber border-neon-amber/30',
    rose: 'bg-neon-rose/15 text-neon-rose border-neon-rose/30',
    slate: 'bg-obsidian-700/60 text-slate-300 border-obsidian-600/50',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border backdrop-blur-md transition-all',
        variantStyles[variant],
        glow && 'shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
