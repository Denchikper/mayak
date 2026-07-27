import React, { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
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
    <AppLayout>
      <div className="max-w-4xl px-4 sm:px-6 lg:px-10 py-6 lg:py-10">
        <h1 className="font-display text-2xl font-bold uppercase tracking-wide mb-6">Настройки</h1>

        {/* Вкладки */}
        <div className="flex flex-wrap gap-1.5 mb-6 border-b border-[var(--border)] pb-3">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                  active === t.id
                    ? "bg-[var(--surface-2)] text-[var(--text)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]"
                }`}
              >
                <Icon size={15} /> {t.label}
              </button>
            );
          })}
        </div>

        {/* Контент */}
        <div className="animate-fadeIn">
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
    </AppLayout>
  );
}
