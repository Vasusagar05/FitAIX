import React from 'react';
import { cn } from '@/shared/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'cyan' | 'violet' | 'emerald' | 'amber' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'cyan',
  size = 'md',
  glow = true,
  disabled,
  ...props
}) => {
  const baseStyles = 'relative inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:pointer-events-none active:scale-95 cursor-pointer';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5 font-semibold',
  };

  const variantStyles = {
    cyan: 'bg-neon-cyan text-obsidian-950 hover:bg-neon-cyan/90 shadow-neon-cyan/30',
    violet: 'bg-neon-violet text-white hover:bg-neon-violet/90 shadow-neon-violet/30',
    emerald: 'bg-neon-emerald text-obsidian-950 hover:bg-neon-emerald/90 shadow-neon-emerald/30',
    amber: 'bg-neon-amber text-obsidian-950 hover:bg-neon-amber/90 shadow-neon-amber/30',
    glass: 'bg-obsidian-800/80 text-white border border-obsidian-700 hover:bg-obsidian-700/80 hover:border-obsidian-600',
    ghost: 'bg-transparent text-slate-300 hover:text-white hover:bg-obsidian-800/50',
  };

  return (
    <button
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        glow && variant !== 'ghost' && variant !== 'glass' && 'shadow-lg',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
