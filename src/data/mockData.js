/**
 * Seed data for LifeGrid AI.
 * Values mirror the mockup. Where the screenshots disagree with each other
 * (e.g. Bravo's threat shows 29 on Mission Control but 88 on Device Center),
 * the Device Center values are used so the fleet average matches the 21.8 shown.
 * Timestamps are stored as "minutes ago" so the demo always looks live.
 */

export const DEMO_ACCOUNTS = [
  { role: 'Admin', email: 'admin@lifegrid.ai', password: 'admin123', name: 'Arjun Mehta' },
  { role: 'Operator', email: 'operator@lifegrid.ai', password: 'operator123', name: 'Dev Raman' },
  { role: 'Viewer', email: 'you@lifegrid.ai', password: 'password', name: 'Priya Nair' },
];

export const NAV_ITEMS = [
  { group: 'Operations', items: [
    { to: '/dashboard', label: 'Mission Control', icon: 'grid' },
    { to: '/incidents', label: 'Incident Center', icon: 'alarm' },
    { to: '/devices', label: 'Device Center', icon: 'chip' },
    { to: '/digital-twin', label: 'Digital Twin', icon: 'building' },
  ] },
  { group: 'Intelligence', items: [
    { to: '/analytics', label: 'Analytics', icon: 'chart' },
    { to: '/history', label: 'History', icon: 'history' },
  ] },
  { group: 'System', items: [
    { to: '/settings', label: 'Settings', icon: 'gear' },
  ] },
];

export const INCIDENT_TYPES = {
  fire: { label: 'Fire', verb: 'Fire detected' },
  gas: { label: 'Gas Leak', verb: 'Gas Leak detected' },
  motion: { label: 'Motion Risk', verb: 'Motion Risk detected' },
};

export const SEVERITY_ORDER = ['critical', 'high', 'medium', 'low'];

export const SEVERITY_STYLES = {
  critical: { label: 'CRITICAL', text: 'text-alert', border: 'border-alert/40', bg: 'bg-alert/10', hex: '#FC3C18' },
  high: { label: 'HIGH', text: 'text-alert-soft', border: 'border-alert-soft/40', bg: 'bg-alert-soft/10', hex: '#FC6C3C' },
  medium: { label: 'MEDIUM', text: 'text-amber', border: 'border-amber/40', bg: 'bg-amber/10', hex: '#FCAE00' },
  low: { label: 'LOW', text: 'text-signal', border: 'border-signal/40', bg: 'bg-signal/10', hex: '#00E472' },
};

export const STATUS_OPTIONS = ['open', 'acknowledged', 'responding', 'resolved'];

/* ------------------------------------------------------------------ */
/* Gateways (Arduino UNO Q fleet)                                      */
/* ------------------------------------------------------------------ */
export const DEVICES = [
  {
    id: 'LG-UNO-001', name: 'Gateway Alpha', short: 'Alpha',
    room: 'Main Lobby', floor: 1, zone: 'A', firmware: 'v2.3.1',
    battery: 5, signal: 96, gas: 86, temp: 27.7, threat: 12,
    online: true, lastSeenMin: 4320, uptime: 100,
    marker: { x: 20, y: 32 },
  },
  {
    id: 'LG-UNO-002', name: 'Gateway Bravo', short: 'Bravo',
    room: 'Server Room', floor: 1, zone: 'B', firmware: 'v2.3.1',
    battery: 5, signal: 83, gas: 198, temp: 29.7, threat: 88,
    online: true, lastSeenMin: 360, uptime: 100,
    marker: { x: 76, y: 30 },
  },
  {
    id: 'LG-UNO-003', name: 'Gateway Charlie', short: 'Charlie',
    room: 'Cafeteria', floor: 2, zone: 'A', firmware: 'v2.3.1',
    battery: 5, signal: 72, gas: 41, temp: 21.5, threat: 4,
    online: true, lastSeenMin: 360, uptime: 100,
    marker: { x: 24, y: 34 },
  },
  {
    id: 'LG-UNO-004', name: 'Gateway Delta', short: 'Delta',
    room: 'Lecture Hall 2B', floor: 2, zone: 'C', firmware: 'v2.3.1',
    battery: 5, signal: 73, gas: 107, temp: 27.0, threat: 9,
    online: true, lastSeenMin: 360, uptime: 100,
    marker: { x: 74, y: 26 },
  },
  {
    id: 'LG-UNO-005', name: 'Gateway Echo', short: 'Echo',
    room: 'Loading Dock', floor: 0, zone: 'D', firmware: 'v2.3.1',
    battery: 5, signal: 55, gas: 112, temp: 27.3, threat: 9,
    online: true, lastSeenMin: 360, uptime: 100,
    marker: { x: 30, y: 62 },
  },
  {
    id: 'LG-UNO-006', name: 'Gateway Foxtrot', short: 'Foxtrot',
    room: 'East Corridor', floor: 1, zone: 'C', firmware: 'v2.3.1',
    battery: 5, signal: 68, gas: 120, temp: 28.0, threat: 9,
    online: true, lastSeenMin: 360, uptime: 100,
    marker: { x: 52, y: 66 },
  },
];

/** Non-gateway sensors shown on the twin (idle/grey markers in the mockup). */
export const SENSORS = [
  { id: 'PIR-01', name: 'Stairwell PIR-01', floor: 1, zone: 'Stairwell', marker: { x: 10, y: 66 }, online: false },
];

/* ------------------------------------------------------------------ */
/* Incidents (18 total, 10 open, 8 in progress, 0 resolved)            */
/* ------------------------------------------------------------------ */
const ACTIONS = {
  fire: 'Trigger fire suppression protocol. Evacuate zone immediately. Dispatch emergency responders.',
  gas: 'Isolate gas supply to zone. Ventilate area. Restrict access until MQ2 readings normalize.',
  motion: 'Log for review. No immediate action required.',
};

export const INCIDENTS = [
  { id: 'INC-1801', type: 'fire', severity: 'critical', device: 'LG-UNO-001', confidence: 89, status: 'open', minutesAgo: 5760 },
  { id: 'INC-1802', type: 'gas', severity: 'high', device: 'LG-UNO-001', confidence: 86, status: 'open', minutesAgo: 5759 },
  { id: 'INC-1803', type: 'motion', severity: 'low', device: 'LG-UNO-001', confidence: 60, status: 'open', minutesAgo: 5758 },
  { id: 'INC-1804', type: 'gas', severity: 'high', device: 'LG-UNO-004', confidence: 99, status: 'open', minutesAgo: 7200 },
  { id: 'INC-1805', type: 'fire', severity: 'critical', device: 'LG-UNO-003', confidence: 90, status: 'open', minutesAgo: 7800 },
  { id: 'INC-1806', type: 'fire', severity: 'critical', device: 'LG-UNO-002', confidence: 93, status: 'open', minutesAgo: 1440 * 2 + 300 },
  { id: 'INC-1807', type: 'gas', severity: 'high', device: 'LG-UNO-005', confidence: 82, status: 'open', minutesAgo: 1440 * 3 + 120 },
  { id: 'INC-1808', type: 'motion', severity: 'low', device: 'LG-UNO-006', confidence: 55, status: 'open', minutesAgo: 1440 * 3 + 480 },
  { id: 'INC-1809', type: 'gas', severity: 'high', device: 'LG-UNO-002', confidence: 91, status: 'open', minutesAgo: 1440 * 4 + 60 },
  { id: 'INC-1810', type: 'motion', severity: 'low', device: 'LG-UNO-004', confidence: 63, status: 'open', minutesAgo: 1440 * 4 + 400 },
  { id: 'INC-1811', type: 'fire', severity: 'critical', device: 'LG-UNO-006', confidence: 87, status: 'acknowledged', minutesAgo: 1440 * 5 + 30 },
  { id: 'INC-1812', type: 'gas', severity: 'high', device: 'LG-UNO-003', confidence: 84, status: 'acknowledged', minutesAgo: 1440 * 5 + 200 },
  { id: 'INC-1813', type: 'motion', severity: 'low', device: 'LG-UNO-005', confidence: 58, status: 'responding', minutesAgo: 1440 * 6 + 90 },
  { id: 'INC-1814', type: 'fire', severity: 'critical', device: 'LG-UNO-004', confidence: 94, status: 'responding', minutesAgo: 1440 * 6 + 600 },
  { id: 'INC-1815', type: 'gas', severity: 'high', device: 'LG-UNO-001', confidence: 79, status: 'acknowledged', minutesAgo: 1440 * 7 + 150 },
  { id: 'INC-1816', type: 'motion', severity: 'low', device: 'LG-UNO-002', confidence: 61, status: 'responding', minutesAgo: 1440 * 7 + 720 },
  { id: 'INC-1817', type: 'fire', severity: 'critical', device: 'LG-UNO-005', confidence: 96, status: 'acknowledged', minutesAgo: 1440 * 8 + 240 },
  { id: 'INC-1818', type: 'gas', severity: 'high', device: 'LG-UNO-006', confidence: 88, status: 'responding', minutesAgo: 1440 * 8 + 900 },
].map((i) => ({
  ...i,
  action: ACTIONS[i.type],
}));

/* ------------------------------------------------------------------ */
/* Digital twin floors                                                 */
/* ------------------------------------------------------------------ */
export const FLOORS = {
  0: {
    label: 'Floor 0',
    zones: [
      { id: 'D', label: 'Loading Dock', x: 6, y: 46, w: 46, h: 46, evac: true },
      { id: 'E', label: 'Storage', x: 56, y: 46, w: 38, h: 46, evac: false },
    ],
  },
  1: {
    label: 'Floor 1',
    zones: [
      { id: 'A', label: 'Main Lobby', x: 6, y: 8, w: 42, h: 34, evac: true },
      { id: 'B', label: 'Server Room', x: 52, y: 8, w: 42, h: 34, evac: false },
      { id: 'C', label: 'East Corridor', x: 6, y: 50, w: 88, h: 30, evac: true },
    ],
  },
  2: {
    label: 'Floor 2',
    zones: [
      { id: 'A', label: 'Cafeteria', x: 6, y: 8, w: 42, h: 34, evac: true },
      { id: 'C', label: 'Lecture Hall 2B', x: 52, y: 8, w: 42, h: 34, evac: false },
      { id: 'F', label: 'Corridor', x: 6, y: 50, w: 88, h: 30, evac: true },
    ],
  },
};

/* ------------------------------------------------------------------ */
/* Analytics series                                                    */
/* ------------------------------------------------------------------ */
export const THREAT_TREND_HOURS = [
  { t: '05:00', v: 0 }, { t: '06:00', v: 0 }, { t: '07:00', v: 0 }, { t: '08:00', v: 0 },
  { t: '09:00', v: 0 }, { t: '10:00', v: 0 }, { t: '11:00', v: 0 }, { t: '12:00', v: 0 },
  { t: '13:00', v: 0 }, { t: '14:00', v: 1 }, { t: '15:00', v: 4 }, { t: '16:00', v: 18 },
];

