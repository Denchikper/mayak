// Маяк — система управления звуковыми оповещениями
// by Benovich · https://github.com/Denchikper/mayak

import React from "react";
import Modal from "../../../ui/Modal";
import Button from "../../../ui/Button";

export default function ConfirmDeleteScheduleModal({ isOpen, onClose, onConfirm, scheduleName }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Удалить расписание">
      <p className="text-sm text-[var(--text-soft)] text-center mb-6">
        Вы уверены, что хотите удалить расписание{" "}
        <span className="text-[var(--alarm)] font-semibold">«{scheduleName.name}»</span>?
      </p>

      <div className="flex justify-center gap-3">
        <Button variant="secondary" onClick={onClose}>Отмена</Button>
        <Button variant="dangerSolid" onClick={onConfirm}>Удалить</Button>
      </div>
    </Modal>
  );
}
