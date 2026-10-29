import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OnlineBadge } from '../ui/Badges';
import Icon from '../ui/Icon';
import Panel from '../ui/Panel';
import { cx } from '../../utils/format';

const HIGH_THREAT = 60;

/**
 * Fused telemetry tiles for every gateway. Clicking a tile toggles its selection.
 * Tiles above HIGH_THREAT get the red danger outline, matching the mockup.
 */
export default function LiveSensorFeed() {
  const { devices } = useApp();
  const [selected, setSelected] = useState(null);

  return (
    <Panel
      title="Live Sensor Feed"
      subtitle="Fused telemetry from every connected gateway"
      action={<span className="chip border-ink-500 bg-ink-800 text-mint-muted">{devices.filter((d) => d.online).length} live</span>}
      bodyClassName="max-h-[420px] overflow-y-auto pr-1"
    >
      <ul className="grid gap-3 sm:grid-cols-2">
        {devices.map((d) => {
          const danger = d.threat >= HIGH_THREAT;
          const isSelected = selected === d.id;
          return (
            <li key={d.id}>
              <button
                type="button"
                onClick={() => setSelected(isSelected ? null : d.id)}
                aria-pressed={isSelected}
                className={cx(
                  'w-full rounded-xl border bg-ink-850 p-4 text-left transition-all duration-200 hover:opacity-80',
                  danger ? 'border-alert/60 shadow-glow-red' : 'border-ink-600',
                  isSelected && 'ring-1 ring-signal/60',
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-mint">{d.name}</p>
                    <p className="truncate text-xs text-mint-muted">{d.room}</p>
                  </div>
                  <OnlineBadge online={d.online} className="shrink-0 text-xs" />
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 font-mono text-sm">
                  <Metric icon="droplet" label="Gas" value={`${d.gas} ppm`} />
                  <Metric icon="thermometer" label="Temp" value={`${d.temp.toFixed(1)}°C`} />
                  <Metric icon="flame" label="Threat" value={d.threat} tone={danger ? 'alert' : 'mint'} />
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs text-mint-muted">
                  <Icon name="battery" className="h-3.5 w-3.5" />
                  <span className="font-mono">{d.battery}%</span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

function Metric({ icon, label, value, tone = 'mint' }) {
  return (
    <div className="min-w-0">
      <p className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-mint-dim">
        <Icon name={icon} className="h-3 w-3" />
        {label}
      </p>
      <p className={cx('mt-1 truncate font-semibold', tone === 'alert' ? 'text-alert' : 'text-mint')}>{value}</p>
    </div>
  );
}
