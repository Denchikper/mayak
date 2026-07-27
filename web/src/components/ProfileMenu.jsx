import React, { useState, useRef, useEffect } from "react";
import { ChevronUp, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProfileMenu({ variant = "sidebar" }) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.username;
  const initial = (user?.firstName || user?.username || "?").charAt(0).toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      {variant === "sidebar" ? (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center gap-3 rounded-lg px-2.5 py-2 text-left hover:bg-[var(--surface-2)] transition-colors cursor-pointer"
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--surface-2)] border border-[var(--border)] font-display text-sm font-semibold text-[var(--accent)] shrink-0">
            {initial}
          </span>
          <span className="flex-1 min-w-0">
            <span className="block text-sm font-medium text-[var(--text)] truncate">{fullName}</span>
            <span className="block text-xs text-[var(--text-muted)] truncate">{user?.role}</span>
          </span>
          <ChevronUp size={16} className={`text-[var(--text-muted)] shrink-0 transition-transform ${open ? "" : "rotate-180"}`} />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Профиль"
          className="flex items-center justify-center w-9 h-9 rounded-full bg-[var(--surface-2)] border border-[var(--border)] font-display text-sm font-semibold text-[var(--accent)] cursor-pointer"
        >
          {initial}
        </button>
      )}

      {open && (
        <div
          className={`absolute z-50 w-60 bg-[var(--surface)] border border-[var(--border)] rounded-xl p-3 animate-fadeIn
            ${variant === "sidebar" ? "bottom-full left-0 mb-2" : "right-0 top-full mt-2"}`}
        >
          <p className="font-medium text-sm text-[var(--text)] truncate">{fullName}</p>
          <p className="text-xs text-[var(--text-muted)] truncate">{user?.username} · {user?.role}</p>
          <button
            onClick={logout}
            className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-[var(--border)] text-[var(--alarm)] text-sm font-medium hover:bg-[var(--alarm)]/10 transition-colors cursor-pointer"
          >
            <LogOut size={15} />
            Выйти
          </button>
        </div>
      )}
    </div>
  );
}
