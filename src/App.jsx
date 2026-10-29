import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useApp } from './context/AppContext';
import AppShell from './components/layout/AppShell';
import LoginPage from './pages/LoginPage';
import MissionControlPage from './pages/MissionControlPage';
import IncidentCenterPage from './pages/IncidentCenterPage';
import DeviceCenterPage from './pages/DeviceCenterPage';
import DigitalTwinPage from './pages/DigitalTwinPage';
import AnalyticsPage from './pages/AnalyticsPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

/** Redirects anonymous visitors to /login, remembering where they were headed. */
function RequireAuth({ children }) {
  const { auth } = useApp();
  const location = useLocation();
  if (!auth) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return children;
}

export default function App() {
  const { auth } = useApp();

  return (
    <Routes>
      <Route path="/login" element={auth ? <Navigate to="/dashboard" replace /> : <LoginPage />} />

      <Route
        element={
          <RequireAuth>
            <AppShell />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<MissionControlPage />} />
        <Route path="/incidents" element={<IncidentCenterPage />} />
        <Route path="/devices" element={<DeviceCenterPage />} />
        <Route path="/digital-twin" element={<DigitalTwinPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
