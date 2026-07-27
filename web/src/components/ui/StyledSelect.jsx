import React from "react";

export default function StyledSelect({ style, options, value, onChange, placeholder }) {
  // базовый класс
  const baseClass = "appearance-none w-full bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[var(--beacon)] focus:border-[var(--beacon)] transition-all duration-200";

  return (
    <div className="relative inline-block w-full">
      <select
        className={style ? style : baseClass} // если есть style — используем его, иначе базовый
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

      {/* Стрелка — смещена влево */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-[var(--text-muted)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </div>
  );
}
