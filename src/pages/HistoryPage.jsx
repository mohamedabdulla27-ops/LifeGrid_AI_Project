import { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import Icon from '../components/ui/Icon';
import { SeverityBadge, StatusBadge } from '../components/ui/Badges';
import { DEVICE_BY_ID, describeIncident, incidentLocation } from '../utils/incidents';
import { cx, formatStamp } from '../utils/format';
import { SEVERITY_STYLES } from '../data/mockData';

export default function HistoryPage() {
  const { incidents } = useApp();
  const [query, setQuery] = useState('');
  const [newestFirst, setNewestFirst] = useState(true);
  const [openId, setOpenId] = useState(null);

  const entries = useMemo(() => {
    const q = query.trim().toLowerCase();
    return incidents
      .filter((i) => !q || i.title.toLowerCase().includes(q) || incidentLocation(i).toLowerCase().includes(q) || i.action.toLowerCase().includes(q))
      .sort((a, b) => (newestFirst ? b.createdAt - a.createdAt : a.createdAt - b.createdAt));
  }, [incidents, query, newestFirst]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl font-semibold text-mint">Incident &amp; Decision History</h2>
        <p className="mt-1 text-mint-muted">Full replay timeline of AI-flagged events across the facility</p>
      </div>

      <div className="panel flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Search history</span>
          <Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mint-dim" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search history…"
            className="w-full rounded-lg border border-ink-500 bg-ink-850 py-2.5 pl-10 pr-4 text-sm text-mint placeholder:text-mint-dim transition-all focus:border-signal/60 focus:outline-none focus:ring-2 focus:ring-signal/30"
          />
        </label>
        <button type="button" onClick={() => setNewestFirst((n) => !n)} className="btn-ghost shrink-0">
          <Icon name="sliders" className="h-4 w-4" />
          {newestFirst ? 'Newest first' : 'Oldest first'}
        </button>
      </div>

      <div className="panel p-5 sm:p-7">
        {entries.length === 0 ? (
          <p className="py-10 text-center text-mint-muted">No history entries match “{query}”.</p>
        ) : (
          <ol className="relative flex flex-col">
            {entries.map((entry, idx) => {
              const isOpen = openId === entry.id;
              const color = SEVERITY_STYLES[entry.severity].hex;
              const device = DEVICE_BY_ID[entry.device];
              return (
                <li key={entry.id} className="relative flex gap-5 pb-8 last:pb-0">
                  {idx < entries.length - 1 && (
                    <span className="absolute left-[7px] top-5 h-full w-px bg-gradient-to-b from-ink-500 to-transparent" aria-hidden="true" />
                  )}
                  <span
                    className="relative mt-1.5 h-4 w-4 shrink-0 rounded-full border-2 border-ink-950"
                    style={{ background: color, boxShadow: `0 0 10px ${color}99` }}
                    aria-hidden="true"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                      <time className="font-mono text-xs text-mint-muted">{formatStamp(entry.createdAt)}</time>
                      <SeverityBadge severity={entry.severity} />
                      <StatusBadge status={entry.status} />
                    </div>

                    <button
                      type="button"
                      onClick={() => setOpenId(isOpen ? null : entry.id)}
                      aria-expanded={isOpen}
                      className="mt-2 flex w-full items-start justify-between gap-3 text-left transition-all hover:opacity-80"
                    >
                      <span>
                        <span className="block font-semibold text-mint">{entry.title}</span>
                        <span className="mt-1 block text-sm text-mint-muted">
                          {incidentLocation(entry)} · {entry.confidence}% AI confidence · {entry.action}
                        </span>
                      </span>
                      <Icon name="chevronDown" className={cx('mt-1 h-4 w-4 shrink-0 text-mint-dim transition-transform', isOpen && 'rotate-180')} />
                    </button>

                    {isOpen && (
                      <div className="mt-3 grid animate-slide-in gap-3 rounded-xl border border-ink-600 bg-ink-850 p-4 text-sm sm:grid-cols-2">
                        <Detail label="Description" value={describeIncident(entry)} wide />
                        <Detail label="Gateway" value={`${device?.name} (${device?.id})`} />
                        <Detail label="Incident ID" value={entry.id} mono />
                        <Detail label="Decision" value={entry.action} wide />
                        <Detail label="Resolved at" value={entry.resolvedAt ? formatStamp(entry.resolvedAt) : 'Not yet resolved'} mono />
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}

function Detail({ label, value, mono, wide }) {
  return (
    <div className={cx(wide && 'sm:col-span-2')}>
      <p className="label-caps mb-1 text-[10px]">{label}</p>
      <p className={cx('text-mint', mono && 'font-mono text-xs')}>{value}</p>
    </div>
  );
}
