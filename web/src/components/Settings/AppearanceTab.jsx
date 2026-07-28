// Маяк — система управления звуковыми оповещениями
// by Benovich · https://github.com/Denchikper/mayak

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function AppearanceTab() {
  const { theme, setTheme } = useTheme();

  const options = [
    { id: "dark", label: "Тёмная", icon: Moon },
    { id: "light", label: "Светлая", icon: Sun },
  ];

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 max-w-md">
      <h2 className="font-display text-base font-semibold uppercase tracking-wide mb-4">Тема оформления</h2>
      <div className="grid grid-cols-2 gap-3">
        {options.map((o) => {
          const Icon = o.icon;
          const active = theme === o.id;
          return (
            <button
              key={o.id}
              onClick={() => setTheme(o.id)}
              className={`flex items-center justify-center gap-2 py-4 rounded-lg border text-sm font-medium cursor-pointer transition-colors ${
                active
                  ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                  : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-soft)] hover:border-[var(--text-muted)]"
              }`}
            >
              <Icon size={17} /> {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
