"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Package,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Link2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  decisionMetrics,
  decisionWorkflow,
  designPrinciple,
} from "@/lib/data";

const workflowIcons: Record<string, LucideIcon> = {
  package: Package,
  scan: ScanSearch,
  shield: ShieldCheck,
  sparkles: Sparkles,
  user: UserCheck,
};

const ease = [0.16, 1, 0.3, 1] as const;

export default function DecisionSupportPage() {
  return (
    <>
      <PageHeader
        eyebrow="Intelligence"
        title="AI Decision Support"
        description="Decision-support layer designed to assist logistics planners with shipment-level recommendations."
        actions={
          <Link
            href="/planning"
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm transition-all duration-150 hover:bg-blue-700 hover:shadow-md active:scale-[0.98]"
          >
            Open planner
            <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {decisionMetrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.35, ease }}
          >
            <Card className="p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-600">
                {m.label}
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{m.value}</p>
              <p className="mt-0.5 text-xs text-slate-500">{m.metric}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.35, ease }}
          className="lg:col-span-3"
        >
          <Card className="h-full">
            <CardHeader
              title="Decision Workflow"
              subtitle="From raw shipment data to a human decision"
              icon={<Link2 className="h-4 w-4" />}
            />
            <CardBody>
              <ol className="relative space-y-1">
                <span className="absolute bottom-5 left-[22px] top-5 w-px bg-slate-200" aria-hidden />
                {decisionWorkflow.map((step, i) => {
                  const Icon = workflowIcons[step.icon] ?? Package;
                  return (
                    <motion.li
                      key={step.number}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.08, duration: 0.3, ease }}
                      className="group relative flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-slate-50"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors group-hover:border-blue-200 group-hover:text-blue-600">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">
                          <span className="mr-2 text-[11px] font-semibold tabular-nums text-slate-400">{step.number}</span>
                          {step.stage}
                        </p>
                      </div>
                      <Badge tone={i === 4 ? "success" : "neutral"}>{step.description}</Badge>
                    </motion.li>
                  );
                })}
              </ol>
            </CardBody>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.35, ease }}
          className="lg:col-span-2"
        >
          <Card className="flex h-full flex-col">
            <CardHeader
              title="Design Principle"
              subtitle="Human-in-the-loop"
              icon={<ShieldCheck className="h-4 w-4" />}
            />
            <CardBody className="flex flex-1 flex-col justify-between gap-4">
              <p className="text-[13px] leading-relaxed text-slate-600">{designPrinciple}</p>
              <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3.5">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-700">
                  <Sparkles className="h-3.5 w-3.5" />
                  UI experiment
                </p>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-blue-800">
                  This interface runs entirely on mock data. The planning workflow simulates
                  the decision-support service so the full UX loop can be evaluated without a
                  backend.
                </p>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </>
  );
}
