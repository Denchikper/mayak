// Маяк — система управления звуковыми оповещениями
// by Benovich · https://github.com/Denchikper/mayak

import { useState } from "react";
import { changeDutyPass } from "../api/users/changeDutyPass";
import Modal from "./ui/Modal";
import Button from "./ui/Button";

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
      <div className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 flex flex-col gap-4">
        <h2 className="font-display text-base font-semibold uppercase tracking-wide">
          Смена дежурного администратора
        </h2>
        <p className="text-sm text-[var(--text-muted)]">
          Выдаёт новый код доступа для следующего дежурного.
        </p>
        <Button variant="primary" full onClick={handleClick} disabled={loading}>
          {loading ? "Обновление..." : "Сменить администратора"}
        </Button>
      </div>

      <Modal isOpen={isModalOpen && !!result} onClose={() => setIsModalOpen(false)} title="Готово">
        <p className="text-sm text-[var(--text-soft)] text-center mb-4">{result?.message}</p>

        <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-lg p-4 text-center mb-6">
          <p className="text-xs text-[var(--text-muted)] mb-1 uppercase tracking-wide">Новый код доступа</p>
          <p className="text-2xl font-mono font-bold text-[var(--accent)] tracking-widest break-all">
            {result?.code}
          </p>
        </div>

        <Button variant="secondary" full onClick={() => setIsModalOpen(false)}>Закрыть</Button>
      </Modal>
    </>
  );
}
