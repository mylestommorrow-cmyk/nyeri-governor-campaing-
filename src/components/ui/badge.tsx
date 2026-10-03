import * as React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'blue' | 'yellow' | 'dark' | 'outline' | 'success' | 'warning' | 'destructive';
}

export function Badge({
  className,
  variant = 'default',
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
        variant === 'default' && 'bg-zinc-100 text-zinc-900 border border-zinc-200',
        variant === 'blue' && 'bg-blue-100 text-blue-900 border border-blue-200',
        variant === 'yellow' && 'bg-yellow-300 text-yellow-950 font-bold border border-yellow-400',
        variant === 'dark' && 'bg-black text-white border border-zinc-800',
        variant === 'outline' && 'text-zinc-900 border border-zinc-300 bg-white',
        variant === 'success' && 'bg-emerald-100 text-emerald-900 border border-emerald-200',
        variant === 'warning' && 'bg-amber-100 text-amber-900 border border-amber-300',
        variant === 'destructive' && 'bg-red-100 text-red-800 border border-red-200',
        className
      )}
      {...props}
    />
  );
}
