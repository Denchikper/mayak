// Маяк — система управления звуковыми оповещениями
// by Benovich · https://github.com/Denchikper/mayak

import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ добавляем навигацию
import { loginUser } from "../api/auth"; // ✅ импорт API
import { useAuth } from "../context/AuthContext.jsx";
import { useEffect } from "react";
import { APP_VERSION } from "../config";

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // ✅ инициализация навигации
  const { login } = useAuth();

  useEffect(() => {
    document.title = "Вход в систему | Маяк";
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await loginUser(formData);

      if (data.token) {
        login(data.token);
      }

      navigate("/dashboard")
    } catch (err) {
      console.error("Ошибка авторизации:", err);
      setError(err.message || "Ошибка при входе");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[var(--bg)] text-[var(--text)]">
      {/* Брендовая панель */}
      <div className="flex flex-col justify-center px-8 py-10 lg:py-0 lg:w-1/2 lg:px-16 border-b lg:border-b-0 lg:border-r border-[var(--border)]">
        <div className="flex items-center gap-3 mb-4">
          <span className="beacon-dot beacon-dot--live w-3 h-3" />
          <img src="/icon.png" alt="" className="w-10 h-10 pointer-events-none select-none" draggable={false} />
          <h1 className="font-display text-2xl lg:text-3xl font-bold uppercase tracking-wide">Маяк</h1>
        </div>
        <p className="max-w-sm text-[var(--text-soft)] text-sm lg:text-base">
          Система управления звуковыми оповещениями.
        </p>
      </div>

      {/* Форма входа */}
      <main className="flex flex-1 justify-center items-center px-4 py-12">
        <div className="w-full max-w-sm">
          <h2 className="font-display text-xl font-semibold uppercase tracking-wide mb-6 text-center">Вход</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block mb-1.5 text-sm text-[var(--text-soft)]">Логин</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-lg bg-[var(--input)] border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-colors"
                placeholder="Введите логин"
                required
              />
            </div>

            <div>
              <label className="block mb-1.5 text-sm text-[var(--text-soft)]">Пароль</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-lg bg-[var(--input)] border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-colors"
                placeholder="Введите пароль"
                required
              />
            </div>

            {error && (
              <p className="text-[var(--alarm)] text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`mt-2 py-2.5 rounded-lg font-medium text-sm transition-colors cursor-pointer ${
                loading
                  ? "bg-[var(--surface-2)] text-[var(--text-muted)] cursor-not-allowed"
                  : "bg-[var(--accent)] hover:bg-[var(--accent-strong)] text-[var(--accent-contrast)]"
              }`}
            >
              {loading ? "Вход..." : "Войти"}
            </button>
          </form>

          <p className="mt-10 text-center text-xs font-mono text-[var(--text-muted)]">Версия {APP_VERSION}</p>
        </div>
      </main>
    </div>
  );
}
