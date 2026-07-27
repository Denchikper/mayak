import React from "react";

export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm, deviceName }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6 w-full max-w-sm shadow-xl animate-fadeIn">
        <h2 className="font-display uppercase tracking-wide text-xl font-semibold text-center mb-3">Удалить устройство</h2>
        <p className="text-[var(--text-soft)] text-center mb-6">
          Вы уверены, что хотите удалить устройство{" "}
          <span className="text-[var(--alarm)] font-semibold">"{deviceName}"</span>?
        </p>

        {/* Кнопки теперь по центру */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-md bg-[var(--surface-2)] hover:bg-[var(--surface-3)] transition text-sm font-medium"
          >
            Отмена
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-md bg-[var(--alarm)] hover:bg-[var(--alarm-strong)] text-[#0A0F16] transition text-sm font-medium"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
}
