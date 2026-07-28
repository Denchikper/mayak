import React, { useState, useEffect } from "react";
import BigSelect from "../ui/BigSelect";
import Modal from "../ui/Modal";
import Button from "../ui/Button";

const inputClass =
  "w-full bg-[var(--input)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-colors";

export default function CreateDeviceModal({ isOpen, onClose, onCreate, initialData }) {
  const [name, setName] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [description, setDescription] = useState("");

  const deviceTypes = [
    { value: "relay", label: "Реле" },
    { value: "receiver", label: "Приёмник" },
  ];

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name || "");
        setDeviceName(initialData.device_name || "");
        setDeviceType(initialData.device_type || "");
        setIpAddress(initialData.ip_address || "");
        setDescription(initialData.description || "");
      } else {
        setName("");
        setDeviceName("");
        setDeviceType("");
        setIpAddress("");
        setDescription("");
      }
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !deviceType.trim() || !ipAddress.trim()) return;

    onCreate({
      name,
      device_name: deviceName,
      device_type: deviceType,
      ip_address: ipAddress,
      description,
    });

    if (!initialData) {
      setName("");
      setDeviceName("");
      setDeviceType("");
      setIpAddress("");
      setDescription("");
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Редактировать устройство" : "Добавить устройство"}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm text-[var(--text-soft)] mb-1.5">Название</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            placeholder="Например: Relay Controller"
          />
        </div>

        <div>
          <label className="block text-sm text-[var(--text-soft)] mb-1.5">Имя устройства</label>
          <input
            type="text"
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
            className={inputClass}
            placeholder="Relay_device"
          />
        </div>

        <div>
          <label className="block text-sm text-[var(--text-soft)] mb-1.5">Тип устройства</label>
          <BigSelect
            value={deviceType}
            onChange={setDeviceType}
            options={deviceTypes}
            placeholder="Выберите тип устройства"
          />
        </div>

        <div>
          <label className="block text-sm text-[var(--text-soft)] mb-1.5">IP адрес</label>
          <input
            type="text"
            value={ipAddress}
            onChange={(e) => setIpAddress(e.target.value)}
            className={`${inputClass} font-mono`}
            placeholder="192.168.1.10"
          />
        </div>

        <div>
          <label className="block text-sm text-[var(--text-soft)] mb-1.5">Описание</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`${inputClass} h-20 resize-none`}
            placeholder="Дополнительная информация..."
          />
        </div>

        <div className="flex justify-center gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Отмена</Button>
          <Button type="submit" variant="primary">{initialData ? "Сохранить" : "Добавить"}</Button>
        </div>
      </form>
    </Modal>
  );
}
