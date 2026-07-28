// Маяк — система управления звуковыми оповещениями
// by Benovich · https://github.com/Denchikper/mayak

import React from "react";

const VARIANTS = {
  primary:
    "bg-[var(--accent)] text-[var(--accent-contrast)] hover:bg-[var(--accent-strong)]",
  secondary:
    "bg-transparent text-[var(--text)] border border-[var(--border)] hover:bg-[var(--surface-2)]",
  danger:
    "bg-transparent text-[var(--alarm)] border border-[var(--alarm)]/40 hover:bg-[var(--alarm)]/10",
  dangerSolid:
    "bg-[var(--alarm)] text-white hover:bg-[var(--alarm-strong)]",
  ghost:
    "bg-transparent text-[var(--text-soft)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]",
};

const SIZES = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-5 py-3 text-base",
};

export default function Button({
  variant = "primary",
  size = "md",
  full = false,
  className = "",
  disabled = false,
  children,
  ...props
}) {
  return (
    <button
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium
        transition-colors duration-150 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${VARIANTS[variant]} ${SIZES[size]} ${full ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
