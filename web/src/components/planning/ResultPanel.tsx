"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  ChevronRight,
  Coins,
  Gauge as GaugeIcon,
  Lightbulb,
  ListChecks,
  Loader2,
  Plane,
  RotateCcw,
  Route,
  Ship,
  Sparkles,
  TrainFront,
  Truck,
  Zap,
} from "lucide-react";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { cn } from "@/lib/utils";
import type { Recommendation } from "@/lib/recommendation";

const STAGES = [
  "Validating shipment parameters",
  "Scoring transport modes against constraints",
  "Weighing cost, speed and emissions trade-offs",
  "Compiling recommendation",
] as const;

function fitFor(score: number) {
  if (score >= 80) return { tone: "success" as const, label: "Strong fit" };
  if (score >= 60) return { tone: "info" as const, label: "Viable" };
  return { tone: "neutral" as const, label: "Poor fit" };
}

const MODE_ICONS: Record<string, typeof Plane> = {
  Air: Plane,
  Ocean: Ship,
  Road: Truck,
  Rail: TrainFront,
};

const ease = [0.16, 1, 0.3, 1] as const;

export function ResultPanel({
  status,
  result,
  onReset,
}: {
  status: "empty" | "loading" | "done";
  result: Recommendation | null;
  onReset: () => void;
}) {
  const [stage, setStage] = useState(0);
  const [expanded, setExpanded] = useState<string | null>("reasoning");

  useEffect(() => {
    if (status === "loading") {
      setStage(0);
      const timers = STAGES.map((_, i) =>
        i > 0 ? setTimeout(() => setStage(i), i * 550) : undefined
      );
      return () => timers.forEach((t) => t && clearTimeout(t));
    }
  }, [status]);

  if (status === "empty") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease }}
      >
        <Card className="flex min-h-[460px] flex-col items-center justify-center border-dashed">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <Route className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-sm font-semibold text-slate-700">No recommendation yet</h3>
          <p className="mt-1 max-w-xs text-center text-[13px] leading-relaxed text-slate-500">
            Fill in the shipment parameters and generate a recommendation to see modal
            trade-offs, risks, and a suggested action.
          </p>
          <div className="mt-5 grid w-full max-w-sm grid-cols-3 gap-2 px-4">
            {["Mode fit", "Cost & speed", "Risks & action"].map((s, i) => (
              <div
                key={s}
                className="rounded-lg border border-slate-200 bg-slate-50/60 px-2 py-2.5 text-center"
              >
                <p className="text-[11px] font-semibold text-slate-400">0{i + 1}</p>
                <p className="text-[11px] text-slate-500">{s}</p>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    );
  }

  if (status === "loading") {
    return (
      <Card className="min-h-[460px]">
        <CardHeader title="Analysing shipment..." subtitle="Evaluating logistics options" />
        <CardBody className="space-y-5">
          {STAGES.map((s, i) => (
            <div key={s} className="flex items-start gap-3">
              <div className="mt-0.5">
                {i < stage ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : i === stage ? (
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 border-slate-200" />
                )}
              </div>
              <div className="flex-1 pb-1">
                <p
                  className={cn(
                    "text-[13px] font-medium transition-colors duration-200",
                    i < stage ? "text-slate-400" : i === stage ? "text-slate-900" : "text-slate-400"
                  )}
                >
                  {s}
                </p>
                {i === stage ? (
                  <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-slate-100">
                    <motion.div
                      className="h-full w-1/3 rounded-full bg-blue-500"
                      animate={{ x: ["-100%", "300%"] }}
                      transition={{ repeat: Infinity, duration: 1.1, ease: "easeInOut" }}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          ))}
          <div className="rounded-lg border border-blue-100 bg-blue-50/60 px-3 py-2.5 text-xs leading-relaxed text-blue-800">
            Mock analysis for the UI experiment - a production build would call the AI decision-support service here.
          </div>
        </CardBody>
      </Card>
    );
  }

  return <ResultView result={result!} onReset={onReset} />;
}

function ResultView({ result, onReset }: { result: Recommendation; onReset: () => void }) {
  const [expanded, setExpanded] = useState<string | null>("reasoning");
  const sections = [
    { id: "reasoning", title: "Reasoning", icon: Lightbulb, items: result.reasoning },
    { id: "cost", title: "Cost Considerations", icon: Coins, items: result.costConsiderations },
    { id: "speed", title: "Speed Considerations", icon: Zap, items: result.speedConsiderations },
    { id: "risks", title: "Operational Risks", icon: ListChecks, items: result.operationalRisks },
    { id: "sustainability", title: "Sustainability", icon: GaugeIcon, items: result.sustainabilityConsiderations },
  ];
  const alt = result.options[1];
  const BestIcon = MODE_ICONS[result.recommended] ?? Ship;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease }}
    >
      <Card>
        <CardHeader
          title="Logistics Recommendation"
          subtitle={`Generated ${result.generatedAt} - mock analysis`}
          icon={<Sparkles className="h-4 w-4 text-blue-600" />}
          action={
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              New analysis
            </button>
          }
        />
        <CardBody className="space-y-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease }}
            className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
                  <BestIcon className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[15px] font-semibold text-slate-900">{result.headline}</p>
                    <Badge tone="success" dot>Confident match</Badge>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">
                    vs closest alternative: {alt.label} ({alt.score}/100)
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Confidence</p>
                <p className="text-xl font-semibold tabular-nums text-slate-900">{result.confidence}%</p>
              </div>
            </div>
          </motion.div>

          <div className="space-y-2">
            {result.options.map((o, i) => {
              const Icon = MODE_ICONS[o.mode] ?? Ship;
              const fit = fitFor(o.score);
              const best = i === 0;
              return (
                <motion.div
                  key={o.mode}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.07, duration: 0.3, ease }}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border p-3 transition-all duration-200 hover:shadow-card-hover",
                    best
                      ? "border-blue-200 bg-blue-50/50 ring-1 ring-blue-100"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                      best ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-slate-900">{o.label}</p>
                      {best ? <Badge tone="brand">Recommended</Badge> : null}
                      <Badge tone={fit.tone}>{fit.label}</Badge>
                    </div>
                    <p className="mt-0.5 truncate text-[11px] text-slate-500">{o.note}</p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <ProgressBar value={o.score} tone={best ? "brand" : "neutral"} className="h-1 max-w-56 flex-1" />
                      <span className="text-[11px] font-medium tabular-nums text-slate-500">{o.score}/100</span>
                    </div>
                  </div>
                  <div className="hidden shrink-0 grid-cols-4 gap-5 text-right sm:grid">
                    <Metric label="Transit" value={`${o.transitDays}d`} />
                    <Metric label="Cost" value={`EUR ${o.costEur.toLocaleString("de-DE")}`} />
                    <Metric label="CO2" value={`${o.co2Kg.toLocaleString("de-DE")} kg`} />
                    <Metric label="Reliability" value={`${o.reliability}%`} />
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.3, ease }}
            className="rounded-xl border border-emerald-200 bg-emerald-50 p-4"
          >
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              <div>
                <p className="text-[13px] font-semibold text-emerald-900">Recommended action</p>
                <p className="mt-0.5 text-[13px] leading-relaxed text-emerald-800">{result.recommendedAction}</p>
              </div>
            </div>
          </motion.div>

          <div className="space-y-2">
            {sections.map((s) => {
              const open = expanded === s.id;
              return (
                <div key={s.id} className="overflow-hidden rounded-xl border border-slate-200">
                  <button
                    onClick={() => setExpanded(open ? null : s.id)}
                    className="flex w-full items-center gap-2.5 px-3.5 py-3 text-left transition-colors hover:bg-slate-50"
                  >
                    <s.icon className="h-4 w-4 text-slate-400" />
                    <span className="flex-1 text-[13px] font-medium text-slate-800">{s.title}</span>
                    <ChevronRight
                      className={cn(
                        "h-4 w-4 text-slate-400 transition-transform duration-200",
                        open ? "rotate-90" : ""
                      )}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {open ? (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease }}
                      >
                        <ul className="space-y-2 border-t border-slate-100 px-3.5 py-3">
                          {s.items.map((item, j) => (
                            <motion.li
                              key={j}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.04 * j }}
                              className="flex gap-2 text-[13px] leading-relaxed text-slate-600"
                            >
                              <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-300" />
                              <span>{item}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wide text-slate-400">{label}</p>
      <p className="text-[13px] font-medium tabular-nums text-slate-900">{value}</p>
    </div>
  );
}
