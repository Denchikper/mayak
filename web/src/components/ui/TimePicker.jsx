import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export default function TimePicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const [h, m] = value.split(":");

  useEffect(() => {
    const handleClick = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-3 py-2 bg-[var(--input)] border border-[var(--border)] rounded-lg text-sm font-mono text-[var(--text)] hover:border-[var(--accent)] transition-colors cursor-pointer"
      >
        <span>{h}:{m}</span>
        <ChevronDown size={15} className={`text-[var(--text-muted)] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 flex w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden animate-fadeIn">
          <div className="max-h-40 overflow-y-auto w-1/2 border-r border-[var(--border)] custom-scrollbar">
            {Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0")).map((hour) => (
              <button
                key={hour}
                type="button"
                onClick={() => onChange(`${hour}:${m}`)}
                className={`w-full px-3 py-1.5 text-sm font-mono text-left transition-colors cursor-pointer ${
                  hour === h
                    ? "bg-[var(--accent)] text-[var(--accent-contrast)] font-semibold"
                    : "text-[var(--text)] hover:bg-[var(--surface-2)]"
                }`}
              >
                {hour}
              </button>
            ))}
          </div>

          <div className="max-h-40 overflow-y-auto w-1/2 custom-scrollbar">
            {["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"].map((min) => (
              <button
                key={min}
                type="button"
                onClick={() => onChange(`${h}:${min}`)}
                className={`w-full px-3 py-1.5 text-sm font-mono text-left transition-colors cursor-pointer ${
                  min === m
                    ? "bg-[var(--accent)] text-[var(--accent-contrast)] font-semibold"
                    : "text-[var(--text)] hover:bg-[var(--surface-2)]"
                }`}
              >
                {min}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
