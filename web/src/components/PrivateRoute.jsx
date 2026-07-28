// Маяк — система управления звуковыми оповещениями
// by Benovich · https://github.com/Denchikper/mayak

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// Порядок разделов для выбора стартовой доступной страницы
const SECTION_PATHS = [
  { perm: "section:dashboard", path: "/dashboard" },
  { perm: "section:alarms", path: "/alarms" },
  { perm: "section:plannedalerts", path: "/plannedalerts" },
  { perm: "section:devices", path: "/devices" },
  { perm: "section:settings", path: "/settings" },
];

export function firstAllowedPath(can) {
  const found = SECTION_PATHS.find((s) => can(s.perm));
  return found ? found.path : null;
}

export default function PrivateRoute({ children, perm }) {
  const { token, loading, permsLoaded, can } = useAuth();

  if (loading) return <div className="p-6 text-center text-[var(--text-muted)]">Загрузка...</div>;
  if (!token) return <Navigate to="/" replace />;

  // ждём загрузки прав, чтобы не было ложного редиректа
  if (!permsLoaded) return <div className="p-6 text-center text-[var(--text-muted)]">Загрузка...</div>;

  if (perm && !can(perm)) {
    const fallback = firstAllowedPath(can);
    return fallback
      ? <Navigate to={fallback} replace />
      : <div className="p-6 text-center text-[var(--text-muted)]">Нет доступа к этому разделу</div>;
  }

  return children;
}
