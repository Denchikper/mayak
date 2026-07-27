import React, { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, X, Lock } from "lucide-react";
import { getRoles, createRole, updateRole, deleteRole } from "../../api/roles/roles";
import { getPermissionCatalog } from "../../api/permissions/permissions";
import { useAuth } from "../../context/AuthContext";

const fieldClass =
  "w-full bg-[var(--input)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--beacon)] focus:border-[var(--beacon)] transition";

export default function RolesTab({ token, logout, navigate }) {
  const { refreshPermissions } = useAuth();
  const [roles, setRoles] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [editing, setEditing] = useState(null); // {id?, name, permissions:[]}
  const [error, setError] = useState(null);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function load() {
    const [r, c] = await Promise.all([
      getRoles(token, logout, navigate),
      getPermissionCatalog(token, logout, navigate),
    ]);
    if (r.ok) setRoles(Array.isArray(r.data) ? r.data : []);
    if (c.ok) setCatalog(Array.isArray(c.data) ? c.data : []);
  }

  // группы каталога по полю group
  const groups = catalog.reduce((acc, item) => {
    (acc[item.group] = acc[item.group] || []).push(item);
    return acc;
  }, {});

  function startCreate() {
    setError(null);
    setEditing({ name: "", permissions: [] });
  }
  function startEdit(role) {
    setError(null);
    setEditing({ id: role.id, name: role.name, permissions: [...(role.permissions || [])] });
  }

  function togglePerm(key) {
    setEditing((e) => ({
      ...e,
      permissions: e.permissions.includes(key)
        ? e.permissions.filter((p) => p !== key)
        : [...e.permissions, key],
    }));
  }

  async function handleSave() {
    if (!editing.name.trim()) return setError("Введите название роли");
    const payload = { name: editing.name.trim(), permissions: editing.permissions };
    const res = editing.id
      ? await updateRole(token, editing.id, payload, logout, navigate)
      : await createRole(token, payload, logout, navigate);
    if (res.ok) {
      setEditing(null);
      await load();
      refreshPermissions?.();
    } else {
      setError(res.data?.error || "Не удалось сохранить роль");
    }
  }

  async function handleDelete(role) {
    const res = await deleteRole(token, role.id, logout, navigate);
    if (res.ok) await load();
    else setError(res.data?.error || "Не удалось удалить роль");
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Роли и доступы</h2>
        {!editing && (
          <button onClick={startCreate} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--beacon)] hover:bg-[var(--beacon-strong)] text-[#0A0F16] text-sm font-medium cursor-pointer transition-colors">
            <Plus size={18} /> Новая роль
          </button>
        )}
      </div>

      {error && <p className="text-[var(--alarm)] text-sm">{error}</p>}

      {/* Редактор */}
      {editing && (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4 sm:p-5 shadow-sm animate-modalEnter">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium">{editing.id ? "Редактирование роли" : "Новая роль"}</h3>
            <button onClick={() => setEditing(null)} className="p-1.5 rounded-lg hover:bg-[var(--surface-2)] text-[var(--text-muted)] cursor-pointer"><X size={18} /></button>
          </div>

          <label className="block text-xs text-[var(--text-muted)] mb-1.5">Название роли</label>
          <input className={`${fieldClass} max-w-xs mb-5`} value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="например: operator" />

          {Object.entries(groups).map(([group, items]) => (
            <div key={group} className="mb-4">
              <div className="text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2">{group}</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {items.map((item) => (
                  <label key={item.key} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-[var(--surface-2)] cursor-pointer hover:bg-[var(--surface-3)] transition-colors">
                    <input type="checkbox" className="accent-[var(--beacon)] w-4 h-4" checked={editing.permissions.includes(item.key)} onChange={() => togglePerm(item.key)} />
                    <span className="text-sm text-[var(--text)]">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="flex gap-3 mt-2">
            <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-[var(--beacon)] hover:bg-[var(--beacon-strong)] text-[#0A0F16] text-sm font-medium cursor-pointer">Сохранить</button>
            <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-lg bg-[var(--surface-2)] hover:bg-[var(--surface-3)] text-sm cursor-pointer">Отмена</button>
          </div>
        </div>
      )}

      {/* Список ролей */}
      <div className="space-y-2">
        {roles.map((role) => (
          <div key={role.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-md p-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="font-medium text-[var(--text)] flex items-center gap-2">
                {role.name}
                {role.is_system && <span className="inline-flex items-center gap-1 text-[11px] text-[var(--text-muted)]"><Lock size={12} /> системная</span>}
              </div>
              <div className="text-sm text-[var(--text-muted)]">
                {role.is_system ? "Полный доступ" : `Прав: ${(role.permissions || []).length}`}
              </div>
            </div>
            {!role.is_system && (
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => startEdit(role)} title="Редактировать" className="p-2 rounded-lg bg-[var(--surface-2)] hover:bg-[var(--surface-3)] text-[var(--text-soft)] cursor-pointer transition-colors"><Pencil size={16} /></button>
                <button onClick={() => handleDelete(role)} title="Удалить" className="p-2 rounded-lg bg-[var(--alarm)]/15 text-[var(--alarm)] hover:bg-[var(--alarm)]/25 cursor-pointer transition-colors"><Trash2 size={16} /></button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
