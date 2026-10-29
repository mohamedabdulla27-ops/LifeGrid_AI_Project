import { useApp } from '../../context/AppContext';
import Icon from './Icon';
import { cx } from '../../utils/format';

const TONE = {
  info: 'border-ink-500 text-mint',
  success: 'border-signal/50 text-signal',
  warning: 'border-amber/50 text-amber',
  error: 'border-alert/50 text-alert',
};

/** Floating notification stack, driven by context toasts. */
export default function Toasts() {
  const { toasts, dismissToast } = useApp();
  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[60] flex w-80 max-w-[calc(100vw-2.5rem)] flex-col gap-2" aria-live="polite">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cx(
            'pointer-events-auto flex animate-slide-in items-center justify-between gap-3 rounded-xl border bg-ink-800/95 px-4 py-3 text-sm shadow-card backdrop-blur',
            TONE[t.tone] ?? TONE.info,
          )}
        >
          <span className="font-medium">{t.message}</span>
          <button
            type="button"
            onClick={() => dismissToast(t.id)}
            className="rounded-md p-1 text-mint-muted transition-all hover:opacity-80"
            aria-label="Dismiss notification"
          >
            <Icon name="x" className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
