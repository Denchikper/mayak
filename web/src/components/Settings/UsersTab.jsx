import React, { useEffect, useState } from "react";
import { Plus, Trash2, X, KeyRound } from "lucide-react";
import { getUsers, createUser, updateUser, deleteUser } from "../../api/users/users";
import { getRoles } from "../../api/roles/roles";
import BigSelect from "../ui/BigSelect";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import { useAuth } from "../../context/AuthContext";

const fieldClass =
  "w-full bg-[var(--input)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-colors";
const labelClass = "block text-xs text-[var(--text-soft)] mb-1.5";

const emptyForm = { username: "", password: "", last_name: "", first_name: "", second_name: "", role: "" };

export default function UsersTab({ token, logout, navigate }) {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [formOpen, setFormOpen] = useState(false);
  const [error, setError] = useState(null);
  const [resetModal, setResetModal] = useState({ isOpen: false, id: null, username: "" });
  const [resetPwd, setResetPwd] = useState("");
  const [resetError, setResetError] = useState(null);
  const [resetSaving, setResetSaving] = useState(false);

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

  function openResetPassword(u) {
    setResetError(null);
    setResetPwd("");
    setResetModal({ isOpen: true, id: u.id, username: u.username });
  }

  function closeResetPassword() {
    setResetModal({ isOpen: false, id: null, username: "" });
  }

  async function handleResetPassword(e) {
    e.preventDefault();
    setResetError(null);
    if (resetPwd.length < 4) return setResetError("Пароль слишком короткий (минимум 4 символа)");
    setResetSaving(true);
    const res = await updateUser(token, resetModal.id, { new_password: resetPwd }, logout, navigate);
    setResetSaving(false);
    if (res.ok) {
      closeResetPassword();
    } else {
      setResetError(res.data?.error || "Не удалось сменить пароль");
    }
  }

  const fullName = (u) => [u.last_name, u.first_name, u.second_name].filter(Boolean).join(" ") || "—";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-base font-semibold uppercase tracking-wide">Пользователи</h2>
        {!formOpen && (
          <Button variant="primary" size="sm" onClick={() => { setForm(emptyForm); setFormOpen(true); }}>
            <Plus size={16} /> Добавить
          </Button>
        )}
      </div>

      {formOpen && (
        <form onSubmit={handleCreate} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 sm:p-5 animate-fadeIn">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium">Новый пользователь</h3>
            <Button type="button" variant="ghost" size="sm" onClick={() => setFormOpen(false)} aria-label="Закрыть"><X size={16} /></Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><label className={labelClass}>Логин *</label><input className={fieldClass} value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} /></div>
            <div><label className={labelClass}>Пароль *</label><input className={fieldClass} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
            <div><label className={labelClass}>Фамилия</label><input className={fieldClass} value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} /></div>
            <div><label className={labelClass}>Имя</label><input className={fieldClass} value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} /></div>
            <div><label className={labelClass}>Отчество</label><input className={fieldClass} value={form.second_name} onChange={(e) => setForm({ ...form, second_name: e.target.value })} /></div>
            <div><label className={labelClass}>Роль</label><BigSelect value={form.role} onChange={(v) => setForm({ ...form, role: v })} options={roleOptions} placeholder="Выберите роль" /></div>
          </div>
          {error && <p className="text-sm text-[var(--alarm)] mt-3">{error}</p>}
          <div className="flex gap-3 mt-4">
            <Button type="submit" variant="primary">Создать</Button>
            <Button type="button" variant="secondary" onClick={() => setFormOpen(false)}>Отмена</Button>
          </div>
        </form>
      )}

      {error && !formOpen && <p className="text-sm text-[var(--alarm)]">{error}</p>}

      <div className="flex flex-col gap-2">
        {users.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)] text-center py-6">Нет пользователей</p>
        ) : (
          users.map((u) => (
            <div key={u.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-medium text-[var(--text)] truncate">{fullName(u)}</div>
                <div className="text-xs text-[var(--text-muted)]">@{u.username}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="w-44">
                  <BigSelect value={u.role} onChange={(v) => handleRoleChange(u.id, v)} options={roleOptions} />
                </div>
                <Button variant="ghost" size="sm" onClick={() => openResetPassword(u)} aria-label="Сменить пароль">
                  <KeyRound size={15} />
                </Button>
                {String(me?.userId) !== String(u.id) && (
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(u.id)} aria-label="Удалить" className="hover:text-[var(--alarm)]">
                    <Trash2 size={15} />
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={resetModal.isOpen} onClose={closeResetPassword} title="Смена пароля" maxWidth="max-w-sm">
        <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
          <p className="text-sm text-[var(--text-soft)] text-center -mt-1">
            Новый пароль для <span className="font-medium text-[var(--text)]">@{resetModal.username}</span>
          </p>
          <input
            className={fieldClass}
            type="password"
            autoFocus
            value={resetPwd}
            onChange={(e) => setResetPwd(e.target.value)}
            placeholder="••••••"
          />
          {resetError && <p className="text-sm text-[var(--alarm)] text-center">{resetError}</p>}
          <div className="flex justify-center gap-3">
            <Button type="button" variant="secondary" onClick={closeResetPassword}>Отмена</Button>
            <Button type="submit" variant="primary" disabled={resetSaving}>
              {resetSaving ? "Сохранение..." : "Сохранить"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
