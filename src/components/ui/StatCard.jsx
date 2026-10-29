import Icon from './Icon';
import { cx } from '../../utils/format';

/**
 * KPI tile: uppercase caption, icon on the right, large display value.
 * tone: 'alert' | 'signal' | 'amber' | 'mint' tints the icon.
 */
export default function StatCard({ label, value, icon, tone = 'mint', hint, onClick, className }) {
  const toneClass = {
    alert: 'text-alert',
    signal: 'text-signal',
    amber: 'text-amber',
    mint: 'text-mint-muted',
  }[tone];

  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={cx(
        'panel flex min-w-0 flex-col gap-4 p-5 text-left transition-all duration-200',
        onClick && 'cursor-pointer hover:opacity-80 active:scale-[0.99]',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="label-caps">{label}</span>
        {icon && <Icon name={icon} className={cx('h-5 w-5 shrink-0', toneClass)} />}
      </div>
      <div className="font-display text-[1.9rem] font-semibold leading-none tracking-tight text-mint">{value}</div>
      {hint && <p className="text-xs text-mint-muted">{hint}</p>}
    </Tag>
  );
}
