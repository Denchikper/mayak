import React from "react";
import { useAuth } from "../../context/AuthContext";

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4 py-2.5 border-b border-[var(--border)] last:border-0">
      <span className="text-sm text-[var(--text-muted)]">{label}</span>
      <span className="text-sm text-[var(--text)] font-medium text-right break-all">{value || "—"}</span>
    </div>
  );
}

export default function ProfileTab() {
  const { user } = useAuth();
  const fullName = [user?.lastName, user?.firstName, user?.secondName].filter(Boolean).join(" ");

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-5 shadow-sm max-w-xl">
      <h2 className="text-base font-semibold mb-4">Профиль</h2>
      <Row label="ФИО" value={fullName} />
      <Row label="Логин" value={user?.username} />
      <Row label="Роль" value={user?.role} />
      <Row label="ID" value={user?.userId} />
    </div>
  );
}
