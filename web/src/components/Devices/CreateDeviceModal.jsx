import React, { useState, useEffect } from "react";

export default function CreateDeviceModal({ isOpen, onClose, onCreate, initialData }) {
  const [name, setName] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [description, setDescription] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  if (!isOpen) return null;

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

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  const selectType = (value) => {
    setDeviceType(value);
    setIsDropdownOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6 w-full max-w-md shadow-xl transform transition-all duration-300 animate-modalEnter">
        <h2 className="font-display uppercase tracking-wide text-lg font-semibold mb-4 text-center text-[var(--text)]">
          {initialData ? "Редактировать устройство" : "Добавить устройство"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Название */}
          <div>
            <label className="block text-sm text-[var(--text-muted)] mb-1">Название</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 
                         text-[var(--text)] placeholder-gray-400 focus:outline-none focus:border-[var(--beacon)] transition-all duration-200"
              placeholder="Например: Relay Controller"
            />
          </div>

          {/* Имя устройства */}
          <div>
            <label className="block text-sm text-[var(--text-muted)] mb-1">Имя устройства</label>
            <input
              type="text"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 
                         text-[var(--text)] placeholder-gray-400 focus:outline-none focus:border-[var(--beacon)] transition-all duration-200"
              placeholder="Relay_device"
            />
          </div>

          {/* Тип устройства */}
          <div className="relative">
            <label className="block text-sm text-[var(--text-muted)] mb-1">Тип устройства</label>
            <div
              onClick={toggleDropdown}
              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text)] 
                         cursor-pointer flex justify-between items-center focus:outline-none 
                         focus:border-[var(--beacon)] transition-all duration-200"
            >
              <span>
                {deviceTypes.find((t) => t.value === deviceType)?.label || "Выберите тип устройства"}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-4 h-4 text-[var(--text-muted)] transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {isDropdownOpen && (
              <div className="absolute w-full mt-1 bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg 
                              max-h-48 overflow-y-auto animate-fadeIn z-50">
                {deviceTypes.map((type) => (
                  <div
                    key={type.value}
                    onClick={() => selectType(type.value)}
                    className={`px-3 py-2 cursor-pointer hover:bg-[var(--surface-2)] transition-colors ${
                      type.value === deviceType ? "bg-[var(--surface-2)]" : ""
                    }`}
                  >
                    {type.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* IP адрес */}
          <div>
            <label className="block text-sm text-[var(--text-muted)] mb-1">IP адрес</label>
            <input
              type="text"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 
                         text-[var(--text)] placeholder-gray-400 focus:outline-none focus:border-[var(--beacon)] transition-all duration-200"
              placeholder="192.168.1.10"
            />
          </div>

          {/* Описание */}
          <div>
            <label className="block text-sm text-[var(--text-muted)] mb-1">Описание</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text)] h-20 resize-none
                         placeholder-gray-400 focus:outline-none focus:border-[var(--beacon)] transition-all duration-200"
              placeholder="Дополнительная информация..."
            />
          </div>

          {/* Кнопки */}
          <div className="flex justify-center space-x-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[var(--surface-2)] hover:bg-[var(--surface-3)] transition-all duration-200 text-sm cursor-pointer"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[var(--beacon)] hover:bg-[var(--beacon-strong)] text-[#0A0F16] transition-all duration-200 text-sm font-medium cursor-pointer"
            >
              {initialData ? "Сохранить" : "Добавить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
