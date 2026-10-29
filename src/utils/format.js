/** Join class names, skipping falsy values. */
export function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/** "just now", "12 min ago", "about 6 hours ago", "4 days ago" */
export function timeAgo(minutes) {
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${Math.round(minutes)} min ago`;
  const hours = minutes / 60;
  if (hours < 24) {
    const h = Math.round(hours);
    return `${h === 1 ? 'about 1 hour' : `about ${h} hours`} ago`;
  }
  const days = Math.round(hours / 24);
  return `${days} ${days === 1 ? 'day' : 'days'} ago`;
}

/** "Jul 10, 2026 · 18:41" style stamp from a timestamp in ms. */
export function formatStamp(ts) {
  const d = new Date(ts);
  const date = d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
  return `${date} · ${time}`;
}

export function formatClock(ts) {
  return new Date(ts).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
  });
}

export function formatDateShort(ts) {
  return new Date(ts).toLocaleDateString('en-US', { weekday: 'short' });
}

export function pad2(n) {
  return String(n).padStart(2, '0');
}

/** Converts an array of objects to CSV and triggers a browser download. */
export function downloadCsv(filename, rows) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const escape = (v) => {
    const s = String(v ?? '');
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [headers.join(','), ...rows.map((r) => headers.map((h) => escape(r[h])).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
