# LifeGrid AI — Edge AI Emergency Console

React 18 + Tailwind CSS single-page app that mirrors the LifeGrid AI mockups.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle in dist/
```

## Demo accounts

| Role     | Email                 | Password     |
|----------|-----------------------|--------------|
| Admin    | admin@lifegrid.ai     | admin123     |
| Operator | operator@lifegrid.ai  | operator123  |
| Viewer   | you@lifegrid.ai       | password     |

## Structure

```
src/
  App.jsx                  routes + auth guard
  main.jsx                 providers
  index.css                Tailwind layers (.panel, .btn-*, .label-caps, grid-bg)
  context/AppContext.jsx   global state: auth, incidents, devices, live telemetry, toasts, settings
  data/mockData.js         seed data (gateways, incidents, floors, analytics series)
  utils/                   formatting, CSV export, incident helpers
  hooks/useElementSize.js  responsive chart sizing
  components/
    layout/                Sidebar, Topbar, AppShell
    ui/                    Icon, Panel, StatCard, Toggle, SegmentedTabs, Badges, ProgressBar, Toasts
    charts/                GaugeRing, AreaChart, BarChart, HorizontalBars, Donut (hand-rolled SVG)
    dashboard/             LiveSensorFeed, IncidentFeed, SystemStatusBar
    incidents/             IncidentRow
    devices/               GatewayCard
    twin/                  FacilityMap, ZoneDetail
  pages/                   Login, MissionControl, IncidentCenter, DeviceCenter,
                           DigitalTwin, Analytics, History, Settings, NotFound
```

## Behaviour

- Telemetry (gas, temperature, threat) jitters every 2.5 s; the fused score, threat sparkline and average threat recompute from it.
- Incident workflow: Open → Acknowledged → Responding → Resolved (and reopen). Status changes update counts, KPIs and the fused score.
- Device Center: Ping updates heartbeat; the Online toggle takes a gateway off the map and out of the fleet counts.
- Digital Twin: floor tabs, marker selection, zone selection, evacuation overlay toggle.
- Incident Center: search, status and severity filters, expandable rows, CSV export of the filtered set.
- Analytics: frequency computed over the last 7 calendar days; donut legend toggles segments.
- Login: validation, password reveal, remember-me (localStorage vs sessionStorage), forgot-password message, route guard with return-to redirect.
