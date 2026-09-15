"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  CircleAlert,
  FileWarning,
  Ship,
  CloudLightning,
  Boxes,
  ShieldCheck,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { riskItems, riskSummary, type Severity, type RiskItem } from "@/lib/data";

const severityTone: Record<Severity, "danger" | "warning" | "neutral"> = {
  high: "danger",
  medium: "warning",
  low: "neutral",
};

const categoryIcons: Record<RiskItem["category"], typeof Ship> = {
  documentation: FileWarning,
  capacity: Boxes,
  weather: CloudLightning,
  congestion: Ship,
};

const FILTERS = ["All", "High", "Medium", "Low"] as const;

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function RiskPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");

  const filtered = useMemo(() => {
    if (filter === "All") return riskItems;
    return riskItems.filter((r) => r.severity === filter.toLowerCase());
  }, [filter]);

  return (
    <>
      <PageHeader
        eyebrow="Operations"
        title="Risk & Exceptions"
        description="Illustrative operational exceptions requiring monitoring or intervention."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {riskSummary.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  {s.label}
                </p>
                <Badge tone={s.tone} dot>
                  {s.label === "High Priority" ? "Act now" : s.label === "Medium Priority" ? "Monitor" : "On track"}
                </Badge>
              </div>
              <p className="mt-2 text-2xl font-semibold tabular-nums tracking-tight text-slate-900">
                {s.value}
              </p>
              <p className="mt-0.5 text-xs text-slate-400">{s.footnote}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-slate-900">
          Active exceptions
          <span className="ml-2 text-xs font-normal text-slate-400">{filtered.length} shown</span>
        </h2>
        <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "relative rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-150",
                filter === f ? "text-slate-900" : "text-slate-500 hover:text-slate-700"
              )}
            >
              {filter === f ? (
                <motion.span
                  layoutId="risk-filter"
                  className="absolute inset-0 rounded-md bg-white shadow-sm"
                  transition={{ type: "spring", damping: 30, stiffness: 400 }}
                />
              ) : null}
              <span className="relative">{f}</span>
            </button>
          ))}
        </div>
      </div>

      <motion.div
        variants={listVariants}
        initial="hidden"
        animate="show"
        className="mt-3 grid gap-3 lg:grid-cols-2"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((r) => {
            const Icon = categoryIcons[r.category];
            return (
              <motion.div
                layout
                key={r.id}
                variants={itemVariants}
                exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.15 } }}
              >
                <Card className="h-full p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover">
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                        r.severity === "high"
                          ? "bg-red-50 text-red-600"
                          : r.severity === "medium"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-slate-100 text-slate-500"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-slate-900">{r.issue}</p>
                        <Badge tone={severityTone[r.severity]} dot pulse={r.severity === "high"}>
                          {r.severity.charAt(0).toUpperCase() + r.severity.slice(1)}
                        </Badge>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {r.id} · {r.origin} → {r.destination}
                      </p>
                      <p className="mt-2 text-[13px] leading-relaxed text-slate-600">{r.detail}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400">
                        <span className="inline-flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Detected {r.detected}
                        </span>
                        <span>{r.owner}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 ? (
        <Card className="mt-3 flex flex-col items-center justify-center p-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <p className="mt-3 text-sm font-medium text-slate-700">No exceptions at this severity</p>
          <p className="mt-1 text-xs text-slate-500">
            The network is clear for the selected filter.
          </p>
        </Card>
      ) : null}
    </>
  );
}
