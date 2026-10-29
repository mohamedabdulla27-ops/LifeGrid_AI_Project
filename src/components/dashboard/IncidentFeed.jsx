import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Panel from '../ui/Panel';
import { SeverityBadge } from '../ui/Badges';
import { describeIncident, sortByPriority } from '../../utils/incidents';
import { timeAgo } from '../../utils/format';

/** Most urgent incidents first, with a "View all" link into the Incident Center. */
export default function IncidentFeed({ limit = 5 }) {
  const { incidents, now } = useApp();
  const items = sortByPriority(incidents).slice(0, limit);

  return (
    <Panel
      title="Incident Feed"
      subtitle="Most recent, highest priority first"
      action={
        <Link to="/incidents" className="text-sm font-semibold text-alert transition-all hover:opacity-80">
          View all
        </Link>
      }
      bodyClassName="max-h-[420px] overflow-y-auto pr-1"
    >
      <ul className="flex flex-col gap-3">
        {items.map((i) => (
          <li key={i.id} className="rounded-xl border border-ink-600 bg-ink-850 p-4 transition-all duration-200 hover:border-ink-500">
            <div className="flex items-center justify-between gap-3">
              <SeverityBadge severity={i.severity} />
              <span className="shrink-0 text-xs text-mint-muted">{timeAgo((now - i.createdAt) / 60_000)}</span>
            </div>
            <p className="mt-3 font-semibold text-mint">{i.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-mint-muted">{describeIncident(i)}</p>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
