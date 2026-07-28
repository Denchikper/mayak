import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import AppLayout from "../components/AppLayout";
import SystemStatus from "../components/SystemStatus";
import AlarmControlPanel from "../components/AlarmControlPanel";
import UpcomingAlertsCard from "../components/UpcomingAlertsCard";
import ActiveScheduleCard from "../components/ActiveScheduleCard";

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

        {/*
          Два независимых вертикальных потока вместо grid/masonry-строк:
          широкая колонка с рабочими панелями + узкая колонка-рейл со статусами.
          Внутри каждого потока карточки просто стоят друг под другом —
          высота соседней колонки на это никак не влияет, разрывов не бывает.
        */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-4 items-start">
          <div className="flex flex-col gap-4">
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
          </div>

          <div className="flex flex-col gap-4">
            {can("block:dashboard.changeDuty") && (
              <ChangeDutyPanel
                token={token}
                logout={logout}
                navigate={navigate}
              />
            )}

            {can("section:plannedalerts") && (
              <>
                <ActiveScheduleCard token={token} logout={logout} navigate={navigate} />
                <UpcomingAlertsCard token={token} logout={logout} navigate={navigate} />
              </>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
