// src/pages/AlarmsPage.jsx
import React, { useEffect, useState } from "react";
import { Plus, RotateCw } from "lucide-react";
import AppLayout from "../components/AppLayout";
import AlarmItem from "../components/Alarms/AlarmItem";
import CreateAlarmModal from "../components/Alarms/CreateAlarmModal";
import ConfirmDeleteModal from "../components/Alarms/ConfirmDeleteModal";
import Button from "../components/ui/Button";

import { getAlarms, createAlarm, updateAlarm, deleteAlarm } from "../api/alarms/alarms";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AlarmsPage() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const [alarms, setAlarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // модал для создания/редактирования
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingAlarm, setEditingAlarm] = useState(null); // null = создаём

  // подтверждение удаления
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, name: "" });

  useEffect(() => {
    loadAlarms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadAlarms() {
    setLoading(true);
    setError(null);
    try {
      const data = await getAlarms(token, logout, navigate);
      // fetchWithAuth может вернуть null при 401, защитимся:
      if(data.ok) {
        setAlarms(Array.isArray(data.data) ? data.data : []);
      }
    } catch (err) {
      console.error("Ошибка загрузки тревог:", err);
      setError("Не удалось загрузить тревоги");
      setAlarms([]);
    } finally {
      setLoading(false);
    }
  }

  // открываем модал для создания
  function openCreate() {
    setEditingAlarm(null);
    setIsCreateOpen(true);
  }

  // открываем модал для редактирования
  function openEdit(alarm) {
    setEditingAlarm(alarm);
    setIsCreateOpen(true);
  }

  // закрываем create modal
  function closeCreate() {
    setEditingAlarm(null);
    setIsCreateOpen(false);
  }

  // обработчик создания/сохранения (вызывается из CreateAlarmModal)
  async function handleCreateOrUpdate(payload) {
    // payload: { name, description, priority? }
    try {
      if (editingAlarm && editingAlarm.id) {
        await updateAlarm(token, editingAlarm.id, payload, logout, navigate);
      } else {
        await createAlarm(token, payload, logout, navigate);
      }
      await loadAlarms();
    } catch (err) {
      console.error("Ошибка create/update:", err);
      // можно показывать ошибку пользователю
    } finally {
      closeCreate();
    }
  }

  // открыть confirm delete
  function handleDeleteClick(id, name) {
    setDeleteModal({ isOpen: true, id, name });
  }

  // подтвердить удаление
  async function handleConfirmDelete() {
    const { id } = deleteModal;
    try {
      await deleteAlarm(token, id, logout, navigate);
      await loadAlarms();
    } catch (err) {
      console.error("Ошибка удаления:", err);
    } finally {
      setDeleteModal({ isOpen: false, id: null, name: "" });
    }
  }

  return (
    <AppLayout>
      <div className="max-w-3xl px-4 sm:px-6 lg:px-10 py-6 lg:py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <h1 className="font-display text-2xl font-bold uppercase tracking-wide">Тревоги</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={loadAlarms} aria-label="Обновить">
              <RotateCw size={16} />
            </Button>
            <Button variant="primary" size="sm" onClick={openCreate}>
              <Plus size={16} />
              Создать тревогу
            </Button>
          </div>
        </div>

        {error && <p className="text-sm text-[var(--alarm)] mb-4">{error}</p>}

        {loading ? (
          <p className="text-sm text-[var(--text-muted)] text-center py-10">Загрузка тревог...</p>
        ) : (
          <div className="flex flex-col gap-2 animate-fadeIn">
            {alarms.length === 0 ? (
              <p className="text-sm text-[var(--text-muted)] text-center py-10">Нет доступных тревог</p>
            ) : (
              alarms.map((alarm) => (
                <AlarmItem
                  key={alarm.id}
                  alarm={alarm}
                  onEdit={() => openEdit(alarm)}
                  onDelete={() => handleDeleteClick(alarm.id, alarm.name)}
                />
              ))
            )}
          </div>
        )}
      </div>

      <CreateAlarmModal
        isOpen={isCreateOpen}
        onClose={closeCreate}
        onCreate={handleCreateOrUpdate}
        initialData={editingAlarm ?? undefined}
      />

      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null, name: "" })}
        onConfirm={handleConfirmDelete}
        alarmName={deleteModal.name}
      />
    </AppLayout>
  );
}
