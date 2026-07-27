import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
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
    <div className="flex flex-col min-h-screen bg-[var(--bg)] text-[var(--text)] overscroll-y-none">
      <Navbar />

      <div className="flex flex-col lg:flex-row flex-1 items-center lg:items-start gap-6 px-4 sm:px-6 py-4 overflow-y-auto">
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
  );
}
