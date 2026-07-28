// Маяк — система управления звуковыми оповещениями
// by Benovich · https://github.com/Denchikper/mayak

import React from "react";

export default function DayCard({ name, events = [] }) {
  return (
    <div className="flex flex-col bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 w-full">
      <div className="text-sm font-medium text-[var(--text)] text-center pb-3 mb-3 border-b border-[var(--border)]">
        {name}
      </div>

      <div className="flex flex-col gap-1.5">
        {events.length === 0 ? (
          <div className="text-[var(--text-muted)] text-sm text-center py-4">Нет уроков</div>
        ) : (
          events
            .sort((a, b) => a.event_order - b.event_order)
            .map(event => (
              <div
                key={event.id}
                className="flex items-center gap-3 px-2 py-1.5 rounded-lg"
              >
                <div className="font-mono text-xs font-semibold text-[var(--accent)] w-5 text-center shrink-0">
                  {event.event_order}
                </div>
                <div className="text-sm font-mono text-[var(--text-soft)]">
                  {event.start_time_local} – {event.end_time_local}
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}
