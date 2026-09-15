"use client";

import { motion } from "framer-motion";
import { Leaf, Target, TrendingDown, BarChart3, PieChart } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { cn } from "@/lib/utils";
import {
  sustainabilityKpis,
  emissionsByMode,
  fleetMix,
  sustainabilityInitiatives,
  sustainabilityDirection,
} from "@/lib/data";

const maxG = 600;

const ease = [0.16, 1, 0.3, 1] as const;

export default function SustainabilityPage() {
  return (
    <>
      <PageHeader
        eyebrow="Impact"
        title="Sustainability Overview"
        description="Illustrative sustainability indicators for the logistics network."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {sustainabilityKpis.map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.35, ease }}
          >
            <Card className="p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{k.label}</p>
              <div className="mt-2 flex items-end justify-between gap-2">
                <p className="text-2xl font-semibold tracking-tight text-slate-900">{k.value}</p>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[11px] font-medium text-emerald-700">
                  <TrendingDown className={k.label === "Lower-Emission Modes" || k.label === "Route Efficiency" || k.label === "Consolidated Loads" ? "hidden" : ""} />
                  {k.delta}
                </span>
              </div>
            </Card>
  </motion.div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.35, ease }}
        >
          <Card className="h-full">
            <CardHeader
              title="Emissions Intensity by Mode"
              subtitle="Grams CO₂ per tonne-kilometre (illustrative)"
              icon={<BarChart3 className="h-4 w-4" />}
            />
            <CardBody className="space-y-3.5">
              {emissionsByMode.map((m, i) => (
                <div key={m.mode}>
                  <div className="mb-1 flex items-baseline justify-between text-sm">
                    <span className="font-medium text-slate-700">{m.mode}</span>
                    <span className="tabular-nums text-slate-500">
                      {m.gramsPerTkkm} g/tkm · {m.note}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <motion.div
                      className={cn(
                        "h-full rounded-full",
                        m.mode === "Air" ? "bg-amber-500" : m.mode === "Road" ? "bg-blue-500" : "bg-emerald-500"
                      )}
                      initial={{ width: 0 }}
                      animate={{ width: `${(m.gramsPerTkkm / maxG) * 100}%` }}
                      transition={{ delay: 0.2 + i * 0.08, duration: 0.7, ease }}
                    />
                  </div>
                </div>
              ))}
              <p className="pt-1 text-[11px] leading-relaxed text-slate-400">
                Air freight is roughly 9× more carbon-intensive than road and 35× more than ocean — mode choice is the single biggest emissions lever.
              </p>
            </CardBody>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.35, ease }}
          className="space-y-6"
        >
          <Card>
            <CardHeader
              title="Fleet Mode Mix"
              subtitle="Share of tonne-kilometres by mode"
              icon={<PieChart className="h-4 w-4" />}
            />
            <CardBody>
              <div className="flex h-3 w-full overflow-hidden rounded-full">
                {fleetMix.map((f, i) => (
                  <motion.div
                    key={f.mode}
                    className="h-full"
                    style={{ backgroundColor: f.color, width: 0 }}
                    initial={{ width: 0 }}
                    animate={{ width: `${f.share}%` }}
                    transition={{ delay: 0.25 + i * 0.08, duration: 0.6, ease }}
                  />
                ))}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
                {fleetMix.map((f) => (
                  <div key={f.mode} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-slate-600">
                      <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: f.color }} />
                      {f.mode}
                    </span>
                    <span className="font-medium tabular-nums text-slate-900">{f.share}%</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Sustainability Priorities"
              subtitle="Network direction"
              icon={<Target className="h-4 w-4" />}
            />
            <CardBody className="space-y-4">
              <p className="text-[13px] leading-relaxed text-slate-600">{sustainabilityDirection}</p>
              {sustainabilityInitiatives.map((init) => (
                <div key={init.title}>
                  <div className="mb-1 flex items-baseline justify-between gap-2">
                    <span className="text-sm font-medium text-slate-800">{init.title}</span>
                    <span className="text-[11px] text-slate-400">{init.target}</span>
                  </div>
                  <ProgressBar value={init.progress} tone="success" />
                  <p className="mt-1 text-[11px] text-slate-500">{init.description}</p>
                </div>
              ))}
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </>
  );
}
