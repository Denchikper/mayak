// Маяк — система управления звуковыми оповещениями
// by Benovich · https://github.com/Denchikper/mayak

import React from "react";
import { Radio, Pencil, Trash2, Copy, RefreshCw } from "lucide-react";
import Button from "../ui/Button";

export default function DeviceItem({ device, onEdit, onDelete, onRegenerateToken }) {
  const copyToken = () => {
    if (device.auth_token) navigator.clipboard?.writeText(device.auth_token);
  };

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-[var(--surface-2)] text-[var(--accent)] shrink-0">
            <Radio size={17} />
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-medium text-[var(--text)]">{device.name}</h3>
            <p className="text-xs text-[var(--text-muted)]">
              {device.device_type} · {device.ip_address}
            </p>
            {device.description && (
              <p className="text-xs text-[var(--text-muted)] mt-1">{device.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button variant="ghost" size="sm" onClick={onEdit} aria-label="Редактировать">
            <Pencil size={15} />
          </Button>
          <Button variant="ghost" size="sm" onClick={onDelete} aria-label="Удалить" className="hover:text-[var(--alarm)]">
            <Trash2 size={15} />
          </Button>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-[var(--border)]">
        <label className="block text-xs text-[var(--text-muted)] mb-1.5">auth_token (прошить в устройство)</label>
        <div className="flex flex-wrap items-center gap-2">
          <code className="flex-1 min-w-[180px] text-xs font-mono text-[var(--text-soft)] bg-[var(--input)] border border-[var(--border)] rounded-lg px-3 py-2 break-all">
            {device.auth_token || "—"}
          </code>
          <Button variant="ghost" size="sm" onClick={copyToken} disabled={!device.auth_token} aria-label="Копировать">
            <Copy size={14} />
          </Button>
          <Button variant="ghost" size="sm" onClick={onRegenerateToken} aria-label="Перевыпустить токен">
            <RefreshCw size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}
