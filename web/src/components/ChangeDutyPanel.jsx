import { useState } from "react";
import { changeDutyPass } from "../api/users/changeDutyPass";

export default function ChangeDutyPanel({ token, logout, navigate }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await changeDutyPass(token, logout, navigate);
      if (res?.ok) {
        setResult(res.data);
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error("Ошибка при изменении пароля duty_officer:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* PANEL */}
      <div
        className="
          w-full
          max-w-sm
          sm:max-w-md
          lg:max-w-sm
          bg-[var(--surface)]
          border border-[var(--border)]
          rounded-lg
          p-5 sm:p-6
          shadow-xl
          flex flex-col
          gap-5
          transition-all
        "
      >
        <h2 className="font-display uppercase tracking-wide text-base sm:text-lg font-semibold text-[var(--text)] text-center">
          Смена дежурного администратора
        </h2>

        <button
          onClick={handleClick}
          disabled={loading}
          className="
            w-full py-3
            rounded-md
            bg-[var(--beacon)]
            hover:bg-[var(--beacon-strong)]
            text-[#0A0F16] font-semibold text-sm
            transition-all duration-300
            disabled:opacity-60 disabled:cursor-not-allowed
            hover:scale-[1.02]
          "
        >
          {loading ? "Обновление..." : "Сменить администратора"}
        </button>
      </div>

      {/* MODAL */}
      {isModalOpen && result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-3">
          <div
            className="
              w-full
              max-w-sm
              bg-[var(--surface)]
              border border-[var(--border)]
              rounded-lg
              p-5 sm:p-6
              shadow-2xl
              animate-modalEnter
            "
          >
            <h3 className="font-display uppercase tracking-wide text-base sm:text-lg font-semibold text-[var(--text)] text-center mb-4">
              Готово
            </h3>

            <p className="text-sm text-[var(--text-soft)] text-center mb-4">
              {result.message}
            </p>

            <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-md p-4 text-center mb-6">
              <p className="text-xs text-[var(--text-muted)] mb-1">
                Новый код доступа
              </p>
              <p className="text-xl sm:text-2xl font-mono font-bold text-[var(--beacon)] tracking-widest break-all">
                {result.code}
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(false)}
              className="
                w-full py-2 rounded-md
                bg-[var(--surface-2)] hover:bg-[var(--surface-3)]
                text-[var(--text)] font-semibold text-sm
                transition-all
              "
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </>
  );
}
