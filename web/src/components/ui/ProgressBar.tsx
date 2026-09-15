import { cn } from "@/lib/utils";

const barTones = {
  brand: "bg-blue-600",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
  neutral: "bg-slate-400",
} as const;

export function ProgressBar({
  value,
  tone = "brand",
  className,
}: {
  value: number;
  tone?: keyof typeof barTones;
  className?: string;
}) {
  return (
    <div
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-slate-100", className)}
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn("h-full rounded-full transition-[width] duration-700 ease-out", barTones[tone])}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}
