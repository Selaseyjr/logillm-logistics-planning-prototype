"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Loader2,
  MapPin,
  Package,
  Scale,
  Wallet,
  ClipboardList,
  RotateCcw,
} from "lucide-react";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Field, TextInput } from "@/components/ui/Field";
import { Select } from "@/components/ui/Select";
import { cn } from "@/lib/utils";
import {
  cargoTypes,
  urgencies,
  businessPriorities,
  deliveryWindows,
  preferredModes,
  type PlanningForm,
  type Urgency,
  type Priority,
  type DeliveryWindow,
  type PreferredMode,
} from "@/lib/recommendation";

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-medium text-slate-700">{label}</label>
      <div className="grid auto-cols-fr grid-flow-col gap-1 rounded-lg bg-slate-100 p-1">
        {options.map((opt) => {
          const active = opt === value;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className={cn(
                "relative rounded-md px-2 py-1.5 text-[12.5px] font-medium transition-colors duration-150",
                active ? "text-slate-900" : "text-slate-500 hover:text-slate-700"
              )}
            >
              {active ? (
                <motion.span
                  layoutId={`seg-${label}`}
                  className="absolute inset-0 rounded-md bg-white shadow-sm"
                  transition={{ type: "spring", damping: 30, stiffness: 400 }}
                />
              ) : null}
              <span className="relative">{opt}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function PlanningFormPanel({
  form,
  onChange,
  onSubmit,
}: {
  form: PlanningForm;
  onChange: (f: PlanningForm) => void;
  onSubmit: () => void;
}) {
  const [errors, setErrors] = useState<{ origin?: string; destination?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  const set = <K extends keyof PlanningForm>(key: K, value: PlanningForm[K]) =>
    onChange({ ...form, [key]: value });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!form.origin.trim()) errs.origin = "Origin is required";
    if (!form.destination.trim()) errs.destination = "Destination is required";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSubmitting(true);
    onSubmit();
  };

  return (
    <Card className="xl:sticky xl:top-20">
      <CardHeader
        title="Shipment Parameters"
        subtitle="Describe the consignment to analyse"
        icon={<ClipboardList className="h-4 w-4" />}
      />
      <CardBody>
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Origin" required error={errors.origin}>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <TextInput
                  placeholder="e.g. Frankfurt"
                  value={form.origin}
                  error={!!errors.origin}
                  onChange={(e) => {
                    set("origin", e.target.value);
                    if (errors.origin) setErrors((p) => ({ ...p, origin: undefined }));
                  }}
                  className="pl-9"
                />
              </div>
            </Field>
            <Field label="Destination" required error={errors.destination}>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <TextInput
                  placeholder="e.g. Accra"
                  value={form.destination}
                  error={!!errors.destination}
                  onChange={(e) => {
                    set("destination", e.target.value);
                    if (errors.destination) setErrors((p) => ({ ...p, destination: undefined }));
                  }}
                  className="pl-9"
                />
              </div>
            </Field>
          </div>

          <div className="mt-4">
            <Field label="Cargo Type">
              <Select
                value={form.cargoType}
                onChange={(v) => set("cargoType", v)}
                options={cargoTypes.map((c) => ({ value: c, label: c }))}
              />
            </Field>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <Field label="Cargo Weight" hint="kg">
              <div className="relative">
                <Scale className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <TextInput
                  type="number"
                  min={1}
                  value={form.weightKg}
                  onChange={(e) => set("weightKg", Math.max(1, Number(e.target.value) || 1))}
                  className="pl-9"
                />
              </div>
            </Field>
            <Field label="Cargo Value" hint="€">
              <div className="relative">
                <Wallet className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <TextInput
                  type="number"
                  min={0}
                  value={form.cargoValueEur}
                  onChange={(e) => set("cargoValueEur", Math.max(0, Number(e.target.value) || 0))}
                  className="pl-9"
                />
              </div>
            </Field>
          </div>

          <div className="mt-4">
            <Segmented
              label="Urgency"
              value={form.urgency}
              options={urgencies}
              onChange={(v) => set("urgency", v as Urgency)}
            />
          </div>

          <div className="mt-4">
            <Field label="Business Priority">
              <Select
                value={form.businessPriority}
                onChange={(v) => set("businessPriority", v as Priority)}
                options={businessPriorities.map((p) => ({ value: p, label: p }))}
              />
            </Field>
          </div>

          <div className="mt-4">
            <Field label="Delivery Window">
              <Select
                value={form.deliveryWindow}
                onChange={(v) => set("deliveryWindow", v as DeliveryWindow)}
                options={deliveryWindows.map((d) => ({ value: d, label: d }))}
              />
            </Field>
          </div>

          <div className="mt-4">
            <Field label="Preferred Mode">
              <Select
                value={form.preferredMode}
                onChange={(v) => set("preferredMode", v as PreferredMode)}
                options={preferredModes.map((m) => ({ value: m, label: m === "No Preference" ? m : `${m} Freight` }))}
              />
            </Field>
          </div>

          <div className="mt-6 flex items-center gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="group inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-150 hover:bg-blue-700 hover:shadow-md active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analysing…
                </>
              ) : (
                <>
                  Generate Recommendation
                  <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                onChange({
                  origin: "",
                  destination: "",
                  cargoType: "General Cargo",
                  weightKg: 1000,
                  cargoValueEur: 10000,
                  urgency: "Standard",
                  businessPriority: "Balanced",
                  deliveryWindow: "Within 7 days",
                preferredMode: "No Preference",
                });
              }}
              title="Reset form"
              className="rounded-lg border border-slate-200 p-2.5 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
