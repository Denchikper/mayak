import { useState } from "react";
import { localTimeToUTC } from "../../../../utils/formatTime";

export default function AddLessonModal({ onClose, onSave }) {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleSave = () => {
    if (!startTime || !endTime) return;
    const startUTC = localTimeToUTC(startTime);
    const endUTC = localTimeToUTC(endTime);
    onSave({ startTime: startUTC, endTime: endUTC });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal content */}
      <div className="relative z-10 w-full max-w-md bg-[var(--bg)] rounded-lg p-4 md:p-6 flex flex-col gap-4 animate-modalEnter shadow-xl">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg md:text-xl font-semibold text-[var(--text)]">Добавить урок</h2>
        </div>

        {/* Inputs */}
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="text-sm md:text-base text-[var(--text-soft)] mb-2 block">Начало</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="lg:w-[87%] xl:w-full px-3 py-3 bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--beacon)] text-base"
                step="60" // Увеличивает шаг для удобства на планшетах
              />
            </div>

            <div>
              <label className="text-sm md:text-base text-[var(--text-soft)] mb-2 block">Конец</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="lg:w-[87%] xl:w-full px-3 py-3 bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--beacon)] text-base"
                step="60"
              />
            </div>
          </div>
        </div>

        {/* Footer buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 rounded-lg bg-[var(--surface-2)] hover:bg-[var(--surface-3)] text-base transition-colors duration-200"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            disabled={!startTime || !endTime}
            className={`w-full px-4 py-3 rounded-lg text-base transition-colors duration-200 ${
              startTime && endTime
                ? "bg-[var(--beacon)] hover:bg-[var(--beacon-strong)] text-[#0A0F16] cursor-pointer"
                : "bg-[var(--surface-3)] cursor-not-allowed opacity-50"
            }`}
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}