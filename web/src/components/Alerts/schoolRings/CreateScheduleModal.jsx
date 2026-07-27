import { useState } from "react";
import { X } from "lucide-react";

export default function CreateScheduleModal({ onClose, onCreate }) {
  const [name, setName] = useState("");

  const handleCreate = () => {
    if (!name.trim()) return;
    onCreate(name);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-modalEnter">
      {/* Overlay */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal */}
      <div className="relative z-10 w-[90vw] max-w-md bg-[var(--bg)] rounded-lg p-6 flex flex-col gap-5">
        
        {/* Header */}
        <div className="flex items-center justify-center">
          <h2 className="text-lg font-semibold text-[var(--text)]">
            Создание расписания
          </h2>
        </div>

        {/* Input */}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Введите название расписания"
          className="w-full px-4 py-2 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--beacon)]"
        />

        {/* Footer */}
        <div className="flex justify-center gap-3 mt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[var(--surface-2)] hover:bg-[var(--surface-3)]"
          >
            Отменить
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-2 rounded-lg bg-[var(--beacon)] hover:bg-[var(--beacon-strong)] text-[#0A0F16]"
          >
            Создать
          </button>
        </div>
      </div>
    </div>
  );
}
