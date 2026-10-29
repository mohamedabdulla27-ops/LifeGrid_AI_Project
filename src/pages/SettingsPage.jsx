import { useApp } from '../context/AppContext';
import Panel from '../components/ui/Panel';
import Toggle from '../components/ui/Toggle';
import Icon from '../components/ui/Icon';

const SECTIONS = [
  {
    title: 'Notifications',
    subtitle: 'How operators are alerted when the engine flags an event',
    rows: [
      { key: 'pushAlerts', label: 'Push alerts', desc: 'Show in-app notifications for new incidents.' },
      { key: 'audioAlarm', label: 'Audible alarm', desc: 'Play a tone on the control console for critical events.' },
    ],
  },
  {
    title: 'Automation',
    subtitle: 'Actions taken without operator input',
    rows: [
      { key: 'autoAckLow', label: 'Auto-acknowledge low severity', desc: 'Mark LOW incidents as acknowledged automatically.' },
      { key: 'cloudSync', label: 'Cloud sync', desc: 'Replicate anonymised incident summaries to the cloud.' },
    ],
  },
  {
    title: 'Display',
    subtitle: 'Layout and map preferences',
    rows: [
      { key: 'evacOverlay', label: 'Evacuation overlay', desc: 'Highlight designated evacuation zones on the digital twin.' },
      { key: 'compactTables', label: 'Compact lists', desc: 'Reduce padding in incident and history lists.' },
    ],
  },
];

export default function SettingsPage() {
  const { auth, settings, toggleSetting, resetSettings } = useApp();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold text-mint">Settings</h2>
          <p className="mt-1 text-mint-muted">Operator preferences for this console</p>
        </div>
        <button type="button" onClick={resetSettings} className="btn-ghost self-start sm:self-auto">
          <Icon name="refresh" className="h-4 w-4" />
          Reset to defaults
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-6">
          {SECTIONS.map((section) => (
            <Panel key={section.title} title={section.title} subtitle={section.subtitle}>
              <ul className="divide-y divide-ink-600">
                {section.rows.map((row) => (
                  <li key={row.key} className="flex items-center justify-between gap-6 py-4 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="font-medium text-mint">{row.label}</p>
                      <p className="mt-0.5 text-sm text-mint-muted">{row.desc}</p>
                    </div>
                    <Toggle checked={settings[row.key]} onChange={() => toggleSetting(row.key)} label={row.label} />
                  </li>
                ))}
              </ul>
            </Panel>
          ))}
        </div>

        <div className="flex flex-col gap-6">
          <Panel title="Operator">
            <dl className="flex flex-col gap-4 text-sm">
              <Row label="Name" value={auth?.name} />
              <Row label="Email" value={auth?.email} mono />
              <Row label="Role" value={auth?.role} />
            </dl>
          </Panel>
          <Panel title="Edge AI Engine" subtitle="Read-only runtime information">
            <dl className="flex flex-col gap-4 text-sm">
              <Row label="Runtime" value="Qualcomm Engine" />
              <Row label="Model" value="2.3.1" mono />
              <Row label="Firmware" value="v2.3.1" mono />
              <Row label="Inference" value="NPU · ~2.3 ms" mono />
            </dl>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, mono }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-ink-600 pb-3 last:border-0 last:pb-0">
      <dt className="text-mint-muted">{label}</dt>
      <dd className={mono ? 'truncate font-mono text-mint' : 'truncate text-mint'}>{value}</dd>
    </div>
  );
}
