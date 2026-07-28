// Маяк — система управления звуковыми оповещениями
// by Benovich · https://github.com/Denchikper/mayak

import React from "react";
import DayCard from "./DayCard";

export default function DaysList({ scenarioList, daysList }) {

  // Группируем события по дням
  const eventsByDay = {};

  scenarioList.forEach(schedule => {
    eventsByDay[schedule.day_id] = schedule.ScheduleEvents.map(event => {
      // Парсим UTC start_time
      const [startH, startM, startS] = event.start_time.split(":").map(Number);
      const start = new Date();
      start.setUTCHours(startH, startM, startS, 0); // создаём UTC время
      const startLocal = start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      // Парсим UTC end_time
      const [endH, endM, endS] = event.end_time.split(":").map(Number);
      const end = new Date();
      end.setUTCHours(endH, endM, endS, 0);
      const endLocal = end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      return {
        ...event,
        start_time_local: startLocal,
        end_time_local: endLocal
      };
    });
  });

  // Сортировка дней: воскресенье ставим в конец
  const sortedDays = [...daysList].sort((a, b) => {
    const aIndex = a.order_index === 0 ? 7 : a.order_index;
    const bIndex = b.order_index === 0 ? 7 : b.order_index;
    return aIndex - bIndex;
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 w-full">
      {sortedDays.map(day => (
        <DayCard
          key={day.id}
          name={day.name}
          events={eventsByDay[day.id] || []} // передаем события с локальным временем
        />
      ))}
    </div>
  );
}
