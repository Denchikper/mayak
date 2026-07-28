// src/pages/DevicesPage.jsx
import React, { useEffect, useState } from "react";
import { Plus, RotateCw } from "lucide-react";
import AppLayout from "../components/AppLayout";
import DeviceItem from "../components/Devices/DeviceItem";
import CreateDeviceModal from "../components/Devices/CreateDeviceModal";
import ConfirmDeleteModal from "../components/Devices/ConfirmDeleteModal";
import Button from "../components/ui/Button";

import { getDevices, createDevice, updateDevice, deleteDevice, regenerateDeviceToken } from "../api/devices/devices";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function DevicesPage() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // модал создания/редактирования
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);

  // подтверждение удаления
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, name: "" });

  useEffect(() => {
    loadDevices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadDevices() {
    setLoading(true);
    setError(null);
    try {
      const data = await getDevices(token, logout, navigate);
      if(data.ok) {
        setDevices(Array.isArray(data.data) ? data.data : []);
      }
    } catch (err) {
      console.error("Ошибка загрузки устройств:", err);
      setError("Не удалось загрузить список устройств");
      setDevices([]);
    } finally {
      setLoading(false);
    }
  }

  // открыть создание
  function openCreate() {
    setEditingDevice(null);
    setIsCreateOpen(true);
  }

  // открыть редактирование
  function openEdit(device) {
    setEditingDevice(device);
    setIsCreateOpen(true);
  }

  // закрыть модал
  function closeCreate() {
    setEditingDevice(null);
    setIsCreateOpen(false);
  }

  // создать/обновить устройство
  async function handleCreateOrUpdate(payload) {
    try {
      if (editingDevice && editingDevice.id) {
        await updateDevice(token, editingDevice.id, payload, logout, navigate);
      } else {
        await createDevice(token, payload, logout, navigate);
      }
      await loadDevices();
    } catch (err) {
      console.error("Ошибка create/update устройства:", err);
    } finally {
      closeCreate();
    }
  }

  // перевыпустить токен устройства
  async function handleRegenerateToken(id) {
    try {
      await regenerateDeviceToken(token, id, logout, navigate);
      await loadDevices();
    } catch (err) {
      console.error("Ошибка перевыпуска токена устройства:", err);
    }
  }

  // открыть подтверждение удаления
  function handleDeleteClick(id, name) {
    setDeleteModal({ isOpen: true, id, name });
  }

  // подтвердить удаление
  async function handleConfirmDelete() {
    const { id } = deleteModal;
    try {
      await deleteDevice(token, id, logout, navigate);
      await loadDevices();
    } catch (err) {
      console.error("Ошибка удаления устройства:", err);
    } finally {
      setDeleteModal({ isOpen: false, id: null, name: "" });
    }
  }

  return (
    <AppLayout>
      <div className="px-4 sm:px-6 lg:px-10 py-6 lg:py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <h1 className="font-display text-2xl font-bold uppercase tracking-wide">Устройства</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={loadDevices} aria-label="Обновить">
              <RotateCw size={16} />
            </Button>
            <Button variant="primary" size="sm" onClick={openCreate}>
              <Plus size={16} />
              Добавить устройство
            </Button>
          </div>
        </div>

        {error && <p className="text-sm text-[var(--alarm)] mb-4">{error}</p>}

        {loading ? (
          <p className="text-sm text-[var(--text-muted)] text-center py-10">Загрузка устройств...</p>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 animate-fadeIn">
            {devices.length === 0 ? (
              <p className="col-span-full text-sm text-[var(--text-muted)] text-center py-10">Нет зарегистрированных устройств</p>
            ) : (
              devices.map((device) => (
                <DeviceItem
                  key={device.id}
                  device={device}
                  onEdit={() => openEdit(device)}
                  onDelete={() => handleDeleteClick(device.id, device.name)}
                  onRegenerateToken={() => handleRegenerateToken(device.id)}
                />
              ))
            )}
          </div>
        )}
      </div>

      <CreateDeviceModal
        isOpen={isCreateOpen}
        onClose={closeCreate}
        onCreate={handleCreateOrUpdate}
        initialData={editingDevice ?? undefined}
      />

      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null, name: "" })}
        onConfirm={handleConfirmDelete}
        deviceName={deleteModal.name}
      />
    </AppLayout>
  );
}
