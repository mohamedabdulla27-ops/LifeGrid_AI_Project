import { useMemo, useState } from 'react';
import useElementSize from '../../hooks/useElementSize';
import { cx } from '../../utils/format';

/**
 * Responsive area/line chart with gridlines, optional x labels and a hover tooltip.
 * data: [{ label, value }]
 */
export default function AreaChart({
  data,
  height = 240,
  color = '#00E472',
  yMax,
  yStep,
  showAxes = true,
  showLabels = true,
  labelEvery = 1,
  className,
  unit = '',
}) {
  const [ref, { width }] = useElementSize();
  const [hover, setHover] = useState(null);

  const pad = showAxes ? { top: 12, right: 12, bottom: 30, left: 28 } : { top: 4, right: 2, bottom: 2, left: 2 };
  const innerW = Math.max(0, width - pad.left - pad.right);
  const innerH = Math.max(0, height - pad.top - pad.bottom);
  const maxV = yMax ?? Math.max(1, ...data.map((d) => d.value));
  const step = yStep ?? Math.ceil(maxV / 4);
  const ticks = useMemo(() => {
    const t = [];
    for (let v = 0; v <= maxV; v += step) t.push(v);
    if (t[t.length - 1] < maxV) t.push(maxV);
    return t;
  }, [maxV, step]);

  const points = data.map((d, i) => ({
    x: pad.left + (data.length === 1 ? innerW / 2 : (i / (data.length - 1)) * innerW),
    y: pad.top + innerH - (d.value / maxV) * innerH,
    ...d,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const areaPath = points.length
    ? `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${pad.top + innerH} L ${points[0].x.toFixed(1)} ${pad.top + innerH} Z`
    : '';

  const gradId = useMemo(() => `area-${Math.random().toString(36).slice(2, 8)}`, []);
  const active = hover != null ? points[hover] : null;

  const handleMove = (e) => {
    if (!points.length) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    let idx = 0;
    let best = Infinity;
    points.forEach((p, i) => {
      const dist = Math.abs(p.x - x);
      if (dist < best) {
        best = dist;
        idx = i;
      }
    });
    setHover(idx);
  };

  return (
    <div ref={ref} className={cx('relative w-full', className)} style={{ height }}>
      {width > 0 && (
        <svg
          width={width}
          height={height}
          onMouseMove={handleMove}
          onMouseLeave={() => setHover(null)}
          className="block overflow-visible"
          role="img"
          aria-label="Line chart"
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.32" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>

          {showAxes &&
            ticks.map((t) => {
              const y = pad.top + innerH - (t / maxV) * innerH;
              return (
                <g key={t}>
                  <line x1={pad.left} x2={width - pad.right} y1={y} y2={y} stroke="#111A17" strokeWidth="1" />
                  <text x={pad.left - 8} y={y + 4} textAnchor="end" className="fill-mint-dim font-mono" fontSize="11">
                    {t}
                  </text>
                </g>
              );
            })}

          {showAxes && showLabels &&
            points.map((p, i) =>
              i % labelEvery === 0 ? (
                <text key={`${p.label}-${i}`} x={p.x} y={height - 8} textAnchor="middle" className="fill-mint-dim font-mono" fontSize="11">
                  {p.label}
                </text>
              ) : null,
            )}

          {areaPath && <path d={areaPath} fill={`url(#${gradId})`} />}
          {linePath && (
            <path d={linePath} fill="none" stroke={color} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 6px ${color}88)` }} />
          )}

          {active && (
            <g>
              <line x1={active.x} x2={active.x} y1={pad.top} y2={pad.top + innerH} stroke="#1B2722" strokeDasharray="3 4" />
              <circle cx={active.x} cy={active.y} r="5" fill="#050807" stroke={color} strokeWidth="2" />
            </g>
          )}
        </svg>
      )}

      {active && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg border border-ink-500 bg-ink-900/95 px-3 py-1.5 text-xs shadow-card"
          style={{ left: active.x, top: Math.max(0, active.y - 10) }}
        >
          <span className="font-mono text-mint-muted">{active.label}</span>
          <span className="ml-2 font-mono font-semibold text-mint">{active.value}{unit}</span>
        </div>
      )}
    </div>
  );
}
