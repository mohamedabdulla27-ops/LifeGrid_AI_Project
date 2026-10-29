import { NavLink } from 'react-router-dom';
import Icon from '../ui/Icon';
import { StatusDot } from '../ui/Badges';
import { NAV_ITEMS } from '../../data/mockData';
import { cx } from '../../utils/format';

/** Brand mark used in sidebar and login. */
export function BrandMark({ className }) {
  return (
    <div className={cx('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-signal-glow to-signal shadow-glow-green', className)}>
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-ink-950" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="2 12 6 12 8.5 6 12 18 14.5 10 16.5 12 22 12" />
      </svg>
    </div>
  );
}

/**
 * Left navigation. Desktop: collapsible rail. Mobile: slide-in drawer controlled by `open`.
 */
export default function Sidebar({ collapsed, onToggleCollapsed, open, onClose }) {
  return (
    <>
      {/* mobile backdrop */}
      <div
        onClick={onClose}
        className={cx(
          'fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity md:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        aria-hidden="true"
      />
      <aside
        className={cx(
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col p-3 transition-transform duration-300 md:sticky md:top-0 md:z-20 md:h-screen md:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
          collapsed ? 'md:w-[88px]' : 'md:w-64',
        )}
      >
        <div className="flex h-full flex-col rounded-2xl border border-ink-600 bg-ink-900 p-4 shadow-card">
          {/* Brand */}
          <div className={cx('mb-7 flex items-center gap-3 px-1', collapsed && 'md:justify-center')}>
            <BrandMark />
            <div className={cx('min-w-0', collapsed && 'md:hidden')}>
              <p className="font-display text-[17px] font-semibold leading-tight text-mint">LifeGrid AI</p>
              <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-mint-muted">Edge AI Platform</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto" aria-label="Main">
            {NAV_ITEMS.map((group) => (
              <div key={group.group} className="mb-2">
                <p className={cx('label-caps mb-2 px-3 text-[10px]', collapsed && 'md:hidden')}>{group.group}</p>
                <ul className="flex flex-col gap-1">
                  {group.items.map((item) => (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        title={item.label}
                        onClick={onClose}
                        className={({ isActive }) =>
                          cx(
                            'group flex items-center gap-3 rounded-lg border px-3 py-2.5 text-[15px] font-medium transition-all duration-200 hover:opacity-80',
                            collapsed && 'md:justify-center md:px-0',
                            isActive
                              ? 'border-alert/50 bg-alert-tint text-signal shadow-glow-red'
                              : 'border-transparent text-mint-muted hover:text-mint',
                          )
                        }
                      >
                        <Icon name={item.icon} className="h-5 w-5 shrink-0" />
                        <span className={cx(collapsed && 'md:hidden')}>{item.label}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          {/* Engine status + collapse */}
          <div className="mt-4 flex flex-col gap-3">
            <div
              className={cx(
                'flex items-center gap-2.5 rounded-lg border border-signal/25 bg-signal-tint px-3 py-2.5 text-sm text-mint-muted',
                collapsed && 'md:justify-center md:px-0',
              )}
            >
              <StatusDot tone="signal" pulse />
              <span className={cx('truncate', collapsed && 'md:hidden')}>Edge AI Engine Active</span>
            </div>
            <button
              type="button"
              onClick={onToggleCollapsed}
              className="hidden items-center justify-center gap-2 rounded-lg py-2 text-sm text-mint-muted transition-all hover:opacity-80 md:flex"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <Icon name="chevronsLeft" className={cx('h-4 w-4 transition-transform duration-300', collapsed && 'rotate-180')} />
              <span className={cx(collapsed && 'md:hidden')}>Collapse</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
