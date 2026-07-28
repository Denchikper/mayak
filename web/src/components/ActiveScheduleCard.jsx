// Маяк — система управления звуковыми оповещениями
// by Benovich · https://github.com/Denchikper/mayak

import React, { useEffect, useState } from "react";
import { CalendarClock } from "lucide-react";
import { schedulesActiveListGet } from "../api/alerts/schedules";

export default function ActiveScheduleCard({ token, logout, navigate }) {
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const res = await schedulesActiveListGet(token, logout, navigate);
      if (!cancelled && res.ok) {
        setActive(Array.isArray(res.data) && res.data.length > 0 ? res.data[0] : null);
      }
      if (!cancelled) setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [token, logout, navigate]);

  return (
    <div className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 flex flex-col">
      <h3 className="font-display text-base font-semibold uppercase tracking-wide mb-4">Расписание звонков</h3>

      {loading ? (
        <p className="text-sm text-[var(--text-muted)] text-center py-6">Загрузка...</p>
      ) : active ? (
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-[var(--surface-2)] text-[var(--accent)] shrink-0">
            <CalendarClock size={17} />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-[var(--text)] truncate">{active.name}</p>
            <p className="text-xs text-[var(--safe)] flex items-center gap-1.5 mt-0.5">
              <span className="beacon-dot beacon-dot--live" style={{ "--pulse-color": "var(--safe)" }} />
              активно
            </p>
          </div>
        </div>
      ) : (
        <p className="text-sm text-[var(--text-muted)] text-center py-6">Нет активного расписания</p>
      )}
    </div>
  );
}
