// Маяк — система управления звуковыми оповещениями
// by Benovich · https://github.com/Denchikper/mayak

import Modal from "./ui/Modal";
import Button from "./ui/Button";

export default function ErrorModal({ isOpen, onClose, message }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ошибка" tone="danger">
      <p className="text-[var(--text-soft)] text-sm text-center mb-6">{message}</p>
      <div className="flex justify-center">
        <Button variant="secondary" onClick={onClose}>Закрыть</Button>
      </div>
    </Modal>
  );
}
