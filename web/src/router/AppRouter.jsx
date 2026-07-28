// Маяк — система управления звуковыми оповещениями
// by Benovich · https://github.com/Denchikper/mayak

import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/login.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import PrivateRoute, { firstAllowedPath } from "../components/PrivateRoute.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import AlarmsPage from "../pages/Alarms.jsx";
import PlannedAlertsPage from "../pages/PlannedAlerts.jsx";
import DevicesPage from "../pages/Devices.jsx";
import SettingsPage from "../pages/Settings.jsx";

export default function AppRouter() {
  const { token, loading, permsLoaded, can } = useAuth();

  if (loading) return <div className="p-6 text-center text-[var(--text-muted)]">Загрузка...</div>;

  // Стартовая страница после входа — первый доступный раздел
  const home = token && permsLoaded ? firstAllowedPath(can) : null;

  return (
    <Routes>
      <Route
        path="/"
        element={
          !token ? <Login />
            : !permsLoaded ? <div className="p-6 text-center text-[var(--text-muted)]">Загрузка...</div>
            : home ? <Navigate to={home} replace />
            : <div className="p-6 text-center text-[var(--text-muted)]">Нет доступных разделов</div>
        }
      />
      <Route path="/dashboard" element={<PrivateRoute perm="section:dashboard"><Dashboard /></PrivateRoute>} />
      <Route path="/alarms" element={<PrivateRoute perm="section:alarms"><AlarmsPage /></PrivateRoute>} />
      <Route path="/plannedalerts" element={<PrivateRoute perm="section:plannedalerts"><PlannedAlertsPage /></PrivateRoute>} />
      <Route path="/devices" element={<PrivateRoute perm="section:devices"><DevicesPage /></PrivateRoute>} />
      <Route path="/settings" element={<PrivateRoute perm="section:settings"><SettingsPage /></PrivateRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
