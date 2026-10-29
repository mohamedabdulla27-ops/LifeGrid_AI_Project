import { cx } from '../../utils/format';

/** Accessible switch. Controlled: pass checked + onChange. */
export default function Toggle({ checked, onChange, label, disabled = false, className }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={cx(
        'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-all duration-200 hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-signal/60 disabled:opacity-40',
        checked ? 'border-signal/60 bg-signal/20' : 'border-ink-500 bg-ink-700',
        className,
      )}
    >
      <span
        className={cx(
          'inline-block h-4 w-4 transform rounded-full transition-all duration-200',
          checked ? 'translate-x-6 bg-signal shadow-glow-green' : 'translate-x-1 bg-mint-dim',
        )}
      />
    </button>
  );
}
