import React from "react";
import { Siren, Pencil, Trash2, GraduationCap } from "lucide-react";

export default function AlarmItem({ alarm, onEdit, onDelete }) {
  return (
    <div className="flex flex-col bg-[var(--surface)] border border-[var(--border)] rounded-lg p-5 hover:border-[var(--beacon)]/50 transition">
      <div className="flex items-start gap-3 mb-4">
        <span className="shrink-0 w-10 h-10 rounded-full bg-[var(--alarm)]/12 text-[var(--alarm)] flex items-center justify-center">
          <Siren size={18} />
        </span>
        <div className="min-w-0">
          <p className="font-medium truncate">{alarm.name}</p>
          {alarm.name_remote && (
            <p className="text-xs font-mono text-[var(--text-muted)] truncate">{alarm.name_remote}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4 text-xs font-mono text-[var(--text-muted)]">
        <span className="px-2 py-0.5 rounded bg-[var(--surface-2)]">Канал {alarm.channel}</span>
        {alarm.is_drill && (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-[var(--beacon)]/12 text-[var(--beacon)]">
            <GraduationCap size={12} /> Учебная
          </span>
        )}
      </div>

      <div className="mt-auto flex gap-2">
        <button
          onClick={() => onEdit(alarm.id)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[var(--beacon)] hover:bg-[var(--beacon-strong)] text-[#0A0F16] rounded-md text-sm font-medium cursor-pointer"
        >
          <Pencil size={14} /> Изменить
        </button>
        <button
          onClick={() => onDelete(alarm.id)}
          aria-label="Удалить"
          title="Удалить"
          className="shrink-0 flex items-center justify-center px-3 py-1.5 bg-[var(--alarm)] hover:bg-[var(--alarm-strong)] text-[#0A0F16] rounded-md cursor-pointer"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
