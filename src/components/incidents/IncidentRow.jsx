import Icon from '../ui/Icon';
import ProgressBar from '../ui/ProgressBar';
import { SeverityBadge, StatusBadge } from '../ui/Badges';
import { DEVICE_BY_ID, describeIncident, incidentLocation } from '../../utils/incidents';
import { cx, formatStamp, timeAgo } from '../../utils/format';

/**
 * One incident in the Incident Center list.
 * Collapsed: severity, status, title, location, confidence, age.
 * Expanded: detail, recommended action, timestamps and workflow buttons.
 */
export default function IncidentRow({ incident, expanded, onToggle, onSetStatus, now }) {
  const device = DEVICE_BY_ID[incident.device];
  const isCritical = incident.severity === 'critical';
  const ageMin = (now - incident.createdAt) / 60_000;

  const actions = [];
  if (incident.status === 'open') {
    actions.push({ label: 'Acknowledge', status: 'acknowledged', tone: 'ghost' });
    actions.push({ label: 'Mark Responding', status: 'responding', tone: 'signal' });
  } else if (incident.status === 'acknowledged') {
    actions.push({ label: 'Mark Responding', status: 'responding', tone: 'signal' });
  }
  if (incident.status !== 'resolved') {
    actions.push({ label: 'Resolve', status: 'resolved', tone: 'primary' });
  } else {
    actions.push({ label: 'Reopen', status: 'open', tone: 'ghost' });
  }

  const btnClass = { ghost: 'btn-ghost', signal: 'btn-signal', primary: 'btn-primary' };

  return (
    <li
      className={cx(
        'panel overflow-hidden transition-all duration-200',
        isCritical && incident.status !== 'resolved' && 'border-alert/50',
        expanded && 'border-ink-500',
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="flex w-full items-start justify-between gap-4 p-5 text-left transition-all duration-200 hover:opacity-80"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <SeverityBadge severity={incident.severity} />
            <StatusBadge status={incident.status} />
          </div>
          <p className="mt-3 font-display text-base font-semibold text-mint sm:text-lg">{incident.title}</p>
          <p className="mt-1 text-sm text-mint-muted">
            {incidentLocation(incident)} · {incident.confidence}% confidence
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-3">
          <span className="whitespace-nowrap text-sm text-mint-muted">{timeAgo(ageMin)}</span>
          <Icon name="chevronDown" className={cx('h-4 w-4 text-mint-dim transition-transform duration-200', expanded && 'rotate-180')} />
        </div>
      </button>

      {expanded && (
        <div className="animate-slide-in border-t border-ink-600 bg-ink-850/60 p-5">
          <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
            <div className="flex flex-col gap-4">
              <div>
                <p className="label-caps mb-2">Summary</p>
                <p className="text-sm leading-relaxed text-mint">{describeIncident(incident)}</p>
              </div>
              <div>
                <p className="label-caps mb-2">Recommended action</p>
                <p className="rounded-lg border border-ink-500 bg-ink-900 p-3 text-sm leading-relaxed text-mint-muted">{incident.action}</p>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-xs text-mint-muted">
                  <span>AI confidence</span>
                  <span className="font-mono text-mint">{incident.confidence}%</span>
                </div>
                <ProgressBar value={incident.confidence} tone={incident.confidence >= 85 ? 'alert' : 'amber'} />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <dt className="text-mint-muted">Gateway</dt>
                <dd className="text-right font-mono text-mint">{device?.id}</dd>
                <dt className="text-mint-muted">Detected</dt>
                <dd className="text-right font-mono text-xs text-mint">{formatStamp(incident.createdAt)}</dd>
                <dt className="text-mint-muted">Resolved</dt>
                <dd className="text-right font-mono text-xs text-mint">
                  {incident.resolvedAt ? formatStamp(incident.resolvedAt) : '—'}
                </dd>
                <dt className="text-mint-muted">Incident ID</dt>
                <dd className="text-right font-mono text-mint">{incident.id}</dd>
              </dl>

              <div className="mt-auto flex flex-wrap gap-2 pt-2">
                {actions.map((a) => (
                  <button
                    key={a.label}
                    type="button"
                    onClick={() => onSetStatus(incident.id, a.status)}
                    className={btnClass[a.tone]}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </li>
  );
}
