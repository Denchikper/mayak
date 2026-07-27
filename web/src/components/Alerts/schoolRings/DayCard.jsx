import React from "react";

export default function DayCard({ name, events = [] }) {
  return (
    <div className="flex flex-col items-center bg-[var(--surface-2)] border border-[var(--border)] shadow-sm p-5 rounded-lg w-full max-w-xs sm:max-w-sm md:max-w-md transition-all">

      {/* Название дня */}
      <div className="bg-[var(--surface-3)] text-[var(--text)] font-semibold w-full flex items-center justify-center rounded-lg mb-2 border border-[var(--border)] p-2 text-center wrap-break-words">
        {name}
      </div>

      {/* Дополнительный контент */}
      <div className="w-full flex flex-col gap-2">
        {events.length === 0 ? (
          <div className="text-[var(--text-muted)] text-sm text-center mt-4">Нет уроков</div>
        ) : (
          events
            .sort((a, b) => a.event_order - b.event_order) // сортируем по порядку
            .map(event => (
        <div
            key={event.id}
            className="bg-[var(--surface-2)] text-[var(--text)] p-3 rounded-lg flex justify-between items-center gap-2 shadow-sm hover:bg-[var(--surface-2)] transition-colors"
        >
        {/* Номер урока */}
            <div className="font-semibold text-[var(--beacon)] min-w-6 text-center">
            {event.event_order}
            </div>

        {/* Название и время урока */}
        <div className="flex flex-col flex-1">
            <span className="font-medium">Урок</span>
            <span className="text-[var(--text-muted)] text-sm">{event.start_time_local} - {event.end_time_local}</span>
        </div>

        </div>))
        )}
      </div>
    </div>
  );
}
