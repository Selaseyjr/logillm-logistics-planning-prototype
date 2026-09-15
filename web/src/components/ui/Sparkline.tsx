export function Sparkline({
  points,
  className,
}: {
  points: number[];
  className?: string;
}) {
  const w = 100;
  const h = 32;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const pad = 3;

  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * (w - pad * 2) + pad;
    const y = h - pad - ((p - min) / range) * (h - pad * 2);
    return [x, y] as const;
  });

  const line = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${coords[coords.length - 1][0].toFixed(1)},${h} L${coords[0][0].toFixed(1)},${h} Z`;
  const last = coords[coords.length - 1];

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} preserveAspectRatio="none" aria-hidden>
      <path d={area} fill="currentColor" opacity={0.08} />
      <path d={line} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r={2.5} fill="currentColor" />
    </svg>
  );
}
