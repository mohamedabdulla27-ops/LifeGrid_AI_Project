import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import GaugeRing from '../components/charts/GaugeRing';
import AreaChart from '../components/charts/AreaChart';
import StatCard from '../components/ui/StatCard';
import Panel from '../components/ui/Panel';
import Icon from '../components/ui/Icon';
import LiveSensorFeed from '../components/dashboard/LiveSensorFeed';
import IncidentFeed from '../components/dashboard/IncidentFeed';
import SystemStatusBar from '../components/dashboard/SystemStatusBar';
import { useNavigate } from 'react-router-dom';

export default function MissionControlPage() {
  const { devices, incidents, fusedScore, threatHistory, now } = useApp();
  const navigate = useNavigate();

  const onlineCount = devices.filter((d) => d.online).length;
  const openCount = incidents.filter((i) => i.status === 'open').length;
  const avgThreat = useMemo(() => {
    const online = devices.filter((d) => d.online);
    if (!online.length) return 0;
    return online.reduce((s, d) => s + d.threat, 0) / online.length;
  }, [devices]);

  // Demo NPU latency that drifts between 2.1 and 2.4 ms.
  const npuMs = (2.1 + (Math.floor(now / 2500) % 4) * 0.1).toFixed(1);

  const trendData = threatHistory.map((v, i) => ({ label: String(i), value: v }));

  return (
    <div className="flex flex-col gap-6">
      {/* Row 1: gauge + KPIs */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <Panel className="relative overflow-hidden" bodyClassName="flex flex-col">
          <div className="flex items-center gap-2 text-mint-muted">
            <Icon name="chip" className="h-4 w-4 text-signal" />
            <span className="label-caps text-mint-muted">Qualcomm Edge AI Engine</span>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center py-6">
            <GaugeRing value={fusedScore} size={320} label="Edge AI Fusion Core" status="Watching" />
          </div>

          <p className="mx-auto max-w-md text-center text-sm leading-relaxed text-mint-muted">
            Fused in real time across {devices.length} edge devices — sensor data never leaves the building before a decision is made.
          </p>
        </Panel>

        <div className="grid gap-6">
          <div className="grid grid-cols-2 gap-6">
            <StatCard
              label="Devices Online"
              value={`${onlineCount}/${devices.length}`}
              icon="wifi"
              tone="signal"
              onClick={() => navigate('/devices')}
            />
            <StatCard
              label="Open Incidents"
              value={openCount}
              icon="alarm"
              tone="alert"
              onClick={() => navigate('/incidents')}
            />
            <StatCard label="Avg Threat Score" value={avgThreat.toFixed(1)} icon="flame" tone="amber" />
            <StatCard label="NPU Inference" value={`${npuMs} ms`} icon="zap" tone="alert" />
          </div>

          <Panel
            title="Threat Trend — Live"
            action={<span className="font-mono text-xs text-mint-muted">{threatHistory.length} samples</span>}
            className="flex-1"
          >
            <AreaChart data={trendData} height={150} color="#FC3C18" showAxes={false} />
          </Panel>
        </div>
      </div>

      {/* Row 2: feeds */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <LiveSensorFeed />
        <IncidentFeed />
      </div>

      {/* Row 3: system status */}
      <SystemStatusBar />
    </div>
  );
}
