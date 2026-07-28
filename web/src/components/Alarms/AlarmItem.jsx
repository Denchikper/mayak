// Маяк — система управления звуковыми оповещениями
// by Benovich · https://github.com/Denchikper/mayak

import React from "react";
import { Siren, Pencil, Trash2 } from "lucide-react";
import Button from "../ui/Button";

export default function AlarmItem({ alarm, onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-between gap-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3.5">
      <div className="flex items-center gap-3 min-w-0">
        <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-[var(--surface-2)] text-[var(--accent)] shrink-0">
          <Siren size={17} />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-medium text-[var(--text)] truncate">{alarm.name}</p>
          {alarm.description && (
            <p className="text-xs text-[var(--text-muted)] truncate">{alarm.description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button variant="ghost" size="sm" onClick={() => onEdit(alarm.id)} aria-label="Редактировать">
          <Pencil size={15} />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onDelete(alarm.id)} aria-label="Удалить" className="hover:text-[var(--alarm)]">
          <Trash2 size={15} />
        </Button>
      </div>
    </div>
  );
}
