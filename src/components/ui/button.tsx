import * as React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'yellow' | 'outline' | 'ghost' | 'destructive' | 'dark';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none rounded-lg text-sm',
          // Variants with Blue, Yellow, and Black theme
          variant === 'default' &&
            'bg-blue-600 text-white hover:bg-blue-700 shadow-sm focus-visible:ring-blue-600',
          variant === 'primary' &&
            'bg-blue-700 text-white hover:bg-blue-800 shadow-sm focus-visible:ring-blue-700',
          variant === 'yellow' &&
            'bg-yellow-400 text-black font-semibold hover:bg-yellow-500 shadow-sm focus-visible:ring-yellow-400 border border-yellow-500/20',
          variant === 'dark' &&
            'bg-black text-white hover:bg-zinc-900 shadow-sm focus-visible:ring-black border border-zinc-800',
          variant === 'outline' &&
            'border-2 border-black/15 bg-white text-zinc-900 hover:bg-zinc-50 hover:border-black/30',
          variant === 'ghost' &&
            'text-zinc-700 hover:bg-zinc-100 hover:text-black',
          variant === 'destructive' &&
            'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600',
          // Sizes
          size === 'default' && 'h-10 px-4 py-2',
          size === 'sm' && 'h-8 rounded-md px-3 text-xs',
          size === 'lg' && 'h-12 rounded-lg px-6 text-base font-semibold',
          size === 'icon' && 'h-9 w-9 p-0',
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
