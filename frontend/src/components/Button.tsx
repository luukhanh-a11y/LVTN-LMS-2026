import type { ButtonHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { cn } from '../lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', leftIcon, children, ...props }, ref) => {

    // Base classes that all buttons share
    const baseClasses = "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed";

    // Size variations
    const sizeClasses = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-2.5 text-base",
      lg: "px-8 py-3 text-lg",
    };

    // Variant variations
    const variantClasses = {
      primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md",
      secondary: "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 shadow-sm",
      outline: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-sm",
      ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900",
      danger: "bg-red-50 text-red-600 hover:bg-red-100",
    };

    return (
      <button
        ref={ref}
        className={cn(baseClasses, sizeClasses[size], variantClasses[variant], className)}
        {...props}
      >
        {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
