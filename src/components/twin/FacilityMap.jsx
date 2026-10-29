import { cx } from '../../utils/format';
import { FLOORS } from '../../data/mockData';

/** Colour for a marker, derived from gateway state. */
export function markerTone(device) {
  if (!device.online) return { dot: 'bg-ink-500', ring: 'border-ink-500', text: 'text-mint-dim', hex: '#5C6E66' };
  if (device.threat >= 60) return { dot: 'bg-alert', ring: 'border-alert', text: 'text-alert', hex: '#FC3C18' };
  if (device.threat >= 25) return { dot: 'bg-amber', ring: 'border-amber', text: 'text-amber', hex: '#FCAE00' };
  return { dot: 'bg-signal', ring: 'border-signal', text: 'text-signal', hex: '#00E472' };
}

/**
 * Schematic floor plan. Gateways and sensors are absolutely positioned using
 * percentage coordinates so the map scales with its container.
 */
export default function FacilityMap({ floor, devices, sensors, selection, onSelect, showEvac }) {
  const plan = FLOORS[floor];
  const floorDevices = devices.filter((d) => d.floor === floor);
  const floorSensors = sensors.filter((s) => s.floor === floor);

  return (
    <div className="grid-bg relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-ink-600 bg-ink-900">
      {/* Building outline */}
      <div className="absolute inset-[4%] rounded-lg border border-dashed border-ink-500" />

      {/* Zones */}
      {plan.zones.map((z) => {
        const selected = selection?.type === 'zone' && selection.id === `${floor}-${z.id}`;
        const evac = showEvac && z.evac;
        return (
          <button
            key={`${floor}-${z.id}`}
            type="button"
            onClick={() => onSelect({ type: 'zone', id: `${floor}-${z.id}` })}
            aria-label={`Zone ${z.label}`}
            className={cx(
              'absolute rounded-lg border border-dashed p-3 text-left transition-all duration-200 hover:opacity-80',
              evac ? 'border-signal/40 bg-signal/[0.04]' : 'border-ink-500 bg-ink-850/40',
              selected && 'border-signal/70 bg-signal/[0.08]',
            )}
            style={{ left: `${z.x}%`, top: `${z.y}%`, width: `${z.w}%`, height: `${z.h}%` }}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-mint-dim">{z.label}</span>
            {evac && (
              <span className="ml-2 rounded border border-signal/40 px-1 font-mono text-[9px] font-bold text-signal">EVAC</span>
            )}
          </button>
        );
      })}

      {/* Sensors (idle, non-gateway) */}
      {floorSensors.map((s) => {
        const selected = selection?.type === 'sensor' && selection.id === s.id;
        return (
          <Marker
            key={s.id}
            x={s.marker.x}
            y={s.marker.y}
            label={s.name}
            selected={selected}
            tone={{ dot: 'bg-ink-500', ring: 'border-ink-500', text: 'text-mint-dim' }}
            onClick={() => onSelect({ type: 'sensor', id: s.id })}
            pulse={false}
          />
        );
      })}

      {/* Gateways */}
      {floorDevices.map((d) => {
        const tone = markerTone(d);
        const selected = selection?.type === 'device' && selection.id === d.id;
        return (
          <Marker
            key={d.id}
            x={d.marker.x}
            y={d.marker.y}
            label={d.short}
            selected={selected}
            tone={tone}
            onClick={() => onSelect({ type: 'device', id: d.id })}
            pulse={d.online}
          />
        );
      })}

      {floorDevices.length === 0 && floorSensors.length === 0 && (
        <p className="absolute inset-0 flex items-center justify-center text-sm text-mint-dim">No sensors on this floor</p>
      )}
    </div>
  );
}

function Marker({ x, y, label, selected, tone, onClick, pulse }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Marker ${label}`}
      aria-pressed={selected}
      className="group absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5 transition-all duration-200"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <span className="relative flex h-5 w-5 items-center justify-center">
        {pulse && <span className={cx('absolute inline-flex h-full w-full animate-ping rounded-full opacity-40', tone.dot)} />}
        <span
          className={cx(
            'relative h-3.5 w-3.5 rounded-full border-2 border-ink-950 transition-transform duration-200',
            tone.dot,
            selected ? 'scale-150 ring-4 ring-white/10' : 'group-hover:scale-125',
          )}
        />
      </span>
      <span className={cx('whitespace-nowrap rounded-md bg-ink-950/80 px-1.5 py-0.5 font-mono text-[10px]', selected ? 'text-mint' : tone.text)}>
        {label}
      </span>
    </button>
  );
}
