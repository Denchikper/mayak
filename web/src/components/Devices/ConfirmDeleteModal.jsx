// Маяк — система управления звуковыми оповещениями
// by Benovich · https://github.com/Denchikper/mayak

import React from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";

export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm, deviceName }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Удалить устройство">
      <p className="text-sm text-[var(--text-soft)] text-center mb-6">
        Вы уверены, что хотите удалить устройство{" "}
        <span className="text-[var(--alarm)] font-semibold">«{deviceName}»</span>?
      </p>

      <div className="flex justify-center gap-3">
        <Button variant="secondary" onClick={onClose}>Отмена</Button>
        <Button variant="dangerSolid" onClick={onConfirm}>Удалить</Button>
      </div>
    </Modal>
  );
}
