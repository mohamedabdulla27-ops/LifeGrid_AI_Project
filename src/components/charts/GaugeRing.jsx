import { useMemo } from 'react';
import { cx } from '../../utils/format';

/**
 * Circular fused-threat gauge. The arc sweeps clockwise from 12 o'clock
 * proportionally to value / max, with tick marks around the rim.
 */
export default function GaugeRing({ value, max = 100, size = 300, label = 'Threat score', status = 'Watching', className }) {
  const cx0 = size / 2;
  const r = size / 2 - 34;
  const ticks = 60;
  const sweep = Math.min(1, Math.max(0, value / max));
  const lit = Math.round(sweep * ticks);

  const arcPath = useMemo(() => {
    if (sweep <= 0) return '';
    const angle = sweep * 360;
    const end = angle >= 359.99 ? 359.99 : angle;
    const rad = (a) => ((a - 90) * Math.PI) / 180;
    const x1 = cx0 + r * Math.cos(rad(0));
    const y1 = cx0 + r * Math.sin(rad(0));
    const x2 = cx0 + r * Math.cos(rad(end));
    const y2 = cx0 + r * Math.sin(rad(end));
    const large = end > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  }, [sweep, cx0, r]);

  return (
    <div className={cx('relative mx-auto aspect-square', className)} style={{ width: size, maxWidth: '100%' }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full overflow-visible" role="img" aria-label={`${label} ${value} of ${max}`}>
        <defs>
          <linearGradient id="gaugeStroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00FC9C" />
            <stop offset="100%" stopColor="#00E472" />
          </linearGradient>
          <filter id="gaugeGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* tick ring */}
        {Array.from({ length: ticks }).map((_, i) => {
          const a = (i / ticks) * 360;
          const rad = ((a - 90) * Math.PI) / 180;
          const inner = r + 14;
          const outer = r + (i % 5 === 0 ? 24 : 20);
          const on = i < lit;
          return (
            <line
              key={i}
              x1={cx0 + inner * Math.cos(rad)}
              y1={cx0 + inner * Math.sin(rad)}
              x2={cx0 + outer * Math.cos(rad)}
              y2={cx0 + outer * Math.sin(rad)}
              stroke={on ? '#00E472' : '#1B2722'}
              strokeWidth={i % 5 === 0 ? 2 : 1.4}
              strokeLinecap="round"
              opacity={on ? 0.95 : 1}
            />
          );
        })}

        {/* track */}
        <circle cx={cx0} cy={cx0} r={r} fill="none" stroke="#111A17" strokeWidth="14" />
        {/* value arc */}
        {arcPath && (
          <path d={arcPath} fill="none" stroke="url(#gaugeStroke)" strokeWidth="14" strokeLinecap="round" filter="url(#gaugeGlow)" />
        )}
        {/* inner ring */}
        <circle cx={cx0} cy={cx0} r={r - 34} fill="#050807" stroke="#111A17" strokeWidth="1" />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-mint-muted">{label}</span>
        <span className="mt-2 font-mono text-6xl font-bold leading-none text-signal drop-shadow-[0_0_14px_rgba(0,228,114,0.55)] transition-all duration-500">
          {value}
        </span>
        <span className="mt-3 rounded-md border border-signal/40 bg-signal/10 px-2.5 py-0.5 font-mono text-[10px] font-bold tracking-widest text-signal">
          {status.toUpperCase()}
        </span>
      </div>
    </div>
  );
}
