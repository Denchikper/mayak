// Маяк — система управления звуковыми оповещениями
// by Benovich · https://github.com/Denchikper/mayak

import { useState } from "react";
import Modal from "../../ui/Modal";
import Button from "../../ui/Button";

export default function CreateScheduleModal({ onClose, onCreate }) {
  const [name, setName] = useState("");

  const handleCreate = () => {
    if (!name.trim()) return;
    onCreate(name);
    onClose();
  };

  return (
    <Modal isOpen title="Создание расписания" onClose={onClose}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Введите название расписания"
        autoFocus
        className="w-full bg-[var(--input)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-colors mb-5"
      />

      <div className="flex justify-center gap-3">
        <Button variant="secondary" onClick={onClose}>Отмена</Button>
        <Button variant="primary" onClick={handleCreate}>Создать</Button>
      </div>
    </Modal>
  );
}
