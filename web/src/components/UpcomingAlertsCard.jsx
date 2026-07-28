// Маяк — система управления звуковыми оповещениями
// by Benovich · https://github.com/Denchikper/mayak

import React, { useEffect, useState } from "react";
import { Bell, BookOpen, Clock } from "lucide-react";
import { plannedAlertsListGet } from "../api/alerts/plannedAlerts";
import { schedulesActiveListGet } from "../api/alerts/schedules";
import { scenariosGet } from "../api/alerts/scenarios";
import { daysListGet } from "../api/alerts/days";

// UTC "HH:MM:SS" события урока -> ближайшая по времени сегодняшняя локальная дата
function utcTimeToTodayDate(utcString) {
  const [h, m, s] = utcString.split(":").map(Number);
  const date = new Date();
  date.setUTCHours(h, m, s || 0, 0);
  return date;
}

export default function UpcomingAlertsCard({ token, logout, navigate }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const now = new Date();
      const results = [];

      const alertsRes = await plannedAlertsListGet(token, logout, navigate);
      if (alertsRes.ok) {
        (Array.isArray(alertsRes.data) ? alertsRes.data : [])
          .filter((a) => a.is_active)
          .forEach((a) => {
            results.push({
              key: `alert-${a.id}`,
              type: "alert",
              name: a.name,
              time: new Date(a.start_time),
            });
          });
      }

      const activeRes = await schedulesActiveListGet(token, logout, navigate);
      const activeSchedule = activeRes.ok && Array.isArray(activeRes.data) ? activeRes.data[0] : null;
      if (activeSchedule) {
        const [daysRes, scenariosRes] = await Promise.all([
          daysListGet(token, logout, navigate),
          scenariosGet(token, activeSchedule.id, logout, navigate),
        ]);
        if (daysRes.ok && scenariosRes.ok) {
          const todayOrderIndex = now.getDay(); // Вс=0 ... Сб=6, совпадает с order_index (см. server/src/utils/seed.js)
          const today = daysRes.data.find((d) => d.order_index === todayOrderIndex);
          const scenario = today
            ? scenariosRes.data.find((s) => s.day_id === today.id)
            : null;

          (scenario?.ScheduleEvents || []).forEach((event) => {
            const time = utcTimeToTodayDate(event.start_time);
            if (time > now) {
              results.push({
                key: `lesson-${event.id}`,
                type: "lesson",
                name: `Урок ${event.event_order}`,
                time,
              });
            }
          });
        }
      }

      if (!cancelled) {
        results.sort((a, b) => a.time - b.time);
        setItems(results.slice(0, 4));
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [token, logout, navigate]);

  return (
    <div className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 flex flex-col">
      <h3 className="font-display text-base font-semibold uppercase tracking-wide mb-4">Ближайшие события</h3>

      {loading ? (
        <p className="text-sm text-[var(--text-muted)] text-center py-6">Загрузка...</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)] text-center py-6">Ничего не запланировано</p>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {items.map((item) => (
            <li key={item.key} className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--surface-2)] text-[var(--accent)] shrink-0">
                {item.type === "lesson" ? <BookOpen size={14} /> : <Bell size={14} />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[var(--text)] truncate">{item.name}</p>
                <p className="text-xs font-mono text-[var(--text-muted)] flex items-center gap-1.5">
                  <Clock size={11} />
                  {item.type === "lesson"
                    ? item.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                    : item.time.toLocaleString()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
