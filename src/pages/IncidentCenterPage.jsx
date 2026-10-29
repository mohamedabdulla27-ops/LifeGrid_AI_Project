import { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import IncidentRow from '../components/incidents/IncidentRow';
import SegmentedTabs from '../components/ui/SegmentedTabs';
import Icon from '../components/ui/Icon';
import { downloadCsv, cx } from '../utils/format';
import { incidentLocation, sortByPriority } from '../utils/incidents';

const STATUS_TABS = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'acknowledged', label: 'Acknowledged' },
  { value: 'responding', label: 'Responding' },
  { value: 'resolved', label: 'Resolved' },
];

const SEVERITY_TABS = [
  { value: 'all', label: 'All' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

export default function IncidentCenterPage() {
  const { incidents, setIncidentStatus, now, pushToast } = useApp();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [severity, setSeverity] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const counts = useMemo(() => {
    const by = (key) => incidents.filter((i) => i.status === key).length;
    return { all: incidents.length, open: by('open'), acknowledged: by('acknowledged'), responding: by('responding'), resolved: by('resolved') };
  }, [incidents]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sortByPriority(incidents).filter((i) => {
      if (status !== 'all' && i.status !== status) return false;
      if (severity !== 'all' && i.severity !== severity) return false;
      if (!q) return true;
      return i.title.toLowerCase().includes(q) || incidentLocation(i).toLowerCase().includes(q) || i.id.toLowerCase().includes(q);
    });
  }, [incidents, query, status, severity]);

  const handleExport = () => {
    const rows = filtered.map((i) => ({
      id: i.id,
      title: i.title,
      severity: i.severity,
      status: i.status,
      location: incidentLocation(i),
      confidence: i.confidence,
      detected_at: new Date(i.createdAt).toISOString(),
      resolved_at: i.resolvedAt ? new Date(i.resolvedAt).toISOString() : '',
      recommended_action: i.action,
    }));
    if (!rows.length) {
      pushToast('Nothing to export for the current filters', 'warning');
      return;
    }
    downloadCsv(`lifegrid-incidents-${new Date().toISOString().slice(0, 10)}.csv`, rows);
    pushToast(`Exported ${rows.length} incident${rows.length === 1 ? '' : 's'}`, 'success');
  };

  const statusOptions = STATUS_TABS.map((t) => ({ ...t, count: counts[t.value] }));

  return (
    <div className="flex flex-col gap-6">
      {/* Toolbar */}
      <div className="panel flex flex-col gap-4 p-4 sm:p-5 xl:flex-row xl:items-center">
        <label className="relative min-w-[260px] flex-1">
          <span className="sr-only">Search incidents</span>
          <Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mint-dim" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or location…"
            className="w-full rounded-lg border border-ink-500 bg-ink-850 py-2.5 pl-10 pr-4 text-sm text-mint placeholder:text-mint-dim transition-all focus:border-signal/60 focus:outline-none focus:ring-2 focus:ring-signal/30"
          />
        </label>

        <div className="flex flex-wrap items-center gap-3">
          <SegmentedTabs ariaLabel="Filter by status" options={statusOptions} value={status} onChange={setStatus} />
          <SegmentedTabs ariaLabel="Filter by severity" options={SEVERITY_TABS} value={severity} onChange={setSeverity} />
          <button type="button" onClick={handleExport} className="btn-ghost">
            <Icon name="download" className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-mint-muted">
        <span>
          Showing <span className="font-mono text-mint">{filtered.length}</span> of{' '}
          <span className="font-mono text-mint">{incidents.length}</span> incidents
        </span>
        <button
          type="button"
          onClick={() => setExpandedId((id) => (id ? null : filtered[0]?.id ?? null))}
          className="text-sm font-medium text-signal transition-all hover:opacity-80"
        >
          {expandedId ? 'Collapse all' : 'Expand first'}
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="panel flex flex-col items-center gap-3 p-12 text-center">
          <Icon name="inbox" className="h-10 w-10 text-mint-dim" />
          <p className="font-semibold text-mint">No incidents match these filters</p>
          <p className="text-sm text-mint-muted">Try a different status or severity, or clear the search.</p>
          <button
            type="button"
            onClick={() => { setQuery(''); setStatus('all'); setSeverity('all'); }}
            className="btn-ghost mt-2"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <ul className={cx('flex flex-col gap-3')}>
          {filtered.map((incident) => (
            <IncidentRow
              key={incident.id}
              incident={incident}
              now={now}
              expanded={expandedId === incident.id}
              onToggle={() => setExpandedId((id) => (id === incident.id ? null : incident.id))}
              onSetStatus={setIncidentStatus}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
