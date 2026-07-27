import React, { useState, useRef, useEffect } from "react";
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

  return (
    <div className="relative">
      {/* Иконка профиля */}
      <img
        src="/profile-icon.png"
        alt="profile"
        className="w-8 h-8 rounded-full cursor-pointer select-none
             transition-all duration-200
             hover:brightness-125 hover:scale-105"
        draggable={false}
        onClick={() => setOpen((prev) => !prev)}
      />

      {/* Попап меню */}
      {open && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-2 w-64 bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-lg p-4 text-[var(--text)] z-50"
        >
          <p className="font-semibold text-center">{user?.firstName} {user?.secondName} {user?.lastName}</p>
          <p className="text-sm text-[var(--text-muted)] mt-1 text-center">Логин: {user?.username}</p>
          <p className="text-sm text-[var(--text-muted)] text-center">Роль: {user?.role}</p>
          <button
            onClick={logout}
            className="mt-4 w-full py-1 bg-[var(--alarm)] hover:bg-[var(--alarm-strong)] rounded-md text-[#0A0F16] font-medium transition cursor-pointer"
          >
            Выйти
          </button>
        </div>
      )}
    </div>
  );
}
