import { SEVERITY_STYLES } from '../../data/mockData';
import { cx } from '../../utils/format';

/** CRITICAL / HIGH / MEDIUM / LOW severity pill. */
export function SeverityBadge({ severity, className }) {
  const s = SEVERITY_STYLES[severity] ?? SEVERITY_STYLES.low;
  return (
    <span
      className={cx(
        'inline-flex items-center rounded-md border px-2.5 py-1 font-mono text-[11px] font-bold tracking-wide',
        s.text, s.border, s.bg, className,
      )}
    >
      {s.label}
    </span>
  );
}

const STATUS_STYLE = {
  open: 'text-alert border-alert/40 bg-alert/5',
  acknowledged: 'text-amber border-amber/40 bg-amber/5',
  responding: 'text-signal border-signal/40 bg-signal/5',
  resolved: 'text-mint-muted border-ink-500 bg-ink-700',
};

const STATUS_LABEL = {
  open: 'Open',
  acknowledged: 'Acknowledged',
  responding: 'Responding',
  resolved: 'Resolved',
};

/** Incident workflow status pill (Open, Acknowledged, Responding, Resolved). */
export function StatusBadge({ status, className }) {
  return (
    <span
      className={cx(
        'inline-flex items-center rounded-md border px-2.5 py-1 text-[11px] font-semibold',
        STATUS_STYLE[status] ?? STATUS_STYLE.resolved,
        className,
      )}
    >
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}

/** Generic status dot + label used for Online / Offline / Operational. */
export function StatusDot({ tone = 'signal', pulse = false, className }) {
  const color = {
    signal: 'bg-signal shadow-[0_0_8px_rgba(0,228,114,0.9)]',
    alert: 'bg-alert shadow-[0_0_8px_rgba(252,60,24,0.9)]',
    amber: 'bg-amber shadow-[0_0_8px_rgba(252,174,0,0.8)]',
    muted: 'bg-mint-dim',
  }[tone];
  return (
    <span
      className={cx(
        'inline-block h-2 w-2 shrink-0 rounded-full',
        color,
        pulse && 'animate-pulse-dot',
        className,
      )}
    />
  );
}

/** Small "Online"/"Offline" label with the dot. */
export function OnlineBadge({ online, className }) {
  return (
    <span className={cx('inline-flex items-center gap-2 text-sm font-medium', online ? 'text-signal' : 'text-mint-dim', className)}>
      <StatusDot tone={online ? 'signal' : 'muted'} />
      {online ? 'Online' : 'Offline'}
    </span>
  );
}

/** Rounded informational chip (topbar pills, engine status). */
export function Chip({ children, active = true, dot = true, className, as: Tag = 'span', ...rest }) {
  return (
    <Tag
      className={cx(
        'chip border-ink-500 bg-ink-800 text-mint-muted',
        active && 'text-mint',
        className,
      )}
      {...rest}
    >
      {dot && <StatusDot tone="signal" className="h-1.5 w-1.5" />}
      {children}
    </Tag>
  );
}
