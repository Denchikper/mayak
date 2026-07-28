import React from "react";
import { ChevronDown } from "lucide-react";

export default function StyledSelect({ style, options, value, onChange, placeholder }) {
  const baseClass =
    "appearance-none w-full bg-[var(--input)] text-[var(--text)] border border-[var(--border)] rounded-lg py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-colors cursor-pointer";

  return (
    <div className="relative inline-block w-full">
      <select
        className={style ? style : baseClass}
        value={value}
        onChange={onChange}
      >
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <ChevronDown size={15} className="text-[var(--text-muted)]" />
      </div>
    </div>
  );
}
