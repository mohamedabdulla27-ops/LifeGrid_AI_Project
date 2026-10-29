import { cx } from '../../utils/format';

/** Thin meter used for battery and per-gateway uptime. */
export default function ProgressBar({ value, tone = 'alert', className }) {
  const bar = {
    alert: 'bg-alert',
    signal: 'bg-signal',
    amber: 'bg-amber',
  }[tone];
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={cx('h-1.5 w-full overflow-hidden rounded-full bg-ink-600', className)} role="meter" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <div className={cx('h-full rounded-full transition-all duration-500', bar)} style={{ width: `${pct}%` }} />
    </div>
  );
}

/** Five-bar signal strength indicator. */
export function SignalBars({ percent }) {
  const bars = [20, 40, 60, 80, 100];
  return (
    <div className="flex items-end gap-0.5" aria-label={`Signal ${percent}%`}>
      {bars.map((b) => (
        <span
          key={b}
          className={cx('w-1 rounded-sm', percent >= b ? 'bg-signal' : 'bg-ink-500')}
          style={{ height: `${4 + b / 8}px` }}
        />
      ))}
    </div>
  );
}
