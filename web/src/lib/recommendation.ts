export type Urgency = "Standard" | "High" | "Critical";
export type Priority = "Cost Optimisation" | "Balanced" | "Speed / Service";
export type DeliveryWindow =
  | "Flexible"
  | "Within 7 days"
  | "Within 3 days"
  | "Within 24 hours";
export type PreferredMode = "No Preference" | "Air" | "Ocean" | "Road" | "Rail";

export interface PlanningForm {
  origin: string;
  destination: string;
  cargoType: string;
  weightKg: number;
  cargoValueEur: number;
  urgency: Urgency;
  businessPriority: Priority;
  deliveryWindow: DeliveryWindow;
  preferredMode: PreferredMode;
}

export interface ModeOption {
  mode: "Air" | "Ocean" | "Road" | "Rail";
  label: string;
  score: number; // 0–100
  transitDays: number;
  costEur: number;
  co2Kg: number;
  reliability: number; // 0–100
  note: string;
}

export interface Recommendation {
  headline: string;
  recommended: ModeOption["mode"];
  confidence: number; // 0–100
  reasoning: string[];
  costConsiderations: string[];
  speedConsiderations: string[];
  operationalRisks: string[];
  sustainabilityConsiderations: string[];
  recommendedAction: string;
  options: ModeOption[];
  generatedAt: string;
}

const CARGO_HINTS: Record<string, { airFactor: number; oceanFactor: number; note: string }> = {
  Electronics: { airFactor: 1.25, oceanFactor: 0.9, note: "High value-to-weight favours faster, more secure routings." },
  Pharmaceuticals: { airFactor: 1.4, oceanFactor: 0.7, note: "Temperature integrity and shelf life argue for the shortest transit." },
  "Automotive Parts": { airFactor: 1.0, oceanFactor: 1.1, note: "Line-down risk only when production JIT windows are tight." },
  "Food & Perishables": { airFactor: 1.35, oceanFactor: 0.6, note: "Perishability sharply limits acceptable transit time." },
  "Industrial Equipment": { airFactor: 0.6, oceanFactor: 1.3, note: "Heavy, bulky freight is cost-prohibitive by air." },
  "General Cargo": { airFactor: 1.0, oceanFactor: 1.0, note: "No cargo-specific constraints; cost/service balance decides." },
};

function slug(values: string[]): number {
  let h = 0;
  for (const v of values) {
    for (let i = 0; i < v.length; i++) {
      h = (h * 31 + v.charCodeAt(i)) >>> 0;
    }
  }
  return h;
}

export function generateRecommendation(form: PlanningForm): Recommendation {
  const hint = CARGO_HINTS[form.cargoType] ?? CARGO_HINTS["General Cargo"];
  const seed = slug([form.origin, form.destination, form.cargoType, form.urgency, form.deliveryWindow, String(form.weightKg)]);

  // Deterministic pseudo-random jitter from the seed (0.92–1.08)
  const jitter = (n: number) => 0.92 + ((seed >> n) % 17) / 100;

  const windowDays: Record<DeliveryWindow, number> = {
    "Flexible": 21,
    "Within 7 days": 7,
    "Within 3 days": 3,
    "Within 24 hours": 1,
  };
  const budget = windowDays[form.deliveryWindow];

  const base = {
    Air: { days: 1.5, costPerKg: 4.6, co2PerKg: 0.56, reliability: 92 },
    Ocean: { days: 18, costPerKg: 0.45, co2PerKg: 0.016, reliability: 84 },
    Road: { days: 4, costPerKg: 1.1, co2PerKg: 0.062, reliability: 90 },
    Rail: { days: 9, costPerKg: 0.8, co2PerKg: 0.022, reliability: 87 },
  } as const;

  const weightT = Math.max(form.weightKg, 1) / 1000;

  const options: ModeOption[] = (Object.keys(base) as Array<keyof typeof base>).map((mode) => {
    const b = base[mode];
    const airBoost = mode === "Air" ? hint.airFactor : 1;
    const oceanBoost = mode === "Ocean" ? hint.oceanFactor : 1;

    const transitDays = Math.round(b.days * jitter(mode.length + 2) * 10) / 10;

    const costEur = Math.round(
      (form.weightKg * b.costPerKg * jitter(mode.length) * airBoost * oceanBoost +
        form.cargoValueEur * 0.0004) /
        10
    ) * 10;

    const co2Kg = Math.round(form.weightKg * b.co2PerKg * 10) / 10;

    // Score: fit against delivery window, business priority, and urgency
    let score = 50;
    const timeRatio = transitDays / Math.max(budget, 0.5);
    score += timeRatio <= 0.6 ? 28 : timeRatio <= 1 ? 14 : -Math.min(40, (timeRatio - 1) * 45);

    if (form.businessPriority === "Cost Optimisation") {
      score += mode === "Ocean" ? 18 : mode === "Rail" ? 12 : mode === "Road" ? 4 : -14;
    } else if (form.businessPriority === "Speed / Service") {
      score += mode === "Air" ? 18 : mode === "Road" ? 10 : -10;
    } else {
      score += mode === "Rail" || mode === "Road" ? 6 : 0;
    }

    if (form.urgency === "Critical") score += mode === "Air" ? 12 : mode === "Ocean" ? -12 : 0;
    if (form.urgency === "Standard" && mode === "Ocean") score += 6;

    if (form.preferredMode === mode) score += 10;
    else if (form.preferredMode !== "No Preference") score -= 4;

    score += (b.reliability - 86) / 2;
    if (form.weightKg > 5000 && mode === "Air") score -= 8;
    if (form.weightKg > 2000 && mode === "Rail") score += 3;

    score = Math.max(5, Math.min(97, Math.round(score * jitter(4))));

    const notes: Record<ModeOption["mode"], string> = {
      Air: `Transit ≈ ${transitDays}d · premium cost, minimal dwell`,
      Ocean: `Transit ≈ ${transitDays}d · lowest cost, longest lead`,
      Road: `Transit ≈ ${transitDays}d · strong for intra-EU lanes`,
      Rail: `Transit ≈ ${transitDays}d · balanced cost/emissions`,
    };

    return {
      mode,
      label: mode === "Air" ? "Air Freight" : mode === "Ocean" ? "Ocean Freight" : mode === "Road" ? "Road Freight" : "Rail Freight",
      score,
      transitDays,
      costEur,
      co2Kg,
      reliability: Math.round(b.reliability * jitter(6)),
      note: notes[mode],
    };
  });

  const best = [...options].sort((a, b) => b.score - a.score)[0];
  const second = [...options].sort((a, b) => b.score - a.score)[1];

  const origin = form.origin.trim() || "Origin";
  const destination = form.destination.trim() || "Destination";

  const reasoning = [
    `${best.label} scores ${best.score}/100 for ${origin} → ${destination} under a "${form.businessPriority}" priority with a ${form.deliveryWindow.toLowerCase()} delivery window.`,
    `${hint.note}`,
    `With ${form.urgency.toLowerCase()} urgency and ${form.weightKg.toLocaleString()} kg of ${form.cargoType.toLowerCase()}, the modal trade-off favours ${best.mode.toLowerCase()}: ${best.note.toLowerCase()}.`,
    `Closest alternative is ${second.label} (${second.score}/100) — a viable fallback if ${best.mode.toLowerCase()} capacity tightens before booking.`,
  ];

  const costConsiderations = [
    `Estimated all-in cost ≈ €${best.costEur.toLocaleString()} including handling and a value-based security surcharge.`,
    `${second.label} would run ≈ €${second.costEur.toLocaleString()} — a €${Math.abs(best.costEur - second.costEur).toLocaleString()} difference versus the recommendation.`,
    form.cargoValueEur > 50000
      ? "High cargo value: insurance premium scales with mode risk profile; confirm coverage before booking."
      : "Standard liability coverage is sufficient for the declared cargo value.",
  ];

  const speedConsiderations = [
    `Door-to-door estimate: ${best.transitDays} days against your ${form.deliveryWindow.toLowerCase()} window.`,
    best.transitDays <= budget
      ? "The recommended mode clears the delivery window with operational buffer to spare."
      : "The recommended mode is the fastest viable option, but the stated window is tight — consider re-negotiating the ETA.",
    form.urgency === "Critical"
      ? "Critical urgency: pre-book uplift and confirm cut-off times at the origin terminal."
      : "No expedite premium required at the current urgency level.",
  ];

  const operationalRisks = [
    best.mode === "Ocean"
      ? "Port congestion at transhipment hubs can add 1–3 days; monitor berthing windows."
      : best.mode === "Air"
        ? "Uplift capacity on this lane fluctuates weekly; confirm booking 48h ahead."
        : best.mode === "Rail"
          ? "Single-corridor dependency: weather or works can pause movements briefly."
          : "Driver-hours and dock-slot availability drive variance on road legs.",
    form.cargoType === "Pharmaceuticals" || form.cargoType === "Food & Perishables"
      ? "Cold-chain integrity checkpoints must be scheduled at each handover."
      : form.cargoType === "Electronics"
        ? "High-theft-risk profile: use screened, sealed routings with tracked seals."
        : "No special handling flags attached to this cargo profile.",
  ];

  const sustainabilityConsiderations = [
    `Estimated footprint ≈ ${best.co2Kg.toLocaleString()} kg CO₂ for the full consignment.`,
    `Shifting to ${second.mode.toLowerCase()} would change emissions by ${second.co2Kg > best.co2Kg ? "+" : "−"}${Math.abs(best.co2Kg - second.co2Kg).toLocaleString()} kg — weigh against the service requirement.`,
    best.mode === "Air"
      ? "Air freight carries the highest emissions intensity; consolidate where possible to amortise the impact."
      : "Chosen mode sits on the lower-emission side of the network mix; consolidation gains remain available.",
  ];

  const recommendedAction =
    `Book ${best.label.toLowerCase()} on the ${origin} → ${destination} lane, targeting the ${form.deliveryWindow.toLowerCase()} window. ` +
    (best.score - second.score <= 8
      ? `Keep ${second.label.toLowerCase()} as an active fallback and re-validate rates before commitment.`
      : `Proceed with standard booking workflow and confirm documentation at least 24h before the planned handover.`);

  const confidence = Math.min(96, Math.max(62, best.score - Math.round((best.score - second.score) * 0.4) + 6));

  return {
    headline: `${best.label} recommended`,
    recommended: best.mode,
    confidence,
    reasoning,
    costConsiderations,
    speedConsiderations,
    operationalRisks,
    sustainabilityConsiderations,
    recommendedAction,
    options: options.sort((a, b) => b.score - a.score),
    generatedAt: new Date().toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

export const cargoTypes = [
  "General Cargo",
  "Electronics",
  "Pharmaceuticals",
  "Automotive Parts",
  "Food & Perishables",
  "Industrial Equipment",
] as const;

export const urgencies: Urgency[] = ["Standard", "High", "Critical"];
export const businessPriorities: Priority[] = ["Cost Optimisation", "Balanced", "Speed / Service"];
export const deliveryWindows: DeliveryWindow[] = ["Flexible", "Within 7 days", "Within 3 days", "Within 24 hours"];
export const preferredModes: PreferredMode[] = ["No Preference", "Air", "Ocean", "Road", "Rail"];
