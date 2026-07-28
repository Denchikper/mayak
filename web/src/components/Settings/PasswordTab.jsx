// Маяк — система управления звуковыми оповещениями
// by Benovich · https://github.com/Denchikper/mayak

import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { changeMyPassword } from "../../api/users/users";
import Button from "../ui/Button";

const fieldClass =
  "w-full bg-[var(--input)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-colors";
const labelClass = "block text-xs text-[var(--text-soft)] mb-1.5";

export default function PasswordTab({ token, logout, navigate }) {
  const { user } = useAuth();
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg(null); setErr(null);
    if (pwd.length < 4) return setErr("Пароль слишком короткий (минимум 4 символа)");
    if (pwd !== confirm) return setErr("Пароли не совпадают");

    setSaving(true);
    const res = await changeMyPassword(token, user.username, pwd, logout, navigate);
    setSaving(false);
    if (res.ok) {
      setMsg("Пароль обновлён");
      setPwd(""); setConfirm("");
    } else {
      setErr(res.data?.message || res.data?.error || "Не удалось изменить пароль");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 max-w-md flex flex-col gap-4">
      <h2 className="font-display text-base font-semibold uppercase tracking-wide">Смена пароля</h2>

      <div>
        <label className={labelClass}>Новый пароль</label>
        <input className={fieldClass} type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="••••••" />
      </div>
      <div>
        <label className={labelClass}>Повторите пароль</label>
        <input className={fieldClass} type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••" />
      </div>

      {err && <p className="text-sm text-[var(--alarm)]">{err}</p>}
      {msg && <p className="text-sm text-[var(--safe)]">{msg}</p>}

      <Button type="submit" variant="primary" disabled={saving} className="self-start">
        {saving ? "Сохранение..." : "Сменить пароль"}
      </Button>
    </form>
  );
}
