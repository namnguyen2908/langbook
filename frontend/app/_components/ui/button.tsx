'use client';

import { type ButtonHTMLAttributes, forwardRef } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'accent' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  as?: 'button' | 'a';
  href?: string;
}

const variantStyles: Record<Variant, string> = {
  primary: 'bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700',
  secondary:
    'bg-white text-neutral-900 border border-neutral-200 hover:bg-neutral-100 active:bg-neutral-200',
  ghost:
    'bg-transparent text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200',
  accent:
    'bg-accent-500 text-white hover:bg-accent-600 active:bg-accent-700',
  danger:
    'bg-error text-white hover:bg-red-600 active:bg-red-700',
};

const sizeStyles: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-sm',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', as = 'button', href, ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center gap-2 font-medium rounded-[10px] transition-all duration-150 ease-in-out active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 disabled:pointer-events-none disabled:bg-neutral-100 disabled:text-neutral-300';

    if (as === 'a' && href) {
      return (
        <a href={href} className={`${base} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
          {props.children}
        </a>
      );
    }

    return (
      <button
        ref={ref}
        className={`${base} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';
