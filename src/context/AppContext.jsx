import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DEMO_ACCOUNTS, DEVICES, INCIDENTS, INCIDENT_TYPES } from '../data/mockData';
import { clamp } from '../utils/format';

const AppContext = createContext(null);
const AUTH_KEY = 'lifegrid.auth';
const HISTORY_LENGTH = 20;

/** Reads a persisted session (remembered in localStorage, or session-only). */
function readStoredAuth() {
  try {
    const raw = localStorage.getItem(AUTH_KEY) || sessionStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** Seeds incidents with absolute timestamps derived from "minutes ago". */
function seedIncidents(now) {
  return INCIDENTS.map((i) => ({
    ...i,
    title: `${INCIDENT_TYPES[i.type].verb} — ${DEVICES.find((d) => d.id === i.device)?.name ?? 'Unknown'}`,
    createdAt: now - i.minutesAgo * 60_000,
    resolvedAt: null,
  }));
}

/** Seeds gateways with the baseline threat kept for live jitter. */
function seedDevices() {
  return DEVICES.map((d) => ({ ...d, baseThreat: d.threat, baseGas: d.gas }));
}

/**
 * Demo fusion score: average device threat plus 1.6 points per open incident.
 * Gives 38 for the mockup's fleet state (avg 21.8, 10 open incidents).
 */
export function computeFusedScore(devices, incidents) {
  const online = devices.filter((d) => d.online);
  const avgThreat = online.length ? online.reduce((s, d) => s + d.threat, 0) / online.length : 0;
  const openCount = incidents.filter((i) => i.status === 'open').length;
  return clamp(Math.round(avgThreat + openCount * 1.6), 0, 100);
}

export function AppProvider({ children }) {
  /* ---------------- auth ---------------- */
  const [auth, setAuth] = useState(readStoredAuth);

  const login = useCallback(({ email, password, remember }) => {
    const normalized = email.trim().toLowerCase();
    const account = DEMO_ACCOUNTS.find((a) => a.email === normalized && a.password === password);
    if (!account) {
      return { ok: false, error: 'Invalid email or password. Try a demo account below.' };
    }
    const session = { email: account.email, name: account.name, role: account.role, remember };
    const store = remember ? localStorage : sessionStorage;
    (remember ? sessionStorage : localStorage).removeItem(AUTH_KEY);
    store.setItem(AUTH_KEY, JSON.stringify(session));
    setAuth(session);
    return { ok: true, session };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(AUTH_KEY);
    setAuth(null);
  }, []);

  /* ---------------- clock ---------------- */
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  /* ---------------- toasts ---------------- */
  const [toasts, setToasts] = useState([]);
  const dismissToast = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const pushToast = useCallback((message, tone = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((t) => [...t.slice(-3), { id, message, tone }]);
    setTimeout(() => dismissToast(id), 3200);
  }, [dismissToast]);

  /* ---------------- incidents ---------------- */
  const [incidents, setIncidents] = useState(() => seedIncidents(Date.now()));

  const setIncidentStatus = useCallback((id, status) => {
    let changed = null;
    setIncidents((list) => list.map((i) => {
      if (i.id !== id) return i;
      changed = { ...i, status, resolvedAt: status === 'resolved' ? Date.now() : null };
      return changed;
    }));
    if (changed) {
      const label = { open: 'reopened', acknowledged: 'acknowledged', responding: 'marked responding', resolved: 'resolved' }[status];
      pushToast(`${changed.id} ${label}`, status === 'resolved' ? 'success' : 'info');
    }
  }, [pushToast]);

  /* ---------------- devices + live telemetry ---------------- */
  const [devices, setDevices] = useState(seedDevices);
  const [threatHistory, setThreatHistory] = useState(() => {
    const d = seedDevices();
    const f = computeFusedScore(d, seedIncidents(Date.now()));
    return Array.from({ length: HISTORY_LENGTH }, (_, i) => clamp(f - 14 + Math.round(Math.sin(i / 2.4) * 3 + i * 0.5), 0, 100));
  });

  const pingDevice = useCallback((id) => {
    setDevices((list) => list.map((d) => (d.id === id ? { ...d, lastSeenMin: 0 } : d)));
    const dev = DEVICES.find((d) => d.id === id);
    pushToast(`Heartbeat received from ${dev?.name ?? id}`, 'success');
  }, [pushToast]);

  const toggleDeviceOnline = useCallback((id) => {
    let next = null;
    setDevices((list) => list.map((d) => {
      if (d.id !== id) return d;
      next = { ...d, online: !d.online, lastSeenMin: d.online ? d.lastSeenMin : 0 };
      return next;
    }));
    if (next) pushToast(`${next.name} marked ${next.online ? 'online' : 'offline'}`, next.online ? 'success' : 'warning');
  }, [pushToast]);

  // Live telemetry tick: jitters gas/threat around baselines for online gateways.
  useEffect(() => {
    const id = setInterval(() => {
      setDevices((list) => list.map((d) => {
        if (!d.online) return d;
        const gas = clamp(Math.round(d.gas + (Math.random() - 0.5) * 8), 0, 1000);
        const temp = Number((d.temp + (Math.random() - 0.5) * 0.4).toFixed(1));
        const threat = clamp(Math.round(d.baseThreat + (Math.random() - 0.5) * 6), 0, 100);
        return { ...d, gas, temp, threat };
      }));
    }, 2500);
    return () => clearInterval(id);
  }, []);

  const fusedScore = useMemo(() => computeFusedScore(devices, incidents), [devices, incidents]);

  useEffect(() => {
    setThreatHistory((h) => [...h.slice(1), fusedScore]);
  }, [devices]); // eslint-disable-line react-hooks/exhaustive-deps -- sample once per telemetry tick

  /* ---------------- settings ---------------- */
  const DEFAULT_SETTINGS = {
    pushAlerts: true,
    audioAlarm: false,
    autoAckLow: false,
    cloudSync: true,
    evacOverlay: true,
    compactTables: false,
  };
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const toggleSetting = useCallback((key) => {
    setSettings((s) => ({ ...s, [key]: !s[key] }));
  }, []);
  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    pushToast('Settings restored to defaults', 'info');
  }, [pushToast]);

  const value = useMemo(() => ({
    auth, login, logout,
    now,
    toasts, pushToast, dismissToast,
    incidents, setIncidentStatus,
    devices, pingDevice, toggleDeviceOnline,
    fusedScore, threatHistory,
    settings, toggleSetting, resetSettings,
  }), [
    auth, login, logout, now, toasts, pushToast, dismissToast,
    incidents, setIncidentStatus, devices, pingDevice, toggleDeviceOnline,
    fusedScore, threatHistory, settings, toggleSetting, resetSettings,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}
