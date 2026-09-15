"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { PlanningFormPanel } from "@/components/planning/PlanningFormPanel";
import { ResultPanel } from "@/components/planning/ResultPanel";
import {
  generateRecommendation,
  type PlanningForm,
  type Recommendation,
} from "@/lib/recommendation";

export default function PlanningPage() {
  const [status, setStatus] = useState<"empty" | "loading" | "done">("empty");
  const [form, setForm] = useState<PlanningForm>({
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
  const [result, setResult] = useState<Recommendation | null>(null);

  const runAnalysis = () => {
    setStatus("loading");
    setResult(null);
    setTimeout(() => {
      setResult(generateRecommendation(form));
      setStatus("done");
    }, 2400);
  };

  const reset = () => {
    setStatus("empty");
    setResult(null);
  };

  return (
    <>
      <PageHeader
        eyebrow="Planning"
        title="Shipment Planning"
        description="Configure shipment parameters to generate a logistics recommendation with modal trade-offs, risks, and a suggested action."
      />
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <PlanningFormPanel form={form} onChange={setForm} onSubmit={runAnalysis} />
        <ResultPanel status={status} result={result} onReset={reset} />
      </div>
    </>
  );
}
