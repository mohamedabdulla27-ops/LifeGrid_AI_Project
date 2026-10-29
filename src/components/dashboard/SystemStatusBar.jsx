import { useApp } from '../../context/AppContext';

/** Footer strip: Edge AI status, cloud sync, model version, websocket count. */
export default function SystemStatusBar() {
  const { settings, devices } = useApp();
  const cloud = settings.cloudSync ? 'Operational' : 'Paused';
  const wsConnections = devices.filter((d) => d.online).length > 0 ? 1 : 0;

  const items = [
    { label: 'Edge AI Status', value: 'Operational', tone: 'signal' },
    { label: 'Cloud Sync', value: cloud, tone: settings.cloudSync ? 'signal' : 'amber' },
    { label: 'Model', value: '2.3.1', tone: 'mint' },
    { label: 'WS Connections', value: wsConnections, tone: 'mint' },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((it) => (
        <div key={it.label} className="panel flex items-center justify-between gap-3 px-5 py-4">
          <span className="text-sm text-mint-muted">{it.label}</span>
          <span
            className={
              it.tone === 'signal'
                ? 'flex items-center gap-2 font-mono text-sm font-semibold text-signal'
                : it.tone === 'amber'
                  ? 'font-mono text-sm font-semibold text-amber'
                  : 'font-mono text-sm font-semibold text-mint'
            }
          >
            {it.tone === 'signal' && <span className="h-2 w-2 rounded-full bg-signal shadow-[0_0_8px_rgba(0,228,114,0.9)]" />}
            {it.value}
          </span>
        </div>
      ))}
    </div>
  );
}
