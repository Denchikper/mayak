import React from "react";

export default function DeviceItem({ device, onEdit, onDelete, onRegenerateToken }) {
  const copyToken = () => {
    if (device.auth_token) navigator.clipboard?.writeText(device.auth_token);
  };

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-md p-4 hover:border-[var(--beacon)] transition">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
        <div>
          <h3 className="text-lg font-medium text-[var(--text)]">{device.name}</h3>
          <p className="text-sm text-[var(--text-muted)]">
            Тип: {device.device_type} | IP: {device.ip_address}
          </p>
          {device.description && (
            <p className="text-sm text-[var(--text-muted)] mt-1 italic">{device.description}</p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onEdit}
            className="px-3 py-1.5 bg-[var(--beacon)] hover:bg-[var(--beacon-strong)] text-[#0A0F16] rounded-md text-sm font-medium cursor-pointer"
          >
            Редактировать
          </button>
          <button
            onClick={onDelete}
            className="px-3 py-1.5 bg-[var(--alarm)] hover:bg-[var(--alarm-strong)] text-[#0A0F16] rounded-md text-sm font-medium cursor-pointer"
          >
            Удалить
          </button>
        </div>
      </div>

      {/* Токен устройства — прошивается в железо */}
      <div className="mt-3 pt-3 border-t border-[var(--border)]">
        <label className="block text-xs text-[var(--text-muted)] mb-1">auth_token (прошить в устройство)</label>
        <div className="flex flex-wrap items-center gap-2">
          <code className="flex-1 min-w-[180px] text-xs text-[var(--text-soft)] bg-[var(--bg)] border border-[var(--border)] rounded-md px-3 py-2 break-all font-mono">
            {device.auth_token || "—"}
          </code>
          <button
            onClick={copyToken}
            disabled={!device.auth_token}
            className="px-3 py-2 bg-[var(--surface-2)] hover:bg-[var(--surface-3)] rounded-md text-xs cursor-pointer disabled:opacity-50"
          >
            Копировать
          </button>
          <button
            onClick={onRegenerateToken}
            className="px-3 py-2 bg-[var(--beacon)] hover:bg-[var(--beacon-strong)] text-[#0A0F16] rounded-md text-xs cursor-pointer"
          >
            Перевыпустить
          </button>
        </div>
      </div>
    </div>
  );
}
