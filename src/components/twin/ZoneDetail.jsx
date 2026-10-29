import Icon from '../ui/Icon';
import ProgressBar from '../ui/ProgressBar';
import { OnlineBadge } from '../ui/Badges';
import { FLOORS } from '../../data/mockData';
import { cx, timeAgo } from '../../utils/format';
import { markerTone } from './FacilityMap';

/** Right-hand inspector: shows live readings for the selected gateway, sensor or zone. */
export default function ZoneDetail({ selection, devices, sensors, showEvac, onPing, onToggleOnline }) {
  if (!selection) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
        <Icon name="pin" className="h-8 w-8 text-mint-dim" />
        <p className="text-mint-muted">Select a marker on the map to inspect its live readings.</p>
      </div>
    );
  }

  if (selection.type === 'device') {
    const d = devices.find((x) => x.id === selection.id);
    if (!d) return null;
    const tone = markerTone(d);
    const level = !d.online ? 'Offline' : d.threat >= 60 ? 'Critical' : d.threat >= 25 ? 'Elevated' : 'Normal';
    const evac = FLOORS[d.floor].zones.find((z) => z.id === d.zone)?.evac;

    return (
      <div className="flex h-full flex-col gap-5">
        <div>
          <p className="font-mono text-xs text-mint-dim">{d.id}</p>
          <h3 className="mt-1 font-display text-xl font-semibold text-mint">{d.name}</h3>
          <p className="mt-1 text-sm text-mint-muted">{d.room} · Floor {d.floor} · Zone {d.zone}</p>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-ink-600 bg-ink-850 px-4 py-3">
          <OnlineBadge online={d.online} />
          <span className={cx('font-mono text-xs font-bold uppercase tracking-wider', tone.text)}>{level}</span>
        </div>

        <dl className="grid grid-cols-2 gap-3">
          <Reading label="Gas" value={d.online ? `${d.gas} ppm` : '—'} />
          <Reading label="Temperature" value={d.online ? `${d.temp.toFixed(1)}°C` : '—'} />
          <Reading label="Threat" value={d.online ? d.threat : '—'} tone={d.threat >= 60 && d.online ? 'alert' : undefined} />
          <Reading label="Heartbeat" value={timeAgo(d.lastSeenMin)} small />
        </dl>

        <div className="space-y-4">
          <div>
            <div className="mb-2 flex justify-between text-xs text-mint-muted"><span>Battery</span><span className="font-mono text-mint">{d.battery}%</span></div>
            <ProgressBar value={d.battery} tone={d.battery < 20 ? 'alert' : 'signal'} />
          </div>
          <div>
            <div className="mb-2 flex justify-between text-xs text-mint-muted"><span>Signal</span><span className="font-mono text-mint">{d.signal}%</span></div>
            <ProgressBar value={d.signal} tone="signal" />
          </div>
        </div>

        {showEvac && evac && (
          <p className="rounded-lg border border-signal/30 bg-signal-tint p-3 text-xs leading-relaxed text-mint-muted">
            <span className="font-semibold text-signal">Evacuation route active.</span> Keep this zone clear and follow the marked corridor to the nearest exit.
          </p>
        )}

        <div className="mt-auto grid grid-cols-2 gap-2">
          <button type="button" onClick={() => onPing(d.id)} disabled={!d.online} className="btn-ghost">
            <Icon name="refresh" className="h-4 w-4" /> Ping
          </button>
          <button type="button" onClick={() => onToggleOnline(d.id)} className={d.online ? 'btn-ghost' : 'btn-signal'}>
            <Icon name="power" className="h-4 w-4" /> {d.online ? 'Take offline' : 'Bring online'}
          </button>
        </div>
      </div>
    );
  }

  if (selection.type === 'sensor') {
    const s = sensors.find((x) => x.id === selection.id);
    if (!s) return null;
    return (
      <div className="flex h-full flex-col gap-5">
        <div>
          <p className="font-mono text-xs text-mint-dim">{s.id}</p>
          <h3 className="mt-1 font-display text-xl font-semibold text-mint">{s.name}</h3>
          <p className="mt-1 text-sm text-mint-muted">Floor {s.floor} · {s.zone}</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-ink-600 bg-ink-850 px-4 py-3 text-sm text-mint-dim">
          <Icon name="alertTriangle" className="h-4 w-4" />
          Idle sensor — no gateway attached
        </div>
        <p className="text-sm leading-relaxed text-mint-muted">
          Passive infrared sensor on the stairwell landing. Attach it to a gateway in Device Center to stream live readings.
        </p>
      </div>
    );
  }

  // zone
  const [floorStr, zoneId] = selection.id.split('-');
  const floor = Number(floorStr);
  const zone = FLOORS[floor]?.zones.find((z) => z.id === zoneId);
  if (!zone) return null;
  const inZone = devices.filter((d) => d.floor === floor && d.zone === zoneId);
  const alerts = inZone.filter((d) => d.online && d.threat >= 60).length;

  return (
    <div className="flex h-full flex-col gap-5">
      <div>
        <p className="font-mono text-xs text-mint-dim">Floor {floor} · Zone {zoneId}</p>
        <h3 className="mt-1 font-display text-xl font-semibold text-mint">{zone.label}</h3>
      </div>
      <dl className="grid grid-cols-2 gap-3">
        <Reading label="Gateways" value={inZone.length} />
        <Reading label="Critical" value={alerts} tone={alerts ? 'alert' : undefined} />
        <Reading label="Evacuation" value={zone.evac ? 'Designated' : 'Not designated'} small />
      </dl>
      <ul className="flex flex-col gap-2">
        {inZone.length === 0 && <li className="text-sm text-mint-dim">No gateways mapped to this zone.</li>}
        {inZone.map((d) => (
          <li key={d.id} className="flex items-center justify-between rounded-lg border border-ink-600 bg-ink-850 px-3 py-2 text-sm">
            <span className="text-mint">{d.name}</span>
            <OnlineBadge online={d.online} className="text-xs" />
          </li>
        ))}
      </ul>
    </div>
  );
}

function Reading({ label, value, tone, small }) {
  return (
    <div className="rounded-lg border border-ink-600 bg-ink-850 p-3">
      <dt className="text-[10px] uppercase tracking-wider text-mint-dim">{label}</dt>
      <dd className={cx('mt-1 font-mono font-semibold', small ? 'text-sm' : 'text-lg', tone === 'alert' ? 'text-alert' : 'text-mint')}>{value}</dd>
    </div>
  );
}
