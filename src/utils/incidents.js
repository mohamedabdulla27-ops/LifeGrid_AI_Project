import { DEVICES, INCIDENT_TYPES, SEVERITY_ORDER } from '../data/mockData';

export const DEVICE_BY_ID = Object.fromEntries(DEVICES.map((d) => [d.id, d]));

const PHRASE = { fire: 'fire', gas: 'gas leak', motion: 'motion risk' };

/** Human sentence for an incident, as shown in feeds. */
export function describeIncident(incident) {
  const room = DEVICE_BY_ID[incident.device]?.room ?? 'an unknown location';
  return `Edge AI fusion engine flagged ${PHRASE[incident.type] ?? 'an event'} with ${incident.confidence}% confidence at ${room}.`;
}

/** Title such as "Fire detected — Gateway Alpha" (already on the record). */
export function incidentTypeLabel(incident) {
  return INCIDENT_TYPES[incident.type]?.label ?? 'Event';
}

/** Where the incident happened, e.g. "Main Lobby". */
export function incidentLocation(incident) {
  return DEVICE_BY_ID[incident.device]?.room ?? 'Unknown location';
}

/** Lower rank = more urgent. */
export function severityRank(severity) {
  const idx = SEVERITY_ORDER.indexOf(severity);
  return idx === -1 ? SEVERITY_ORDER.length : idx;
}

/** Sort: most severe first, then newest first. */
export function sortByPriority(list) {
  return [...list].sort((a, b) => severityRank(a.severity) - severityRank(b.severity) || b.createdAt - a.createdAt);
}
