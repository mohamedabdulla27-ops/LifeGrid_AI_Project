import { useState } from 'react';
import { cx } from '../../utils/format';

/**
 * Donut chart with hover emphasis and clickable legend.
 * data: [{ key, label, value, color }]
 */
export default function Donut({ data, size = 220, thickness = 44, className }) {
  const [active, setActive] = useState(null);
  const [hidden, setHidden] = useState({});
  const visible = data.map((d) => ({ ...d, value: hidden[d.key] ? 0 : d.value }));
  const total = visible.reduce((s, d) => s + d.value, 0) || 1;
  const r = size / 2 - thickness / 2;
  const c = 2 * Math.PI * r;

  let offset = 0;
  const segments = visible.map((d) => {
    const len = (d.value / total) * c;
    const seg = { ...d, dash: `${len} ${c - len}`, offset: -offset };
    offset += len;
    return seg;
  });

  const focus = active ? data.find((d) => d.key === active) : null;
  const shown = focus ? focus.value : data.reduce((s, d) => s + d.value, 0);

  return (
    <div className={cx('flex flex-col items-center gap-6 sm:flex-row sm:justify-center', className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" role="img" aria-label="Incidents by severity">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#111A17" strokeWidth={thickness} />
          {segments.map((s) =>
            s.value > 0 ? (
              <circle
                key={s.key}
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={s.color}
                strokeWidth={active === s.key ? thickness + 6 : thickness}
                strokeDasharray={s.dash}
                strokeDashoffset={s.offset}
                className="cursor-pointer transition-all duration-300"
                opacity={active && active !== s.key ? 0.35 : 1}
                onMouseEnter={() => setActive(s.key)}
                onMouseLeave={() => setActive(null)}
              />
            ) : null,
          )}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-3xl font-semibold text-mint">{shown}</span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-mint-muted">
            {focus ? focus.label : 'Total'}
          </span>
        </div>
      </div>

      <ul className="flex flex-wrap justify-center gap-2 sm:flex-col sm:justify-start">
        {data.map((d) => {
          const off = !!hidden[d.key];
          return (
            <li key={d.key}>
              <button
                type="button"
                onClick={() => setHidden((h) => ({ ...h, [d.key]: !h[d.key] }))}
                onMouseEnter={() => setActive(d.key)}
                onMouseLeave={() => setActive(null)}
                className={cx(
                  'flex items-center gap-2.5 rounded-lg border border-ink-600 bg-ink-850 px-3 py-1.5 text-sm transition-all duration-200 hover:opacity-80',
                  off ? 'text-mint-dim line-through' : 'text-mint-muted',
                )}
                aria-pressed={!off}
              >
                <span className="h-2.5 w-2.5 rounded-sm" style={{ background: d.color }} />
                <span className="capitalize">{d.label}</span>
                <span className="font-mono text-mint">{d.value}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
