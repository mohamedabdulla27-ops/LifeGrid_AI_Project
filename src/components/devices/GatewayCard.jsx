import Icon from '../ui/Icon';
import ProgressBar, { SignalBars } from '../ui/ProgressBar';
import Toggle from '../ui/Toggle';
import { OnlineBadge } from '../ui/Badges';
import { cx, timeAgo } from '../../utils/format';

const HIGH_THREAT = 60;

/** Gateway status card: location, battery, signal, live readings and actions. */
export default function GatewayCard({ device, onPing, onToggleOnline }) {
  const { id, name, room, floor, zone, firmware, battery, signal, gas, temp, threat, online, lastSeenMin } = device;
  const danger = threat >= HIGH_THREAT && online;
  const stale = online && lastSeenMin > 24 * 60;

  return (
    <article
      className={cx(
        'panel flex flex-col gap-5 p-5 transition-all duration-200 hover:border-ink-500',
        danger && 'border-alert/60 shadow-glow-red',
        !online && 'opacity-80',
      )}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className={cx('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border', online ? 'border-signal/30 bg-signal-tint text-signal' : 'border-ink-500 bg-ink-700 text-mint-dim')}>
            <Icon name="chip" className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h3 className="truncate font-display text-lg font-semibold text-mint">{name}</h3>
            <p className="font-mono text-xs text-mint-dim">{id}</p>
          </div>
        </div>
        <OnlineBadge online={online} />
      </header>

      <p className="-mt-2 text-sm text-mint-muted">
        {room} · Floor {floor} · Zone {zone}
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <div className="mb-2 flex items-center justify-between text-xs text-mint-muted">
            <span className="flex items-center gap-1.5"><Icon name="battery" className="h-3.5 w-3.5" />Battery</span>
            <span className={cx('font-mono', battery < 20 ? 'text-alert' : 'text-mint')}>{battery}%</span>
          </div>
          <ProgressBar value={battery} tone={battery < 20 ? 'alert' : 'signal'} />
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between text-xs text-mint-muted">
            <span className="flex items-center gap-1.5"><Icon name="wifi" className="h-3.5 w-3.5" />Signal</span>
            <span className="flex items-center gap-2 font-mono text-mint">
              {signal}%
              <SignalBars percent={signal} />
            </span>
          </div>
          <ProgressBar value={signal} tone="signal" />
        </div>
      </div>

      {online ? (
        <div className="grid grid-cols-3 gap-3 rounded-xl border border-ink-600 bg-ink-850 p-4 font-mono text-sm">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-mint-dim">Gas</p>
            <p className="mt-1 font-semibold text-mint">{gas} <span className="text-xs text-mint-muted">ppm</span></p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-mint-dim">Temp</p>
            <p className="mt-1 font-semibold text-mint">{temp.toFixed(1)}°</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-mint-dim">Threat</p>
            <p className={cx('mt-1 font-semibold', danger ? 'text-alert' : 'text-mint')}>{threat}</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-xl border border-dashed border-ink-500 p-4 text-sm text-mint-dim">
          <Icon name="alertTriangle" className="h-4 w-4" />
          No telemetry while offline
        </div>
      )}

      <footer className="mt-auto flex flex-col gap-4 border-t border-ink-600 pt-4">
        <div className="flex items-center justify-between text-xs text-mint-muted">
          <span className="font-mono">Firmware {firmware}</span>
          <span className={cx(stale && 'text-amber')}>
            Heartbeat {timeAgo(lastSeenMin)}
            {stale && ' · stale'}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <button type="button" onClick={onPing} disabled={!online} className="btn-ghost px-3 py-1.5 text-xs">
            <Icon name="refresh" className="h-3.5 w-3.5" />
            Ping
          </button>
          <label className="flex items-center gap-2.5 text-xs text-mint-muted">
            {online ? 'Online' : 'Offline'}
            <Toggle checked={online} onChange={onToggleOnline} label={`Toggle ${name} online`} />
          </label>
        </div>
      </footer>
    </article>
  );
}
