import { cx } from '../../utils/format';

/**
 * Pill-style tab group (Floor 0/1/2, Status filters, Severity filters).
 * options: [{ value, label, count? }]
 */
export default function SegmentedTabs({ options, value, onChange, className, ariaLabel }) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cx('inline-flex flex-wrap items-center gap-1 rounded-xl border border-ink-600 bg-ink-850 p-1', className)}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            role="tab"
            aria-selected={active}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cx(
              'rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all duration-200 hover:opacity-80',
              active
                ? 'bg-gradient-to-r from-alert to-alert-soft text-white shadow-glow-red'
                : 'text-mint-muted',
            )}
          >
            {opt.label}
            {typeof opt.count === 'number' && (
              <span className={cx('ml-1.5 font-mono text-xs', active ? 'text-white/80' : 'text-mint-dim')}>{opt.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
