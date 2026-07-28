import { Trash2 } from "lucide-react";
import { localTimeToUTC, utcToLocalTime } from "../../../../utils/formatTime";

export default function EditableEventRow({ event, handleDeleteLesson, onChange }) {

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-3 flex gap-3">

      <div className="font-mono text-xs font-semibold text-[var(--accent)] min-w-5 text-center pt-0.5">
        {event.event_order}
      </div>

      <div className="flex flex-col gap-2 w-full min-w-0">
        <label className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
          <span className="w-5 shrink-0">С</span>
          <input
            type="time"
            value={utcToLocalTime(event.start_time)}
            onChange={(e) => onChange(event.id, {start_time: localTimeToUTC(e.target.value)})}
            className="min-w-0 flex-1 bg-[var(--input)] border border-[var(--border)] rounded px-2 py-1 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
        </label>

        <label className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
          <span className="w-5 shrink-0">До</span>
          <input
            type="time"
            value={utcToLocalTime(event.end_time)}
            onChange={(e) => onChange(event.id, { end_time: localTimeToUTC(e.target.value) })}
            className="min-w-0 flex-1 bg-[var(--input)] border border-[var(--border)] rounded px-2 py-1 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
        </label>

        <button onClick={() => handleDeleteLesson(event.id)} className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--alarm)] transition-colors cursor-pointer">
          <Trash2 size={13} />
          Удалить урок
        </button>
      </div>
    </div>
  );
}
