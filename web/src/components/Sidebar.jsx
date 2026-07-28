import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Siren,
  CalendarClock,
  Radio,
  Settings as SettingsIcon,
  Sun,
  Moon,
  Menu,
  X,
} from "lucide-react";
import ProfileMenu from "./ProfileMenu";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { label: "Дашборд", path: "/dashboard", perm: "section:dashboard", icon: LayoutDashboard },
  { label: "Тревоги", path: "/alarms", perm: "section:alarms", icon: Siren },
  { label: "Оповещения", path: "/plannedalerts", perm: "section:plannedalerts", icon: CalendarClock },
  { label: "Устройства", path: "/devices", perm: "section:devices", icon: Radio },
  { label: "Настройки", path: "/settings", perm: "section:settings", icon: SettingsIcon },
];

function Logo() {
  return (
    <div className="flex items-center gap-2.5 select-none pointer-events-none" draggable={false}>
      <img src="/icon.png" alt="" className="w-8 h-8 pointer-events-none select-none" draggable={false} />
      <span className="font-display text-lg font-bold uppercase tracking-wide text-[var(--text)]">Маяк</span>
    </div>
  );
}

function NavList({ items, activePath, onNavigate }) {
  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const Icon = item.icon;
        const active = activePath === item.path;
        return (
          <button
            key={item.path}
            onClick={() => onNavigate(item.path)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer text-left
              ${active
                ? "bg-[var(--accent)]/10 text-[var(--text)]"
                : "text-[var(--text-soft)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]"}`}
          >
            <Icon size={18} className={active ? "text-[var(--accent)]" : "text-[var(--text-muted)]"} />
            {item.label}
            {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />}
          </button>
        );
      })}
    </nav>
  );
}

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
      {/* Десктоп: постоянная боковая панель */}
      <aside className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:left-0 md:w-60 md:border-r md:border-[var(--border)] md:bg-[var(--bg)] md:z-30">
        <div className="px-4 py-5">
          <Logo />
        </div>
        <div className="flex-1 px-3 overflow-y-auto custom-scrollbar">
          <NavList items={items} activePath={location.pathname} onNavigate={go} />
        </div>
        <div className="px-3 py-4 border-t border-[var(--border)] flex flex-col gap-2">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium text-[var(--text-soft)] hover:bg-[var(--surface-2)] hover:text-[var(--text)] transition-colors cursor-pointer"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            {theme === "dark" ? "Светлая тема" : "Тёмная тема"}
          </button>
          <ProfileMenu variant="sidebar" />
        </div>
      </aside>

      {/* Мобиль: верхняя панель + выдвижное меню */}
      <div className="md:hidden sticky top-0 z-40 bg-[var(--bg)] border-b border-[var(--border)]">
        <div className="flex items-center justify-between px-4 py-3">
          <Logo />
          <div className="flex items-center gap-1">
            <button
              onClick={toggleTheme}
              aria-label="Переключить тему"
              className="p-2 rounded-lg text-[var(--text-soft)] hover:bg-[var(--surface-2)] cursor-pointer"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <ProfileMenu variant="compact" />
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label="Меню"
              className="p-2 rounded-lg text-[var(--text)] hover:bg-[var(--surface-2)] cursor-pointer"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {open && (
          <div className="border-t border-[var(--border)] px-3 py-3 animate-fadeIn">
            <NavList items={items} activePath={location.pathname} onNavigate={go} />
          </div>
        )}
      </div>
    </>
  );
}
