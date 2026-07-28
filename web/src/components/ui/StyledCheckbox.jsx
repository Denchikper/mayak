// Маяк — система управления звуковыми оповещениями
// by Benovich · https://github.com/Denchikper/mayak

import React from "react";
import { Check } from "lucide-react";

export default function StyledCheckbox({ label, checked, onChange }) {
  const toggle = () => onChange(!checked);

  return (
    <label className="flex items-center gap-2.5 cursor-pointer select-none" onClick={toggle}>
      <span
        className={`flex items-center justify-center w-5 h-5 rounded-md border transition-colors shrink-0
          ${checked ? "bg-[var(--accent)] border-[var(--accent)]" : "bg-[var(--input)] border-[var(--border)]"}`}
      >
        {checked && <Check size={13} strokeWidth={3} className="text-[var(--accent-contrast)]" />}
      </span>
      <span className="text-sm text-[var(--text-soft)]">{label}</span>
    </label>
  );
}
