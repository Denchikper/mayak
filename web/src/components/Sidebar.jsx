import React, { useState } from "react";
import ProfileMenu from "./ProfileMenu";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Sun,
  Moon,
  LayoutDashboard,
  Siren,
  CalendarClock,
  Radio,
  Settings as SettingsIcon,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { label: "Главная", path: "/dashboard", perm: "section:dashboard", icon: LayoutDashboard },
  { label: "Тревоги", path: "/alarms", perm: "section:alarms", icon: Siren },
  { label: "Запланированные оповещения", path: "/plannedalerts", perm: "section:plannedalerts", icon: CalendarClock },
  { label: "Устройства", path: "/devices", perm: "section:devices", icon: Radio },
  { label: "Настройки", path: "/settings", perm: "section:settings", icon: SettingsIcon },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { can } = useAuth();
  const [open, setOpen] = useState(false);

  const items = NAV_ITEMS.filter((item) => can(item.perm));

  const go = (path) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <>
      {/* Мобильная верхняя полоса */}
      <div className="lg:hidden flex items-center justify-between px-4 py-2 bg-[var(--surface)] border-b border-[var(--border)] select-none">
        <div className="flex items-center gap-2 pointer-events-none select-none" draggable={false}>
          <img src="/icon.png" alt="Маяк" className="w-8 h-8" draggable={false} />
          <span className="font-display uppercase tracking-wide font-bold text-[var(--text)]">Маяк</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            className="p-2 rounded-lg hover:bg-[var(--surface-2)] text-[var(--text-soft)] hover:text-[var(--text)] cursor-pointer transition-colors"
            onClick={toggleTheme}
            aria-label="Переключить тему"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <ProfileMenu placement="down" />
          <button
            className="p-2 rounded-lg hover:bg-[var(--surface-2)] text-[var(--text)] cursor-pointer"
            onClick={() => setOpen((v) => !v)}
            aria-label="Меню"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="lg:hidden border-b border-[var(--border)] bg-[var(--surface)] px-3 py-2 flex flex-col gap-1 animate-fadeIn">
          {items.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => go(item.path)}
                className={`flex items-center gap-3 py-2.5 px-3 rounded-md text-left font-medium transition-colors cursor-pointer ${
                  active
                    ? "text-[var(--beacon)] bg-[var(--beacon)]/12"
                    : "text-[var(--text-soft)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>
      )}

      {/* Десктопный сайдбар */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 bg-[var(--surface)] border-r border-[var(--border)] select-none">
        <div className="flex items-center gap-3 px-5 py-5 border-b border-[var(--border)] pointer-events-none" draggable={false}>
          <img src="/icon.png" alt="Маяк" className="w-9 h-9" draggable={false} />
          <span className="font-display uppercase tracking-wide text-lg font-bold text-[var(--text)]">Маяк</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar-2">
          {items.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer border-l-2 ${
                  active
                    ? "bg-[var(--beacon)]/12 text-[var(--beacon)] border-[var(--beacon)]"
                    : "text-[var(--text-soft)] border-transparent hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
                }`}
              >
                <Icon size={18} className="shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="border-t border-[var(--border)] px-3 py-3 flex items-center justify-between">
          <ProfileMenu placement="up" />
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-[var(--surface-2)] text-[var(--text-soft)] hover:text-[var(--text)] cursor-pointer transition-colors"
            aria-label="Переключить тему"
            title={theme === "dark" ? "Светлая тема" : "Тёмная тема"}
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </aside>
    </>
  );
}
