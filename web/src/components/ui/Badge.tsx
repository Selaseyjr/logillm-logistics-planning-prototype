import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export type BadgeTone =
  | "neutral"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "brand";

const toneClasses: Record<BadgeTone, string> = {
  neutral: "bg-slate-100 text-slate-700 ring-slate-200",
  success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  warning: "bg-amber-50 text-amber-700 ring-amber-200",
  danger: "bg-red-50 text-red-700 ring-red-200",
  info: "bg-blue-50 text-blue-700 ring-blue-200",
  brand: "bg-indigo-50 text-indigo-700 ring-indigo-200",
};

const dotClasses: Record<BadgeTone, string> = {
  neutral: "bg-slate-400",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
  info: "bg-blue-500",
  brand: "bg-indigo-500",
};

export function Badge({
  tone = "neutral",
  dot = false,
  pulse = false,
  className,
  children,
}: {
  tone?: BadgeTone;
  dot?: boolean;
  pulse?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset",
        toneClasses[tone],
        className
      )}
    >
      {dot ? (
        <span className="relative flex h-1.5 w-1.5">
          {pulse ? (
            <span
              className={cn(
                "absolute inline-flex h-full w-full animate-ping rounded-full opacity-60",
                dotClasses[tone]
              )}
            />
          ) : null}
          <span className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", dotClasses[tone])} />
        </span>
      ) : null}
      {children}
    </span>
  );
}
