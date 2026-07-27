  import React, { useState, useEffect } from "react";
  import { RadioTower } from "lucide-react";
  import { getServerStatus } from "../api/server/getServerStatus";
  import ClockBar from "./ClockBar";

  export default function SystemStatus({ token, logout, navigate, activeAlarm, setActiveAlarm }) {

    const [devicesList, setDevicesList] = useState([]);
    const [serverConnected, setServerConnected] = useState(false); // новый флаг

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

    const isAlarmActive = activeAlarm !== "Нет активных тревог";
    const pulseClass = isAlarmActive
      ? "beacon-pulse--alarm"
      : serverConnected
        ? "beacon-pulse--safe"
        : "beacon-pulse--idle";

    return (
      <div className="bg-[var(--surface)] border border-[var(--border)] p-8 rounded-lg shadow-lg w-full text-[var(--text)] flex flex-col items-center">
        <span
          className={`beacon-pulse ${pulseClass} flex items-center justify-center w-16 h-16 rounded-full mb-5`}
          style={{ background: "var(--pulse-color)" }}
        >
          <RadioTower size={28} className="text-[#0A0F16]" />
        </span>

        <h2 className="font-display text-lg font-semibold text-center uppercase tracking-wide">
          Состояние системы
        </h2>

        <p className={`text-center text-sm font-medium mb-5 ${
          serverConnected ? "text-[var(--safe)]" : "text-[var(--alarm)]"
        }`}>
          {serverConnected ? "Сервер подключен" : "Сервер недоступен"}
        </p>

        <div className="border-t border-[var(--border)] pt-3 mb-5 w-full">
          <ClockBar
              token={token}
              logout={logout}
              navigate={navigate}/>
        </div>

        <div className="border-t border-[var(--border)] pt-3 mb-5 w-full">
          <p className="text-center text-[var(--text-muted)] uppercase tracking-wide text-xs font-mono">Активная тревога</p>
          <p
            className={`text-center mt-2 font-bold text-l py-2 rounded-md ${
              activeAlarm === "Нет активных тревог"
                ? "text-[var(--safe)] bg-[var(--safe)]/10"
                : "text-[var(--alarm)] bg-[var(--alarm)]/10"
            }`}
          >
            {activeAlarm}
          </p>
        </div>

      <div className="border-t border-[var(--border)] pt-3 mb-4 w-full">
    <p className="text-center text-[var(--text-muted)] uppercase tracking-wide mb-2 text-xs font-mono">Устройства</p>
    {Array.isArray(devicesList) && devicesList.length > 0 ? (
      devicesList.map((device, i) => (
        <div key={i} className="flex justify-between font-mono text-sm">
          <span>{i + 1}) {device.name}</span>
          <span className={device.is_online ? "text-[var(--safe)]" : "text-[var(--alarm)]"}>
            {device.is_online ? "В сети" : "Не в сети"}
          </span>
        </div>
      ))
    ) : (
      <p className="text-center text-[var(--alarm)]">Не удалось получить список устройств</p>
    )}
  </div>

      </div>
    );
  }
