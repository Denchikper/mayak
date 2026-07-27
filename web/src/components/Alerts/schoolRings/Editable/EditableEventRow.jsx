import { Trash2 } from "lucide-react";
import { localTimeToUTC, utcToLocalTime } from "../../../../utils/formatTime";

export default function EditableEventRow({ event, handleDeleteLesson, onChange }) {

  return (
    <div className="bg-[var(--surface-2)] rounded-lg p-3 flex gap-3 custom-scrollbar">
      
      {/* номер */}
      <div className="font-semibold text-[var(--beacon)] min-w-6 text-center">
        {event.event_order}
      </div>

      {/* контент */}
      <div className="flex flex-col gap-2 w-full">
        <span className="font-medium text-sm">Урок</span>

        {/* ВРЕМЯ — ТОЛЬКО В КОЛОНКУ */}
        <div className="grid grid-cols-1 gap-2">
          <label className="text-xs text-[var(--text-muted)]">
            С:
            <input
              type="time"
              value={utcToLocalTime(event.start_time)}
              onChange={(e) => onChange(event.id, {start_time: localTimeToUTC(e.target.value)})
            }
              className="mt-1 ml-5 bg-[var(--bg)] border border-[var(--border)] rounded px-2 py-1 text-sm"
            />
          </label>

          <label className="text-xs text-[var(--text-muted)] ">
            До:
            <input
              type="time"
              value={utcToLocalTime(event.end_time)}
              onChange={(e) => onChange(event.id, { end_time: localTimeToUTC(e.target.value) })
            }
              className="mt-1 ml-3 bg-[var(--bg)] border border-[var(--border)] rounded px-2 py-1 text-sm"
            />
          </label>
        </div>

        {/* действия */}
        <button onClick={() => handleDeleteLesson(event.id)} className="flex items-center gap-1 text-xs text-[var(--alarm)] hover:text-[var(--alarm-strong)] mt-1 cursor-pointer">
          <Trash2 size={14} />
          Удалить урок
        </button>
      </div>
    </div>
  );
}
