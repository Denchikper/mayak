// Маяк — система управления звуковыми оповещениями
// by Benovich · https://github.com/Denchikper/mayak

import React, { useState, useEffect, useRef } from "react";
import { getServerTime } from "../api/server/getServerTime";

export default function ClockBar({ token, logout, navigate }) {
  const [localTime, setLocalTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [serverTime, setServerTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
    date: null
  });

  const formatTime = (num) => String(num).padStart(2, "0");

  // Refs для хранения данных о синхронизации
  const serverTimeRef = useRef(null);
  const lastSyncRef = useRef(null);
  const serverOffsetRef = useRef(0); // разница между серверным временем и локальным

  // Функция для локального времени
  const getLocalTime = () => {
    const now = new Date();
    return {
      hours: now.getHours(),
      minutes: now.getMinutes(),
      seconds: now.getSeconds(),
    };
  };

  // Функция для расчета серверного времени на основе последней синхронизации
  const getCalculatedServerTime = () => {
    if (!serverTimeRef.current || !lastSyncRef.current) return null;

    const now = Date.now();
    const elapsed = now - lastSyncRef.current; // прошло миллисекунд с синхронизации

    // Вычисляем новую дату серверного времени
    const calculatedDate = new Date(serverTimeRef.current.getTime() + elapsed);

    return {
      hours: calculatedDate.getHours(),
      minutes: calculatedDate.getMinutes(),
      seconds: calculatedDate.getSeconds(),
      date: calculatedDate
    };
  };

  // Обновляем локальное время каждую секунду
  useEffect(() => {
    const interval = setInterval(() => {
      setLocalTime(getLocalTime());

      // Обновляем серверное время расчетным путем
      const calculatedTime = getCalculatedServerTime();
      if (calculatedTime) {
        setServerTime({
          hours: calculatedTime.hours,
          minutes: calculatedTime.minutes,
          seconds: calculatedTime.seconds,
          date: calculatedTime.date
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Синхронизация с сервером
  useEffect(() => {
    if (!token) return;

    const fetchServerTime = async () => {
      try {
        const timeData = await getServerTime(token, logout, navigate);

        // Сохраняем объект Date для расчетов
        const serverDate = timeData.date;
        serverTimeRef.current = serverDate;
        lastSyncRef.current = Date.now();

        // Сохраняем в state для отображения
        setServerTime({
          hours: timeData.hours,
          minutes: timeData.minutes,
          seconds: timeData.seconds,
          date: serverDate
        });

        // Вычисляем разницу между серверным и локальным временем
        const localDate = new Date();
        serverOffsetRef.current = serverDate.getTime() - localDate.getTime();

      } catch (error) {
        console.error("Ошибка получения серверного времени:", error);
        // В случае ошибки используем локальное время
        const now = new Date();
        serverTimeRef.current = now;
        lastSyncRef.current = Date.now();
        setServerTime({
          hours: now.getHours(),
          minutes: now.getMinutes(),
          seconds: now.getSeconds(),
          date: now
        });
        serverOffsetRef.current = 0;
      }
    };

    setLocalTime(getLocalTime());
    fetchServerTime(); // сразу при загрузке

    // Синхронизация каждые 60 секунд (вместо 10)
    const interval = setInterval(fetchServerTime, 60000);
    return () => clearInterval(interval);
  }, [token, logout, navigate]);

  if (!token) return;

  return (
    <div className="flex justify-between gap-4 font-mono text-sm">
      <div className="flex flex-col">
        <span className="text-[var(--text-muted)] text-xs uppercase tracking-wide">Локальное</span>
        <span className="text-[var(--text)]">{`${formatTime(localTime.hours)}:${formatTime(localTime.minutes)}:${formatTime(localTime.seconds)}`}</span>
      </div>
      <div className="flex flex-col text-right">
        <span className="text-[var(--text-muted)] text-xs uppercase tracking-wide">Сервер</span>
        <span className="text-[var(--text)]">{`${formatTime(serverTime.hours)}:${formatTime(serverTime.minutes)}:${formatTime(serverTime.seconds)}`}</span>
      </div>
    </div>
  );
}
