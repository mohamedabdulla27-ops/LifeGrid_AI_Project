import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SENSORS } from '../data/mockData';
import FacilityMap from '../components/twin/FacilityMap';
import ZoneDetail from '../components/twin/ZoneDetail';
import SegmentedTabs from '../components/ui/SegmentedTabs';
import Panel from '../components/ui/Panel';
import Toggle from '../components/ui/Toggle';

const FLOOR_OPTIONS = [
  { value: 0, label: 'Floor 0' },
  { value: 1, label: 'Floor 1' },
  { value: 2, label: 'Floor 2' },
];

export default function DigitalTwinPage() {
  const { devices, settings, toggleSetting, pingDevice, toggleDeviceOnline } = useApp();
  const [floor, setFloor] = useState(1);
  const [selection, setSelection] = useState(null);

  // Switching floors clears the inspector, since markers and zones are per-floor.
  const changeFloor = (next) => {
    setFloor(next);
    setSelection(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold text-mint">Interactive Facility Map</h2>
          <p className="mt-1 text-mint-muted">Live sensor markers and evacuation-relevant zones</p>
        </div>
        <SegmentedTabs ariaLabel="Select floor" options={FLOOR_OPTIONS} value={floor} onChange={changeFloor} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
        <Panel className="gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 text-xs text-mint-muted">
              <Legend color="#00E472" label="Normal" />
              <Legend color="#FCAE00" label="Elevated" />
              <Legend color="#FC3C18" label="Critical" />
              <Legend color="#5C6E66" label="Offline" />
            </div>
            <label className="flex items-center gap-3 text-sm text-mint-muted">
              Evacuation overlay
              <Toggle checked={settings.evacOverlay} onChange={() => toggleSetting('evacOverlay')} label="Toggle evacuation overlay" />
            </label>
          </div>

          <FacilityMap
            floor={floor}
            devices={devices}
            sensors={SENSORS}
            selection={selection}
            onSelect={(sel) => setSelection((cur) => (cur?.id === sel.id && cur?.type === sel.type ? null : sel))}
            showEvac={settings.evacOverlay}
          />

          <p className="text-xs text-mint-dim">
            Tip: click a marker to inspect its readings{' '}
            <span className="text-mint-muted">({devices.filter((d) => d.floor === floor).length} gateways on this floor)</span>
          </p>
        </Panel>

        <Panel title="Zone Detail" className="min-h-[380px]">
          <ZoneDetail
            selection={selection}
            devices={devices}
            sensors={SENSORS}
            showEvac={settings.evacOverlay}
            onPing={pingDevice}
            onToggleOnline={toggleDeviceOnline}
          />
        </Panel>
      </div>
    </div>
  );
}

function Legend({ color, label }) {
  return (
    <span className="flex items-center gap-2">
      <span className="h-2.5 w-2.5 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
      {label}
    </span>
  );
}
