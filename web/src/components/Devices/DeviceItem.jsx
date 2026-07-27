import React from "react";
import { Radio, Pencil, Trash2, Copy, RefreshCw } from "lucide-react";

export default function DeviceItem({ device, onEdit, onDelete, onRegenerateToken }) {
  const copyToken = () => {
    if (device.auth_token) navigator.clipboard?.writeText(device.auth_token);
  };

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-5 hover:border-[var(--beacon)]/50 transition">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <span className="shrink-0 w-10 h-10 rounded-full bg-[var(--beacon)]/12 text-[var(--beacon)] flex items-center justify-center">
            <Radio size={18} />
          </span>
          <div className="min-w-0">
            <h3 className="font-medium text-[var(--text)] truncate">{device.name}</h3>
            <p className="text-xs font-mono text-[var(--text-muted)] truncate">
              {device.device_type} · {device.ip_address}
            </p>
            {device.description && (
              <p className="text-sm text-[var(--text-muted)] mt-1 italic">{device.description}</p>
            )}
          </div>
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--beacon)] hover:bg-[var(--beacon-strong)] text-[#0A0F16] rounded-md text-sm font-medium cursor-pointer"
          >
            <Pencil size={14} /> Изменить
          </button>
          <button
            onClick={onDelete}
            aria-label="Удалить"
            title="Удалить"
            className="flex items-center justify-center px-3 py-1.5 bg-[var(--alarm)] hover:bg-[var(--alarm-strong)] text-[#0A0F16] rounded-md cursor-pointer"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Токен устройства — прошивается в железо */}
      <div className="mt-4 pt-4 border-t border-[var(--border)]">
        <label className="block text-xs text-[var(--text-muted)] mb-1.5">auth_token (прошить в устройство)</label>
        <div className="flex flex-wrap items-center gap-2">
          <code className="flex-1 min-w-[180px] text-xs text-[var(--text-soft)] bg-[var(--bg)] border border-[var(--border)] rounded-md px-3 py-2 break-all font-mono">
            {device.auth_token || "—"}
          </code>
          <button
            onClick={copyToken}
            disabled={!device.auth_token}
            aria-label="Копировать"
            title="Копировать"
            className="p-2 bg-[var(--surface-2)] hover:bg-[var(--surface-3)] rounded-md cursor-pointer disabled:opacity-50"
          >
            <Copy size={14} />
          </button>
          <button
            onClick={onRegenerateToken}
            aria-label="Перевыпустить"
            title="Перевыпустить"
            className="p-2 bg-[var(--beacon)] hover:bg-[var(--beacon-strong)] text-[#0A0F16] rounded-md cursor-pointer"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
