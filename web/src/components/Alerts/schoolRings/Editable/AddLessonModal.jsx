// Маяк — система управления звуковыми оповещениями
// by Benovich · https://github.com/Denchikper/mayak

import { useState } from "react";
import { localTimeToUTC } from "../../../../utils/formatTime";
import Modal from "../../../ui/Modal";
import Button from "../../../ui/Button";

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

  const timeFieldClass =
    "w-full px-3 py-2.5 bg-[var(--input)] text-[var(--text)] border border-[var(--border)] rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-colors";

  return (
    <Modal isOpen onClose={onClose} title="Добавить урок" maxWidth="max-w-sm">
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div>
          <label className="block text-xs text-[var(--text-soft)] mb-1.5">Начало</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className={timeFieldClass}
            step="60"
          />
        </div>

        <div>
          <label className="block text-xs text-[var(--text-soft)] mb-1.5">Конец</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className={timeFieldClass}
            step="60"
          />
        </div>
      </div>

      <div className="flex justify-center gap-3">
        <Button variant="secondary" onClick={onClose}>Отмена</Button>
        <Button variant="primary" onClick={handleSave} disabled={!startTime || !endTime}>Сохранить</Button>
      </div>
    </Modal>
  );
}
