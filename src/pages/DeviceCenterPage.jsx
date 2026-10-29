import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import GatewayCard from '../components/devices/GatewayCard';
import StatCard from '../components/ui/StatCard';

export default function DeviceCenterPage() {
  const { devices, pingDevice, toggleDeviceOnline } = useApp();

  const summary = useMemo(() => {
    const online = devices.filter((d) => d.online);
    const avgThreat = online.length ? online.reduce((s, d) => s + d.threat, 0) / online.length : 0;
    const lowBattery = devices.filter((d) => d.battery < 20).length;
    return { online: online.length, total: devices.length, avgThreat, lowBattery };
  }, [devices]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold text-mint">Arduino UNO Q Fleet</h2>
          <p className="mt-1 text-mint-muted">{devices.length} gateways deployed across the facility</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Gateways Online" value={`${summary.online}/${summary.total}`} icon="wifi" tone="signal" />
        <StatCard label="Avg Threat" value={summary.avgThreat.toFixed(1)} icon="flame" tone="amber" />
        <StatCard label="Low Battery" value={summary.lowBattery} icon="battery" tone="alert" hint="Below 20% charge" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {devices.map((device) => (
          <GatewayCard
            key={device.id}
            device={device}
            onPing={() => pingDevice(device.id)}
            onToggleOnline={() => toggleDeviceOnline(device.id)}
          />
        ))}
      </div>
    </div>
  );
}
