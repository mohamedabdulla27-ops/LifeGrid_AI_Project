import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../ui/Icon';
import { Chip, StatusDot } from '../ui/Badges';
import { useApp } from '../../context/AppContext';
import { formatClock, cx } from '../../utils/format';
import { NAV_ITEMS } from '../../data/mockData';

const PAGE_TITLES = Object.fromEntries(NAV_ITEMS.flatMap((g) => g.items.map((i) => [i.to, i.label])));

/** Human-readable page title for the current route. */
export function usePageTitle() {
  const { pathname } = useLocation();
  return PAGE_TITLES[pathname] ?? 'LifeGrid AI';
}

function UserMenu() {
  const { auth, logout, pushToast } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const handleLogout = () => {
    logout();
    pushToast('Signed out securely', 'info');
    navigate('/login', { replace: true });
  };

  const initial = auth?.name?.[0] ?? 'U';

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-3 rounded-xl px-2 py-1.5 text-left transition-all hover:opacity-80"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-alert to-amber font-display text-base font-semibold text-white shadow-glow-red">
          {initial}
        </span>
        <span className="hidden leading-tight sm:block">
          <span className="block text-sm font-semibold text-mint">{auth?.name ?? 'Guest'}</span>
          <span className="block text-xs text-mint-muted">{auth?.role ?? 'Viewer'}</span>
        </span>
        <Icon name="chevronDown" className={cx('hidden h-4 w-4 text-mint-muted transition-transform sm:block', open && 'rotate-180')} />
      </button>

      {open && (
        <div role="menu" className="absolute right-0 top-14 z-50 w-60 animate-slide-in rounded-xl border border-ink-500 bg-ink-900 p-2 shadow-card">
          <div className="border-b border-ink-600 px-3 pb-3 pt-2">
            <p className="text-sm font-semibold text-mint">{auth?.name}</p>
            <p className="truncate text-xs text-mint-muted">{auth?.email}</p>
            <span className="mt-2 inline-block rounded-md border border-signal/40 bg-signal/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-signal">
              {auth?.role}
            </span>
          </div>
          <button
            type="button"
            role="menuitem"
            onClick={() => { setOpen(false); navigate('/settings'); }}
            className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-mint-muted transition-all hover:bg-ink-700 hover:text-mint"
          >
            <Icon name="gear" className="h-4 w-4" /> Settings
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-alert transition-all hover:opacity-80"
          >
            <Icon name="logout" className="h-4 w-4" /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}

/** Sticky header: page title, system pills, live clock, live badge, user menu. */
export default function Topbar({ onOpenMenu }) {
  const { now, fusedScore } = useApp();
  const title = usePageTitle();

  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between gap-4 border-b border-ink-600 bg-ink-950/90 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onOpenMenu}
          className="rounded-lg border border-ink-500 bg-ink-800 p-2 text-mint transition-all hover:opacity-80 md:hidden"
          aria-label="Open navigation"
        >
          <Icon name="menu" className="h-5 w-5" />
        </button>
        <h1 className="truncate font-display text-lg font-semibold text-mint sm:text-xl">{title}</h1>
        <span className="ml-2 hidden rounded-md border border-ink-500 px-2 py-0.5 font-mono text-[10px] text-mint-muted xl:inline">
          THREAT {fusedScore}
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <Chip className="hidden 2xl:inline-flex"><Icon name="chip" className="h-3.5 w-3.5 text-signal" />Edge AI</Chip>
        <Chip className="hidden xl:inline-flex"><Icon name="cloud" className="h-3.5 w-3.5 text-signal" />Cloud</Chip>
        <Chip className="hidden lg:inline-flex"><Icon name="zap" className="h-3.5 w-3.5 text-signal" />Qualcomm Engine</Chip>

        <span className="chip hidden border-ink-500 bg-ink-800 font-mono text-mint-muted md:inline-flex">
          <Icon name="clock" className="h-3.5 w-3.5" />
          {formatClock(now)}
        </span>

        <span className="chip hidden border-signal/30 bg-signal-tint text-signal sm:inline-flex">
          <Icon name="wifi" className="h-3.5 w-3.5" />
          Live
          <StatusDot tone="signal" pulse className="h-1.5 w-1.5" />
        </span>

        <UserMenu />
      </div>
    </header>
  );
}
