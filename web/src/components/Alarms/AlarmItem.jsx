import React from "react";

export default function AlarmItem({ alarm, onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-between bg-[var(--surface)] border border-[var(--border)] rounded-md p-4 hover:bg-[var(--surface)] transition">
      <div>
        <p className="text-lg font-medium">{alarm.name}</p>
        <p className="text-sm text-[var(--text-muted)]">{alarm.description}</p>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={() => onEdit(alarm.id)}
          className="px-3 py-1.5 bg-[var(--beacon)] hover:bg-[var(--beacon-strong)] text-[#0A0F16] rounded-md text-sm font-medium cursor-pointer"
        >
          Редактировать
        </button>
        <button
          onClick={() => onDelete(alarm.id)}
          className="px-3 py-1.5 bg-[var(--alarm)] hover:bg-[var(--alarm-strong)] text-[#0A0F16] rounded-md text-sm font-medium cursor-pointer"
        >
          Удалить
        </button>
      </div>
    </div>
  );
}