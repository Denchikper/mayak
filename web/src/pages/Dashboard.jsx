import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
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
    <div className="flex flex-col lg:flex-row min-h-screen bg-[var(--bg)] text-[var(--text)] overscroll-y-none">
      <Sidebar />

      <div className="flex-1 min-w-0 overflow-y-auto">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.3fr] gap-6 px-4 sm:px-6 py-6 items-start max-w-6xl mx-auto">
          {can("block:dashboard.systemStatus") && (
            <SystemStatus
              token={token}
              logout={logout}
              navigate={navigate}
              activeAlarm={activeAlarm}
              setActiveAlarm={setActiveAlarm}
            />
          )}

          <div className="flex flex-col gap-6">
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
      </div>
    </div>
  );
}
