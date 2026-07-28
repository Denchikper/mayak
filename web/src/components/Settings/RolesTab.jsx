// Маяк — система управления звуковыми оповещениями
// by Benovich · https://github.com/Denchikper/mayak

import React, { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, X, Lock } from "lucide-react";
import { getRoles, createRole, updateRole, deleteRole } from "../../api/roles/roles";
import { getPermissionCatalog } from "../../api/permissions/permissions";
import { useAuth } from "../../context/AuthContext";
import StyledCheckbox from "../ui/StyledCheckbox";
import Button from "../ui/Button";

const fieldClass =
  "w-full bg-[var(--input)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-colors";

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
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-base font-semibold uppercase tracking-wide">Роли и доступы</h2>
        {!editing && (
          <Button variant="primary" size="sm" onClick={startCreate}>
            <Plus size={16} /> Новая роль
          </Button>
        )}
      </div>

      {error && <p className="text-sm text-[var(--alarm)]">{error}</p>}

      {/* Редактор */}
      {editing && (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 sm:p-5 animate-fadeIn">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium">{editing.id ? "Редактирование роли" : "Новая роль"}</h3>
            <Button variant="ghost" size="sm" onClick={() => setEditing(null)} aria-label="Закрыть"><X size={16} /></Button>
          </div>

          <label className="block text-xs text-[var(--text-soft)] mb-1.5">Название роли</label>
          <input className={`${fieldClass} max-w-xs mb-5`} value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="например: operator" />

          {Object.entries(groups).map(([group, items]) => (
            <div key={group} className="mb-4">
              <div className="text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2">{group}</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {items.map((item) => (
                  <div key={item.key} className="px-3 py-2.5 rounded-lg bg-[var(--surface-2)] hover:bg-[var(--bg)] transition-colors">
                    <StyledCheckbox
                      label={item.label}
                      checked={editing.permissions.includes(item.key)}
                      onChange={() => togglePerm(item.key)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="flex gap-3 mt-2">
            <Button variant="primary" onClick={handleSave}>Сохранить</Button>
            <Button variant="secondary" onClick={() => setEditing(null)}>Отмена</Button>
          </div>
        </div>
      )}

      {/* Список ролей */}
      <div className="flex flex-col gap-2">
        {roles.map((role) => (
          <div key={role.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-sm font-medium text-[var(--text)] flex items-center gap-2">
                {role.name}
                {role.is_system && <span className="inline-flex items-center gap-1 text-[11px] text-[var(--text-muted)]"><Lock size={11} /> системная</span>}
              </div>
              <div className="text-xs text-[var(--text-muted)]">
                {role.is_system ? "Полный доступ" : `Прав: ${(role.permissions || []).length}`}
              </div>
            </div>
            {!role.is_system && (
              <div className="flex items-center gap-1 shrink-0">
                <Button variant="ghost" size="sm" onClick={() => startEdit(role)} aria-label="Редактировать"><Pencil size={15} /></Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(role)} aria-label="Удалить" className="hover:text-[var(--alarm)]"><Trash2 size={15} /></Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
