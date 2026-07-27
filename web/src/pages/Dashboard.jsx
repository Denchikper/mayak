import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import AppLayout from "../components/AppLayout";
import SystemStatus from "../components/SystemStatus";
import AlarmControlPanel from "../components/AlarmControlPanel";

import { useNavigate } from "react-router-dom";
import ChangeDutyPanel from "../components/ChangeDutyPanel";

export default function Dashboard() {
  const { token, logout, can } = useAuth();
  const navigate = useNavigate();
  const [activeAlarm, setActiveAlarm] = useState("Нет активных тревог");
  // Получение тревог при загрузке страницы
  useEffect(() => {
    document.title = "Панель управления | Маяк";
  }, []);

  return (
    <AppLayout>
      <div className="px-4 sm:px-6 lg:px-10 py-6 lg:py-10">
        <h1 className="font-display text-2xl font-bold uppercase tracking-wide mb-6">Дашборд</h1>

        <div className="flex flex-col lg:flex-row flex-wrap gap-4">
          {can("block:dashboard.systemStatus") && (
            <SystemStatus
              token={token}
              logout={logout}
              navigate={navigate}
              activeAlarm={activeAlarm}
              setActiveAlarm={setActiveAlarm}
            />
          )}

          {can("block:dashboard.alarmControl") && (
            <AlarmControlPanel
              token={token}
              logout={logout}
              navigate={navigate}
              setActiveAlarm={setActiveAlarm}
            />
          )}

          {can("block:dashboard.changeDuty") && (
            <ChangeDutyPanel
              token={token}
              logout={logout}
              navigate={navigate}
            />
          )}
        </div>
      </div>
    </AppLayout>
  );
}
