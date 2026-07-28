// Маяк — система управления звуковыми оповещениями
// by Benovich · https://github.com/Denchikper/mayak

import React from "react";
import Modal from "./ui/Modal";
import Button from "./ui/Button";

export default function ConfirmActivateModal({ isOpen, onClose, onConfirm, alarmName }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Активация тревоги">
      <p className="text-[var(--text-soft)] text-sm text-center mb-6">
        Вы уверены, что хотите активировать тревогу{" "}
        <span className="text-[var(--alarm)] font-semibold">«{alarmName}»</span>?
      </p>

      <div className="flex justify-center gap-3">
        <Button variant="secondary" onClick={onClose}>Отмена</Button>
        <Button variant="primary" onClick={onConfirm}>Активировать</Button>
      </div>
    </Modal>
  );
}
