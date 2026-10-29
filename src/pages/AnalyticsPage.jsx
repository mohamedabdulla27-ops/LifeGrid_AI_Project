import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import StatCard from '../components/ui/StatCard';
import Panel from '../components/ui/Panel';
import AreaChart from '../components/charts/AreaChart';
import BarChart from '../components/charts/BarChart';
import HorizontalBars from '../components/charts/HorizontalBars';
import Donut from '../components/charts/Donut';
import { THREAT_TREND_HOURS, SEVERITY_STYLES } from '../data/mockData';

const DAY_MS = 86_400_000;

export default function AnalyticsPage() {
  const { incidents, devices, fusedScore, now } = useApp();

  const resolved = incidents.filter((i) => i.status === 'resolved');
  const avgResponse = resolved.length
    ? resolved.reduce((s, i) => s + (i.resolvedAt - i.createdAt) / 60_000, 0) / resolved.length
    : 0;
  const fleetUptime = devices.length ? devices.reduce((s, d) => s + d.uptime, 0) / devices.length : 0;

  /** Incident counts for the last seven calendar days, ending today. */
  const frequency = useMemo(() => {
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    return Array.from({ length: 7 }, (_, idx) => {
      const dayStart = startOfToday.getTime() - (6 - idx) * DAY_MS;
      const dayEnd = dayStart + DAY_MS;
      const label = new Date(dayStart).toLocaleDateString('en-US', { weekday: 'short' });
      const value = incidents.filter((i) => i.createdAt >= dayStart && i.createdAt < dayEnd).length;
      return { label, value };
    });
  }, [incidents, now]);

  // The final 16:00 sample tracks the live fused score.
  const threatData = useMemo(
    () => THREAT_TREND_HOURS.map((p, i, arr) => (i === arr.length - 1 ? { ...p, value: fusedScore } : p)),
    [fusedScore],
  );

  const uptimeData = devices.map((d) => ({ label: d.name, value: d.uptime }));

  const severityData = ['critical', 'high', 'medium', 'low']
    .map((key) => ({
      key,
      label: SEVERITY_STYLES[key].label.toLowerCase(),
      value: incidents.filter((i) => i.severity === key).length,
      color: SEVERITY_STYLES[key].hex,
    }))
    .filter((d) => d.value > 0 || d.key !== 'medium');

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Incidents" value={incidents.length} icon="trendUp" tone="alert" />
        <StatCard label="Resolved" value={resolved.length} icon="shield" tone="signal" />
        <StatCard label="Avg Response Time" value={`${avgResponse.toFixed(1)} min`} icon="clock" tone="amber" />
        <StatCard label="Fleet Uptime" value={`${fleetUptime.toFixed(1)}%`} icon="server" tone="signal" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Incident Frequency" subtitle="Last 7 days">
          <BarChart data={frequency} height={280} color="#FC3C18" yStep={2} highlightMax />
        </Panel>
        <Panel title="Threat Trend" subtitle="Average fused threat score, last 12 hours">
          <AreaChart data={threatData.map((p) => ({ label: p.t, value: p.v }))} height={280} color="#00E472" yStep={4} labelEvery={1} />
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Device Uptime" subtitle="Per-gateway availability">
          <HorizontalBars data={uptimeData} max={100} color="#00E472" ticks={10} />
        </Panel>
        <Panel title="Incidents by Severity" subtitle="Share of all recorded incidents">
          <Donut data={severityData} />
        </Panel>
      </div>
    </div>
  );
}
