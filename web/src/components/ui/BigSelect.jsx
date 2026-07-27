import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";

// Кастомный выпадающий список с крупными строками (нативный <select> не даёт управлять высотой опций).
export default function BigSelect({ value, onChange, options, placeholder = "Выберите", disabled = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const selected = options.find((o) => String(o.value) === String(value));

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-2 bg-[var(--input)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-left text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--beacon)] focus:border-[var(--beacon)] transition disabled:opacity-50 cursor-pointer"
      >
        <span className={selected ? "" : "text-[var(--text-muted)]"}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-[var(--text-muted)] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-30 mt-2 w-full max-h-72 overflow-y-auto bg-[var(--surface)] border border-[var(--border)] rounded-md shadow-xl py-1 custom-scrollbar animate-fadeIn">
          {options.length === 0 ? (
            <div className="px-3 py-2.5 text-sm text-[var(--text-muted)]">Список пуст</div>
          ) : (
            options.map((o) => {
              const active = String(o.value) === String(value);
              return (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => {
                    onChange(o.value);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center justify-between gap-2 text-left px-3 py-2.5 text-sm cursor-pointer transition-colors ${
                    active
                      ? "bg-[var(--beacon)]/15 text-[var(--beacon)]"
                      : "text-[var(--text)] hover:bg-[var(--surface-2)]"
                  }`}
                >
                  <span>{o.label}</span>
                  {active && <Check size={16} className="shrink-0" />}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
