# LogiLLM Control Tower — Frontend UI Experiment

A modern Next.js rewrite of the original Streamlit `Logistics AI Assistant`, built purely as a
frontend/UX experiment. **All data is mock/static** — no backend, database, auth, or AI calls.

## Stack

- **Next.js 15** (App Router, Turbopack)
- **React 19** + **TypeScript** (strict)
- **Tailwind CSS v4** (theme tokens in `src/app/globals.css`)
- **Framer Motion** — subtle page transitions, staggered lists, animated state changes
- **Lucide** icons

## Run

A portable Node.js runtime is bundled in `.toolchain/node` (Windows x64). With any Node ≥ 20:

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts: `npm run build`, `npm run typecheck`.

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Network overview — KPI cards with sparklines, shipment activity feed, utilisation bars, operational pulse |
| `/planning` | Shipment planning — parameter form, staged "analysis" loading state, ranked mode recommendation with reasoning, cost, speed, risk, and sustainability sections |
| `/risk` | Risk & exceptions — severity summary, animated severity filter chips, exception cards |
| `/sustainability` | Emissions intensity by mode, fleet mode mix, initiative progress |
| `/decision-support` | Decision workflow timeline, human-in-the-loop design principle |

## Mock decision engine

`src/lib/recommendation.ts` deterministically scores Air/Ocean/Road/Rail against the entered
parameters (delivery window, urgency, business priority, cargo profile, weight) and produces a
full recommendation object — same structure the original app obtained from the OpenAI API.

## Design notes

- Inter typeface, tabular numerals for metrics, restrained slate/blue palette
- Dark sidebar navigation (drawer on mobile), sticky topbar, consistent page headers
- Empty, loading (skeletons + staged spinner), and populated states on every view
- Hover elevation on cards, spring-animated segmented controls, animated progress fills
