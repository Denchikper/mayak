// Маяк — система управления звуковыми оповещениями
// by Benovich · https://github.com/Denchikper/mayak

import React, { useState, useEffect } from "react";
import StyledCheckbox from "../ui/StyledCheckbox";
import BigSelect from "../ui/BigSelect";
import Modal from "../ui/Modal";
import Button from "../ui/Button";

const inputClass =
  "w-full bg-[var(--input)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-colors";

export default function CreateAlarmModal({ isOpen, onClose, onCreate, initialData }) {
  const [name, setName] = useState("");
  const [name_remote, setName_remote] = useState("");
  const [channel, setChannel] = useState(1);
  const [isDrill, setIsDrill] = useState(false);

  const channelOptions = Array.from({ length: 5 }, (_, i) => ({
    value: i + 1,
    label: `Канал ${i + 1}`,
  }));

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name || "");
        setName_remote(initialData.name_remote || "");
        setChannel(initialData.channel || 1);
        setIsDrill(initialData.is_drill || false);
      } else {
        setName("");
        setName_remote("");
        setChannel(1);
        setIsDrill(false);
      }
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate({ name, name_remote, channel, is_drill: isDrill });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Редактировать тревогу" : "Создать тревогу"}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm text-[var(--text-soft)] mb-1.5">Название тревоги</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            placeholder="Например: Пожарная тревога"
          />
        </div>

        <div>
          <label className="block text-sm text-[var(--text-soft)] mb-1.5">Название с пульта</label>
          <input
            value={name_remote}
            onChange={(e) => setName_remote(e.target.value)}
            className={inputClass}
            placeholder="Например: fire"
          />
        </div>

        <div>
          <label className="block text-sm text-[var(--text-soft)] mb-1.5">Канал</label>
          <BigSelect value={channel} onChange={setChannel} options={channelOptions} />
        </div>

        <StyledCheckbox label="Учебная тревога" checked={isDrill} onChange={setIsDrill} />

        <div className="flex justify-center gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Отмена</Button>
          <Button type="submit" variant="primary">{initialData ? "Сохранить" : "Создать"}</Button>
        </div>
      </form>
    </Modal>
  );
}
