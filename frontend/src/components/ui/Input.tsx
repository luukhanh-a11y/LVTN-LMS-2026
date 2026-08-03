import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  error?: string;
  theme?: 'light' | 'dark';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, type = 'text', theme = 'light', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    // Các class tĩnh chung
    const baseInputClasses = "flex w-full h-[48px] rounded-[24px] border-2 px-5 font-bold shadow-sm transition-all duration-300 outline-none text-[16px]";
    
    // Light Theme
    const lightClasses = [
      "border-primary/30 bg-[rgba(255,255,255,0.35)] backdrop-blur-[12px] text-slate-900",
      "placeholder:text-slate-400 placeholder:font-medium placeholder:text-[15px]",
      "focus:border-primary focus:bg-[rgba(255,255,255,0.9)] focus:ring-[4px] focus:ring-primary/20 focus:shadow-[0_0_15px_rgba(75,158,255,0.3)]",
      "hover:bg-[rgba(255,255,255,0.8)] hover:border-primary/50",
      "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500",
      error ? "border-red-400 bg-red-50 focus:border-red-500 focus:bg-red-50 focus:ring-red-500/20 text-red-900" : ""
    ].join(" ");

    // Dark Theme (Glassmorphism Dark)
    const darkClasses = [
      "border-white/20 bg-white/10 text-white backdrop-blur-md",
      "placeholder:text-white/50 placeholder:font-medium placeholder:text-[15px]",
      "focus:border-accent focus:bg-white/20 focus:ring-[4px] focus:ring-accent/30 focus:shadow-[0_0_20px_rgba(129,140,248,0.4)]",
      "hover:bg-white/15 hover:border-white/40",
      "disabled:cursor-not-allowed disabled:bg-white/5 disabled:text-white/30",
      error ? "border-red-400/60 bg-red-500/10 focus:border-red-400 focus:bg-red-500/20 focus:ring-red-500/30 text-red-200" : ""
    ].join(" ");

    return (
      <div className="w-full">
        {label && (
          <label className={cn(
            "flex items-center gap-2 text-[15px] font-bold mb-2",
            theme === 'dark' ? "text-accent" : "text-primary"
          )}>
            {label}
          </label>
        )}
        <div className="relative flex items-center group">
          <input
            ref={ref}
            type={inputType}
            className={cn(
              baseInputClasses,
              theme === 'dark' ? darkClasses : lightClasses,
              isPassword && "pr-12",
              // Fix autofill background
              theme === 'dark' 
                ? "[&:-webkit-autofill]:bg-transparent [&:-webkit-autofill]:[box-shadow:0_0_0_30px_#2d1b69_inset] [&:-webkit-autofill]:text-white"
                : "[&:-webkit-autofill]:bg-white [&:-webkit-autofill]:[box-shadow:0_0_0_30px_white_inset]",
              "[&::-ms-reveal]:hidden [&::-ms-clear]:hidden",
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={cn(
                "absolute right-5 transition-colors focus:outline-none flex items-center justify-center h-full",
                theme === 'dark' ? "text-white/50 hover:text-white" : "text-slate-400 hover:text-slate-600"
              )}
            >
              {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          )}
        </div>
        {error && <p className="mt-2 text-sm text-red-400 font-bold px-4">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
