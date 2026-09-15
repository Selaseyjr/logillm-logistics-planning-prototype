"use client";

import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Field({
  label,
  hint,
  required,
  error,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 flex items-baseline justify-between text-[13px] font-medium text-slate-700">
        <span>
          {label}
          {required ? <span className="ml-0.5 text-red-500">*</span> : null}
        </span>
        {hint ? <span className="text-[11px] font-normal text-slate-400">{hint}</span> : null}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TextInput({
  className,
  error,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition-colors duration-150 outline-none hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10",
        error ? "border-red-300 focus:border-red-400 focus:ring-red-500/10" : "border-slate-300",
        className
      )}
    />
  );
}
