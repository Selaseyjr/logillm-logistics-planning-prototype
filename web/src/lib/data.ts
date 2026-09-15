export type ShipmentStatus = "on-schedule" | "at-risk" | "delivered" | "exception" | "in-transit";

export interface Kpi {
  label: string;
  value: string;
  delta?: string;
  deltaDirection?: "up" | "down";
  deltaGood?: boolean;
  footnote?: string;
  sparkline: number[];
}

export const overviewKpis: Kpi[] = [
  {
    label: "Active Shipments",
    value: "128",
    delta: "+8.4%",
    deltaDirection: "up",
    deltaGood: true,
    sparkline: [96, 102, 99, 108, 112, 110, 118, 121, 128],
  },
  {
    label: "On-Time Delivery",
    value: "94.2%",
    delta: "+1.8 pts",
    deltaDirection: "up",
    deltaGood: true,
    sparkline: [89, 91, 90, 92, 93, 91, 93, 94, 94.2],
  },
  {
    label: "Avg. Lead Time",
    value: "2.4d",
    delta: "−0.3d",
    deltaDirection: "down",
    deltaGood: true,
    sparkline: [2.9, 2.8, 2.9, 2.7, 2.6, 2.7, 2.5, 2.5, 2.4],
  },
  {
    label: "At-Risk Shipments",
    value: "11",
    delta: "−2 vs yesterday",
    deltaDirection: "down",
    deltaGood: true,
    footnote: "Requires attention",
    sparkline: [16, 15, 17, 14, 13, 14, 12, 13, 11],
  },
  {
    label: "Open Exceptions",
    value: "7",
    delta: "3 high priority",
    deltaDirection: "up",
    deltaGood: false,
    footnote: "Requires attention",
    sparkline: [4, 5, 5, 6, 6, 5, 7, 7, 7],
  },
];

export interface Activity {
  id: string;
  origin: string;
  destination: string;
  status: ShipmentStatus;
  statusLabel: string;
  eta: string;
  mode: "air" | "ocean" | "road" | "rail";
}

export const recentActivity: Activity[] = [
  {
    id: "SHP-10482",
    origin: "Frankfurt",
    destination: "Accra",
    status: "in-transit",
    statusLabel: "In Transit · On Schedule",
    eta: "Tomorrow, 14:20",
    mode: "air",
  },
  {
    id: "SHP-10479",
    origin: "Shanghai",
    destination: "Hamburg",
    status: "at-risk",
    statusLabel: "Delivery Risk",
    eta: "Wed, 09:40",
    mode: "ocean",
  },
  {
    id: "SHP-10476",
    origin: "Amsterdam",
    destination: "Frankfurt",
    status: "delivered",
    statusLabel: "Delivered",
    eta: "Completed 11:05",
    mode: "road",
  },
  {
    id: "SHP-10471",
    origin: "Dubai",
    destination: "Accra",
    status: "exception",
    statusLabel: "Exception",
    eta: "Hold — docs review",
    mode: "air",
  },
  {
    id: "SHP-10469",
    origin: "Rotterdam",
    destination: "Kumasi",
    status: "in-transit",
    statusLabel: "In Transit",
    eta: "Fri, 16:45",
    mode: "ocean",
  },
];

export const transportUtilisation = [
  { mode: "Air Freight", value: 78 },
  { mode: "Ocean Freight", value: 64 },
  { mode: "Road Freight", value: 86 },
  { mode: "Rail Freight", value: 52 },
];

export const networkPulse = {
  insight:
    "Overall network performance remains stable. The primary concentration of operational risk is currently within Asia–Europe ocean lanes and selected Africa-bound shipments.",
  priority:
    "Priority: monitor delayed departures and upcoming delivery-window breaches.",
};

export type Severity = "high" | "medium" | "low";

export interface RiskItem {
  id: string;
  origin: string;
  destination: string;
  issue: string;
  severity: Severity;
  detail: string;
  detected: string;
  owner: string;
  category: "documentation" | "capacity" | "weather" | "congestion";
}

export const riskItems: RiskItem[] = [
  {
    id: "SHP-10471",
    origin: "Dubai",
    destination: "Accra",
    issue: "Documentation exception",
    severity: "high",
    detail:
      "Certificate of origin mismatch detected at pre-clearance. Shipment is on hold pending corrected paperwork.",
    detected: "Today, 09:12",
    owner: "Ops · Compliance",
    category: "documentation",
  },
  {
    id: "SHP-10458",
    origin: "Accra",
    destination: "Amsterdam",
    issue: "Capacity constraint",
    severity: "high",
    detail:
      "Booked flight is over capacity for the requested weight. Rebooking onto the next available departure is required.",
    detected: "Today, 08:47",
    owner: "Ops · Air Desk",
    category: "capacity",
  },
  {
    id: "SHP-10479",
    origin: "Shanghai",
    destination: "Hamburg",
    issue: "Port congestion",
    severity: "medium",
    detail:
      "Berthing delays of 18–30 hours reported at transhipment port. Delivery window still achievable with buffer.",
    detected: "Yesterday, 22:30",
    owner: "Ops · Ocean Desk",
    category: "congestion",
  },
  {
    id: "SHP-10465",
    origin: "Singapore",
    destination: "Frankfurt",
    issue: "Weather disruption",
    severity: "medium",
    detail:
      "Storm system along the departure corridor may delay the planned uplift by up to one day.",
    detected: "Yesterday, 17:05",
    owner: "Ops · Control Tower",
    category: "weather",
  },
  {
    id: "SHP-10453",
    origin: "Hamburg",
    destination: "Kumasi",
    issue: "Customs backlog",
    severity: "medium",
    detail:
      "Destination customs is processing with a 1–2 day backlog. No action required yet; monitoring closely.",
    detected: "Today, 07:20",
    owner: "Ops · Customs",
    category: "documentation",
  },
  {
    id: "SHP-10440",
    origin: "Rotterdam",
    destination: "Frankfurt",
    issue: "Dock scheduling conflict",
    severity: "low",
    detail:
      "Delivery dock slot shifted by two hours. Carrier has confirmed the revised slot.",
    detected: "Today, 06:55",
    owner: "Ops · Road Desk",
    category: "congestion",
  },
  {
    id: "SHP-10437",
    origin: "Frankfurt",
    destination: "Accra",
    issue: "X-ray screening queue",
    severity: "low",
    detail:
      "Cargo security screening queue is longer than usual at origin hub. Departure buffer absorbs the delay.",
    detected: "Yesterday, 19:40",
    owner: "Ops · Air Desk",
    category: "congestion",
  },
];

export const riskSummary = [
  { label: "High Priority", value: "2", footnote: "Requires intervention", tone: "danger" as const },
  { label: "Medium Priority", value: "3", footnote: "Monitor closely", tone: "warning" as const },
  { label: "Resolved Today", value: "6", footnote: "+12% vs weekly avg", tone: "success" as const },
];

export const sustainabilityKpis = [
  { label: "Estimated CO₂ / Shipment", value: "186 kg", delta: "−8.4%", good: true },
  { label: "Lower-Emission Modes", value: "42%", delta: "+6.2%", good: true },
  { label: "Route Efficiency", value: "91%", delta: "+3.1%", good: true },
  { label: "Consolidated Loads", value: "68%", delta: "+9.5%", good: true },
];

export const emissionsByMode = [
  { mode: "Ocean", gramsPerTkkm: 16, note: "Baseline-efficient" },
  { mode: "Rail", gramsPerTkkm: 22, note: "Grid-dependent" },
  { mode: "Road", gramsPerTkkm: 62, note: "Electrification plan" },
  { mode: "Air", gramsPerTkkm: 560, note: "Reserved for urgency" },
];

export const fleetMix = [
  { mode: "Ocean", share: 41, color: "#2563eb" },
  { mode: "Air", share: 23, color: "#f59e0b" },
  { mode: "Road", share: 27, color: "#10b981" },
  { mode: "Rail", share: 9, color: "#8b5cf6" },
];

export const sustainabilityInitiatives = [
  {
    title: "Shipment consolidation",
    description: "Group compatible freight to cut per-kg emissions and cost.",
    progress: 68,
    target: "75% by Q4",
  },
  {
    title: "Route utilisation",
    description: "Reduce empty repositioning through backhaul matching.",
    progress: 91,
    target: "Continuous",
  },
  {
    title: "Modal shift",
    description: "Move suitable air freight to ocean/rail where windows allow.",
    progress: 42,
    target: "+8 pts this year",
  },
];

export const sustainabilityDirection =
  "Increase shipment consolidation, improve route utilisation, and selectively shift suitable freight toward lower-emission transport modes without compromising critical delivery requirements.";

export const decisionMetrics = [
  { label: "PLANNING", metric: "Shipments Monitored", value: "128" },
  { label: "RISK", metric: "Shipments Requiring Attention", value: "11" },
  { label: "EXCEPTIONS", metric: "Active Operational Issues", value: "7" },
];

export const decisionWorkflow = [
  { number: "01", stage: "Shipment Data", description: "Input", icon: "package" },
  { number: "02", stage: "Operational Analysis", description: "Processing", icon: "scan" },
  { number: "03", stage: "Risk Assessment", description: "Evaluation", icon: "shield" },
  { number: "04", stage: "Recommendation", description: "Decision Support", icon: "sparkles" },
  { number: "05", stage: "Human Decision", description: "Execution", icon: "user" },
] as const;

export const designPrinciple =
  "LogiLLM is designed as a decision-support layer rather than a replacement for human logistics planners. Recommendations should be reviewed against operational constraints before execution.";

export const systemStatus = "All systems operational";

export const lastUpdated = "Today, 14:32 UTC";
