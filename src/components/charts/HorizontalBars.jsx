import { cx } from '../../utils/format';

/**
 * Labeled horizontal bars on a 0–max axis (e.g. per-gateway uptime).
 * data: [{ label, value }]
 */
export default function HorizontalBars({ data, max = 100, color = '#00E472', ticks = 10, className }) {
  const tickValues = Array.from({ length: ticks + 1 }, (_, i) => (i * max) / ticks);
  return (
    <div className={cx('flex flex-col gap-3', className)}>
      {data.map((d) => {
        const pct = Math.min(100, (d.value / max) * 100);
        return (
          <div key={d.label} className="grid grid-cols-[120px_1fr] items-center gap-3 sm:grid-cols-[150px_1fr]">
            <span className="truncate text-right text-xs text-mint-muted">{d.label}</span>
            <div className="group relative h-4 rounded-sm bg-ink-900">
              <div
                className="h-full rounded-sm transition-all duration-500 group-hover:opacity-80"
                style={{ width: `${pct}%`, background: color, boxShadow: `0 0 12px -2px ${color}99` }}
              />
              <span className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 font-mono text-[10px] text-ink-950 opacity-0 transition-opacity group-hover:opacity-100">
                {d.value}%
              </span>
            </div>
          </div>
        );
      })}
      <div className="ml-[132px] flex justify-between font-mono text-[10px] text-mint-dim sm:ml-[162px]">
        {tickValues.map((t) => (
          <span key={t}>{Math.round(t)}</span>
        ))}
      </div>
    </div>
  );
}
