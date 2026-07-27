import React, { useState, useRef, useEffect } from "react";
import { LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx"; // если используешь AuthContext

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth(); // предполагаем, что в контексте есть user и logout
  const menuRef = useRef(null);

  // Закрытие при клике вне блока
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initial = (user?.firstName || user?.username || "?").charAt(0).toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      {/* Аватар */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Профиль"
        aria-expanded={open}
        className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer select-none
             font-display font-bold text-sm
             bg-[var(--beacon)] text-[#0A0F16]
             transition-all duration-200
             hover:bg-[var(--beacon-strong)] hover:scale-105
             ring-2 ring-transparent focus:outline-none focus:ring-[var(--beacon)]"
      >
        {initial}
      </button>

      {/* Попап меню */}
      {open && (
        <div
          className="absolute right-0 mt-3 w-64 origin-top-right
                     bg-[var(--surface)] border border-[var(--border)] rounded-lg
                     shadow-[0_16px_40px_-8px_rgba(0,0,0,0.45)]
                     text-[var(--text)] z-50 overflow-hidden animate-fadeIn"
        >
          <div className="p-4 text-center">
            <p className="font-semibold">{user?.firstName} {user?.secondName} {user?.lastName}</p>
            <p className="text-sm text-[var(--text-muted)] mt-1">Логин: {user?.username}</p>
            <p className="text-sm text-[var(--text-muted)]">Роль: {user?.role}</p>
          </div>
          <div className="border-t border-[var(--border)] p-3">
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 py-2 bg-[var(--alarm)] hover:bg-[var(--alarm-strong)] rounded-md text-[#0A0F16] font-medium transition cursor-pointer"
            >
              <LogOut size={16} />
              Выйти
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
