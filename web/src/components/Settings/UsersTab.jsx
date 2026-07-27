import React, { useEffect, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { getUsers, createUser, updateUser, deleteUser } from "../../api/users/users";
import { getRoles } from "../../api/roles/roles";
import BigSelect from "../ui/BigSelect";
import { useAuth } from "../../context/AuthContext";

const fieldClass =
  "w-full bg-[var(--input)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--beacon)] focus:border-[var(--beacon)] transition";
const labelClass = "block text-xs text-[var(--text-muted)] mb-1.5";

const emptyForm = { username: "", password: "", last_name: "", first_name: "", second_name: "", role: "" };

export default function UsersTab({ token, logout, navigate }) {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [formOpen, setFormOpen] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function load() {
    const [u, r] = await Promise.all([
      getUsers(token, logout, navigate),
      getRoles(token, logout, navigate),
    ]);
    if (u.ok) setUsers(Array.isArray(u.data) ? u.data : []);
    if (r.ok) setRoles(Array.isArray(r.data) ? r.data : []);
  }

  const roleOptions = roles.map((r) => ({ value: r.name, label: r.name }));

  async function handleCreate(e) {
    e.preventDefault();
    setError(null);
    if (!form.username.trim() || !form.password) return setError("Логин и пароль обязательны");
    const payload = { ...form, role: form.role || (roles[0]?.name ?? "user") };
    const res = await createUser(token, payload, logout, navigate);
    if (res.ok) {
      setForm(emptyForm);
      setFormOpen(false);
      await load();
    } else {
      setError(res.data?.error || "Не удалось создать пользователя");
    }
  }

  async function handleRoleChange(id, role) {
    const res = await updateUser(token, id, { role }, logout, navigate);
    if (res.ok) await load();
  }

  async function handleDelete(id) {
    const res = await deleteUser(token, id, logout, navigate);
    if (res.ok) await load();
    else setError(res.data?.error || "Не удалось удалить");
  }

  const fullName = (u) => [u.last_name, u.first_name, u.second_name].filter(Boolean).join(" ") || "—";

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Пользователи</h2>
        {!formOpen && (
          <button
            onClick={() => { setForm(emptyForm); setFormOpen(true); }}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--beacon)] hover:bg-[var(--beacon-strong)] text-[#0A0F16] text-sm font-medium cursor-pointer transition-colors"
          >
            <Plus size={18} /> Добавить
          </button>
        )}
      </div>

      {formOpen && (
        <form onSubmit={handleCreate} className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4 sm:p-5 shadow-sm animate-modalEnter">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium">Новый пользователь</h3>
            <button type="button" onClick={() => setFormOpen(false)} className="p-1.5 rounded-lg hover:bg-[var(--surface-2)] text-[var(--text-muted)] cursor-pointer"><X size={18} /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><label className={labelClass}>Логин *</label><input className={fieldClass} value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} /></div>
            <div><label className={labelClass}>Пароль *</label><input className={fieldClass} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
            <div><label className={labelClass}>Фамилия</label><input className={fieldClass} value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} /></div>
            <div><label className={labelClass}>Имя</label><input className={fieldClass} value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} /></div>
            <div><label className={labelClass}>Отчество</label><input className={fieldClass} value={form.second_name} onChange={(e) => setForm({ ...form, second_name: e.target.value })} /></div>
            <div><label className={labelClass}>Роль</label><BigSelect value={form.role} onChange={(v) => setForm({ ...form, role: v })} options={roleOptions} placeholder="Выберите роль" /></div>
          </div>
          {error && <p className="text-[var(--alarm)] text-sm mt-3">{error}</p>}
          <div className="flex gap-3 mt-4">
            <button type="submit" className="px-4 py-2 rounded-lg bg-[var(--beacon)] hover:bg-[var(--beacon-strong)] text-[#0A0F16] text-sm font-medium cursor-pointer">Создать</button>
            <button type="button" onClick={() => setFormOpen(false)} className="px-4 py-2 rounded-lg bg-[var(--surface-2)] hover:bg-[var(--surface-3)] text-sm cursor-pointer">Отмена</button>
          </div>
        </form>
      )}

      {error && !formOpen && <p className="text-[var(--alarm)] text-sm">{error}</p>}

      <div className="space-y-2">
        {users.length === 0 ? (
          <p className="text-[var(--text-muted)] text-center py-6">Нет пользователей</p>
        ) : (
          users.map((u) => (
            <div key={u.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-md p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="min-w-0">
                <div className="font-medium text-[var(--text)] truncate">{fullName(u)}</div>
                <div className="text-sm text-[var(--text-muted)]">@{u.username}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="w-44">
                  <BigSelect value={u.role} onChange={(v) => handleRoleChange(u.id, v)} options={roleOptions} />
                </div>
                {String(me?.userId) !== String(u.id) && (
                  <button onClick={() => handleDelete(u.id)} title="Удалить" className="p-2 rounded-lg bg-[var(--alarm)]/15 text-[var(--alarm)] hover:bg-[var(--alarm)]/25 cursor-pointer transition-colors">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
