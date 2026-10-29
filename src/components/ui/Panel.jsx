import { cx } from '../../utils/format';

/** Standard dark card surface with optional header (title, subtitle, action slot). */
export default function Panel({ title, subtitle, action, children, className, bodyClassName, danger = false, as: Tag = 'section' }) {
  return (
    <Tag
      className={cx(
        'panel flex min-w-0 flex-col p-5 sm:p-6',
        danger && 'border-alert/50 shadow-glow-red',
        className,
      )}
    >
      {(title || action) && (
        <header className="mb-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            {title && <h2 className="font-display text-lg font-semibold text-mint">{title}</h2>}
            {subtitle && <p className="mt-1 text-sm text-mint-muted">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      <div className={cx('min-h-0 flex-1', bodyClassName)}>{children}</div>
    </Tag>
  );
}
