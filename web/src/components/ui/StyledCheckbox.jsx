import React from "react";

export default function StyledCheckbox({ label, checked, onChange }) {
  const toggle = () => onChange(!checked);

  return (
    <label
      className="flex items-center gap-3 cursor-pointer select-none"
      onClick={toggle}
    >
      <div
        className={`w-6 h-6 rounded-md border transition-all duration-200 flex items-center justify-center
        ${checked ? "bg-[var(--beacon)] border-[var(--beacon)]" : "bg-[var(--bg)] border-[var(--border)] hover:border-[var(--border)]"}`}
      >
        {checked && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5 text-[#0A0F16]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className="text-[var(--text-soft)]">{label}</span>
    </label>
  );
}
