import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ добавляем навигацию
import { loginUser } from "../api/auth"; // ✅ импорт API
import { useAuth } from "../context/AuthContext.jsx";
import { useEffect } from "react";

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
    <div className="flex flex-col lg:flex-row h-screen bg-[var(--bg)] text-[var(--text)]">
      {/* Брендовая панель */}
      <div className="relative flex flex-col justify-center items-start px-8 py-8 lg:py-0 lg:w-1/2 overflow-hidden border-b lg:border-b-0 lg:border-r border-[var(--border)]">
        <div
          aria-hidden="true"
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-25 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, var(--beacon), transparent 70%)" }}
        />
        <div className="relative flex items-center gap-3 mb-4 lg:mb-8">
          <span className="beacon-pulse beacon-pulse--idle">
            <img
              src="/icon.png"
              alt="Маяк"
              className="relative w-12 h-12 pointer-events-none select-none"
              draggable={false}
            />
          </span>
          <h1 className="font-display text-2xl lg:text-3xl font-bold tracking-wide uppercase text-[var(--text)]">
            Маяк
          </h1>
        </div>
        <p className="relative max-w-sm text-[var(--text-soft)] text-sm lg:text-base">
          Система управления звуковыми оповещениями.
        </p>
      </div>

      {/* Форма входа */}
      <main className="flex flex-1 justify-center items-center px-4 py-10">
        <div className="w-full max-w-sm">
          <h2 className="font-display text-xl font-semibold mb-6 text-center uppercase tracking-wide">
            Вход
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <div>
              <label className="block mb-1 text-sm text-[var(--text-soft)]">Логин</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md bg-[var(--input)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--beacon)]"
                placeholder="Введите логин"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm text-[var(--text-soft)]">Пароль</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md bg-[var(--input)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--beacon)]"
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
              className={`mt-4 py-2 rounded-md font-medium transition ${
                loading
                  ? "bg-[var(--surface-3)] text-[var(--text-muted)] cursor-not-allowed"
                  : "bg-[var(--beacon)] hover:bg-[var(--beacon-strong)] text-[#0A0F16]"
              }`}
            >
              {loading ? "Вход..." : "Войти"}
            </button>
          </form>

          <p className="mt-8 text-center text-xs font-mono text-[var(--text-muted)]">
            Версия 1.0.0
          </p>
        </div>
      </main>
    </div>
  );
}
