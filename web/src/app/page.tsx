"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, PackageSearch, Radio, Gauge } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { KpiCard } from "@/components/ui/KpiCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  overviewKpis,
  recentActivity,
  transportUtilisation,
  networkPulse,
  type ShipmentStatus,
} from "@/lib/data";

const statusTones: Record<ShipmentStatus, BadgeTone> = {
  "on-schedule": "success",
  "in-transit": "success",
  "at-risk": "warning",
  delivered: "info",
  exception: "danger",
};

const modeLabels: Record<string, string> = {
  air: "Air",
  ocean: "Ocean",
  road: "Road",
  rail: "Rail",
};

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const },
  },
};

function OverviewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-[116px] animate-pulse rounded-xl border border-slate-200/80 bg-white"
          />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="h-72 animate-pulse rounded-xl border border-slate-200/80 bg-white lg:col-span-2" />
        <div className="h-72 animate-pulse rounded-xl border border-slate-200/80 bg-white" />
      </div>
    </div>
  );
}

export default function OverviewPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <>
        <PageHeader
          eyebrow="Network"
          title="Overview"
          description="Live snapshot of the logistics network — shipments, service levels, and exceptions."
        />
        <OverviewSkeleton />
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Network"
        title="Overview"
        description="Live snapshot of the logistics network — shipments, service levels, and exceptions."
        actions={
          <Link
            href="/planning"
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm transition-all duration-150 hover:bg-blue-700 hover:shadow-md active:scale-[0.98]"
          >
            Plan a shipment
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {overviewKpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <KpiCard kpi={kpi} index={i} />
          </motion.div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader
              title="Recent Shipment Activity"
              subtitle="Latest movements across the network"
              icon={<PackageSearch className="h-4 w-4" />}
              action={
                <Link
                  href="/risk"
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50"
                >
                  View exceptions
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              }
            />
            <CardBody className="px-2 pb-3">
              <motion.ul
                variants={listVariants}
                initial="hidden"
                animate="show"
                className="divide-y divide-slate-100"
              >
                {recentActivity.map((a) => (
                  <motion.li
                    key={a.id}
                    variants={itemVariants}
                    className="group flex items-center gap-4 rounded-lg px-3 py-3 transition-colors duration-150 hover:bg-slate-50"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[10px] font-semibold uppercase tracking-wide text-slate-600 transition-colors group-hover:bg-blue-50 group-hover:text-blue-700">
                      {modeLabels[a.mode]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {a.origin} <span className="text-slate-300">→</span> {a.destination}
                      </p>
                      <p className="text-xs text-slate-500">{a.id}</p>
                    </div>
                    <div className="hidden text-right sm:block">
                      <p className="text-xs text-slate-500">{a.eta}</p>
                    </div>
                    <Badge tone={statusTones[a.status]} dot pulse={a.status === "in-transit"}>
                      {a.statusLabel}
                    </Badge>
                  </motion.li>
                ))}
              </motion.ul>
            </CardBody>
          </Card>
        </motion.section>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          <Card>
            <CardHeader
              title="Transport Utilisation"
              subtitle="Capacity in use by mode"
              icon={<Gauge className="h-4 w-4" />}
            />
            <CardBody className="space-y-4">
              {transportUtilisation.map((t) => (
                <div key={t.mode}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="text-slate-600">{t.mode}</span>
                    <span className="font-medium tabular-nums text-slate-900">{t.value}%</span>
                  </div>
                  <ProgressBar
                    value={t.value}
                    tone={t.value >= 80 ? "warning" : t.value >= 60 ? "brand" : "neutral"}
                  />
                </div>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Operational Pulse"
              icon={<Radio className="h-4 w-4" />}
            />
            <CardBody className="space-y-3">
              <p className="text-[13px] leading-relaxed text-slate-600">
                {networkPulse.insight}
              </p>
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-[13px] leading-relaxed text-amber-800">
                {networkPulse.priority}
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </>
  );
}
