import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User, KeyRound, Palette, Users, Shield, ScrollText } from "lucide-react";
import ProfileTab from "../components/Settings/ProfileTab.jsx";
import PasswordTab from "../components/Settings/PasswordTab.jsx";
import AppearanceTab from "../components/Settings/AppearanceTab.jsx";
import UsersTab from "../components/Settings/UsersTab.jsx";
import RolesTab from "../components/Settings/RolesTab.jsx";
import LogsTab from "../components/Settings/LogsTab.jsx";

export default function SettingsPage() {
  const { token, logout, can } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("profile");

  useEffect(() => {
    document.title = "Настройки | Маяк";
  }, []);

  const tabs = [
    { id: "profile", label: "Профиль", icon: User, show: true },
    { id: "password", label: "Пароль", icon: KeyRound, show: true },
    { id: "appearance", label: "Тема", icon: Palette, show: true },
    { id: "users", label: "Пользователи", icon: Users, show: can("block:settings.users") },
    { id: "roles", label: "Роли и доступы", icon: Shield, show: can("block:settings.roles") },
    { id: "logs", label: "Журнал", icon: ScrollText, show: can("block:settings.logs") },
  ].filter((t) => t.show);

  const active = tabs.find((t) => t.id === tab) ? tab : "profile";

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <Navbar />
      <div className="max-w-5xl mx-auto mt-6 sm:mt-8 px-4 sm:px-6 pb-10">
        <h1 className="font-display uppercase tracking-wide text-xl sm:text-2xl font-semibold mb-5">Настройки</h1>

        {/* Вкладки */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                  active === t.id
                    ? "bg-[var(--beacon)] text-[#0A0F16]"
                    : "bg-[var(--surface-2)] text-[var(--text-soft)] hover:bg-[var(--surface-3)]"
                }`}
              >
                <Icon size={16} /> {t.label}
              </button>
            );
          })}
        </div>

        {/* Контент */}
        <div className="animate-modalEnter">
          {active === "profile" && <ProfileTab />}
          {active === "password" && <PasswordTab token={token} logout={logout} navigate={navigate} />}
          {active === "appearance" && <AppearanceTab />}
          {active === "users" && can("block:settings.users") && (
            <UsersTab token={token} logout={logout} navigate={navigate} />
          )}
          {active === "roles" && can("block:settings.roles") && (
            <RolesTab token={token} logout={logout} navigate={navigate} />
          )}
          {active === "logs" && can("block:settings.logs") && (
            <LogsTab token={token} logout={logout} navigate={navigate} />
          )}
        </div>
      </div>
    </div>
  );
}
