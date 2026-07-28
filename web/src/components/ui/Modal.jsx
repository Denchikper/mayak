// Маяк — система управления звуковыми оповещениями
// by Benovich · https://github.com/Denchikper/mayak

import React from "react";

export default function Modal({ isOpen, onClose, title, tone = "default", maxWidth = "max-w-sm", children }) {
  if (!isOpen) return null;

  const titleColor =
    tone === "danger" ? "text-[var(--alarm)]" : "text-[var(--text)]";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#05070A]/70 px-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        className={`w-full ${maxWidth} bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 animate-modalEnter`}
      >
        {title && (
          <h2 className={`font-display text-lg font-semibold uppercase tracking-wide text-center mb-3 ${titleColor}`}>
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  );
}
