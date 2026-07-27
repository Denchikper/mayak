import React, { useState, useEffect } from "react";
import { getServerStatus } from "../api/server/getServerStatus";
import ClockBar from "./ClockBar";

export default function SystemStatus({ token, logout, navigate, activeAlarm, setActiveAlarm }) {
  const [devicesList, setDevicesList] = useState([]);
  const [serverConnected, setServerConnected] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      const status = await getServerStatus(token, logout, navigate);
      setDevicesList(status.devicesList ?? []);
      setActiveAlarm(status.activeAlarm);
      setServerConnected(status.serverConnected);
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, [token, logout, navigate]);

  const alarmActive = activeAlarm !== "Нет активных тревог";

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 w-full max-w-sm flex flex-col">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-base font-semibold uppercase tracking-wide">Состояние системы</h2>
        <span className="flex items-center gap-2 text-xs font-medium">
          <span
            className={`beacon-dot ${serverConnected ? "beacon-dot--live" : ""}`}
            style={{ "--pulse-color": serverConnected ? "var(--safe)" : "var(--alarm)" }}
          />
          <span className={serverConnected ? "text-[var(--safe)]" : "text-[var(--alarm)]"}>
            {serverConnected ? "Онлайн" : "Недоступен"}
          </span>
        </span>
      </div>

      <div className="border-t border-[var(--border)] mt-4 pt-4">
        <ClockBar token={token} logout={logout} navigate={navigate} />
      </div>

      <div className="border-t border-[var(--border)] mt-4 pt-4">
        <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Активная тревога</p>
        <p
          className={`text-sm font-semibold py-2 px-3 rounded-lg text-center ${
            alarmActive
              ? "text-[var(--alarm)] bg-[var(--alarm)]/10"
              : "text-[var(--safe)] bg-[var(--safe)]/10"
          }`}
        >
          {activeAlarm}
        </p>
      </div>

      <div className="border-t border-[var(--border)] mt-4 pt-4">
        <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Устройства</p>
        {Array.isArray(devicesList) && devicesList.length > 0 ? (
          <ul className="flex flex-col gap-1.5 max-h-40 overflow-y-auto custom-scrollbar pr-1">
            {devicesList.map((device, i) => (
              <li key={i} className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-soft)] truncate">{device.name}</span>
                <span className={`text-xs font-medium shrink-0 ml-2 ${device.is_online ? "text-[var(--safe)]" : "text-[var(--text-muted)]"}`}>
                  {device.is_online ? "В сети" : "Не в сети"}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-[var(--text-muted)] text-center">Не удалось получить список устройств</p>
        )}
      </div>
    </div>
  );
}
