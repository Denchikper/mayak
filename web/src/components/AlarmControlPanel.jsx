import React, { useEffect, useState } from "react";
import ConfirmActivateModal from "./ConfirmActivateModal";
import ErrorModal from "./ErrorModal";
import { activateAlarm, deactivateAlarm, getAlarms } from "../api/alarms/alarms";
import Button from "./ui/Button";

export default function AlarmControlPanel({ token, logout, navigate, setActiveAlarm }) {
  const [alarms, setAlarms] = useState([]);
  const [confirmModal, setConfirmModal] = useState({ open: false, alarm: null });
  const [errorModal, setErrorModal] = useState({ open: false, message: "" });

  useEffect(() => {
    const loadAlarms = async () => {
      try {
        const data = await getAlarms(token, logout);
        if (data.ok) {
          setAlarms(data.data || []);
        }
      } catch (err) {
        console.error("Ошибка при загрузке тревог:", err);
      }
    };

    loadAlarms();
    const interval = setInterval(loadAlarms, 5000);
    return () => clearInterval(interval);
  }, [token, logout, navigate]);

  const alarmList = Array.isArray(alarms) ? alarms : [];
  const openConfirm = (alarm) => setConfirmModal({ open: true, alarm });
  const closeConfirm = () => setConfirmModal({ open: false, alarm: null });

  const handleConfirmActivate = async () => {
    if (!confirmModal.alarm) return;

    try {
      const res = await activateAlarm(token, confirmModal.alarm.id, logout, navigate);

      if (!res.ok) {
        setErrorModal({ open: true, message: res.data.errorMessage });
      } else {
        setActiveAlarm(confirmModal.alarm.name);
      }

      closeConfirm();
    } catch (err) {
      console.error("Ошибка при активации будильника:", err);
      let message = "Произошла неизвестная ошибка";

      try {
        const parsed = JSON.parse(err.message);
        if (parsed.error) message = parsed.error;
      } catch {}

      setErrorModal({ open: true, message });
      closeConfirm();
    }
  };

  const handleDeactivateAllClick = async () => {
    try {
      const res = await deactivateAlarm(token, logout, navigate);

      if (!res.ok) {
        setErrorModal({ open: true, message: res.data.errorMessage });
      } else {
        setActiveAlarm("Нет активных тревог");
      }

      closeConfirm();
    } catch (err) {
      console.error("Ошибка при деактивации всех тревог:", err);
      let message = "Произошла неизвестная ошибка";

      try {
        const parsed = JSON.parse(err.message);
        if (parsed.error) message = parsed.error;
      } catch {}

      setErrorModal({ open: true, message });
      closeConfirm();
    }
  };

  return (
    <>
      <div className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 flex flex-col">
        <h3 className="font-display text-base font-semibold uppercase tracking-wide mb-4">
          Управление тревогами
        </h3>

        {alarmList.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)] text-center py-6">
            Сервер недоступен или тревоги не найдены
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
            {alarmList.map((alarm) => (
              <button
                key={alarm.id}
                onClick={() => openConfirm(alarm)}
                className="px-3 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] hover:border-[var(--accent)] hover:bg-[var(--surface-2)] text-left text-sm font-medium text-[var(--text)] transition-colors cursor-pointer"
              >
                {alarm.name}
              </button>
            ))}
          </div>
        )}

        <Button variant="danger" full className="mt-4" onClick={handleDeactivateAllClick}>
          Отключить все тревоги
        </Button>
      </div>

      <ConfirmActivateModal
        isOpen={confirmModal.open}
        onClose={closeConfirm}
        onConfirm={handleConfirmActivate}
        alarmName={confirmModal.alarm?.name}
      />

      <ErrorModal
        isOpen={errorModal.open}
        onClose={() => setErrorModal({ open: false, message: "" })}
        message={errorModal.message}
      />
    </>
  );
}
