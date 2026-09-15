"use client";

import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import type { Kpi } from "@/lib/data";
import { Sparkline } from "./Sparkline";

export function KpiCard({ kpi, index }: { kpi: Kpi; index: number }) {
  const TrendIcon =
    kpi.deltaDirection === "down" ? TrendingDown : kpi.deltaDirection === "up" ? TrendingUp : Minus;
  const trendColor = kpi.deltaGood
    ? "text-emerald-600 bg-emerald-50"
    : "text-red-600 bg-red-50";

  return (
    <div
      className="group rounded-xl border border-slate-200/80 bg-white p-4 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {kpi.label}
        </p>
      </div>
      <div className="mt-2 flex items-end justify-between gap-2">
        <span className="text-2xl font-semibold tracking-tight text-slate-900 tabular-nums">
          {kpi.value}
        </span>
        <Sparkline points={kpi.sparkline} className="h-8 w-20 shrink-0 text-blue-600" />
      </div>
      <div className="mt-2 flex items-center gap-2">
        {kpi.delta ? (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[11px] font-medium",
              trendColor
            )}
          >
            <TrendIcon className="h-3 w-3" />
            {kpi.delta}
          </span>
        ) : null}
        {kpi.footnote ? (
          <span className="text-[11px] text-slate-400">{kpi.footnote}</span>
        ) : null}
      </div>
    </div>
  );
}
