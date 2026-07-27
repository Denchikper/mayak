import React, { useState, useEffect } from "react";
import StyledCheckbox from "../ui/StyledCheckbox";

export default function CreateAlarmModal({ isOpen, onClose, onCreate, initialData }) {
  const [name, setName] = useState("");
  const [name_remote, setName_remote] = useState("");
  const [channel, setChannel] = useState(1);
  const [isDrill, setIsDrill] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate({ name, name_remote, channel, is_drill: isDrill });
    onClose();
  };

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  const selectOption = (value) => {
    setChannel(value);
    setIsDropdownOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6 w-full max-w-md shadow-xl transform transition-all duration-300 animate-modalEnter">
        <h2 className="font-display uppercase tracking-wide text-xl font-semibold mb-4 text-center text-[var(--text)]">
          {initialData ? "Редактировать тревогу" : "Создать новую тревогу"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Название */}
          <div>
            <label className="block text-sm text-[var(--text-muted)] mb-1">Название тревоги</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text)] 
                         placeholder-gray-400 focus:outline-none focus:border-[var(--beacon)] transition-colors duration-200"
              placeholder="Например: Пожарная тревога"
            />
          </div>

          {/* Описание */}
          <div>
            <label className="block text-sm text-[var(--text-muted)] mb-1">Название с пульта</label>
            <input
              value={name_remote}
              onChange={(e) => setName_remote(e.target.value)}
              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text)]
                         placeholder-gray-400 focus:outline-none focus:border-[var(--beacon)] transition-colors duration-200"
              placeholder="Например: fire"
            />
          </div>

          {/* Канал */}
          <div className="relative ">
            <label className="block text-sm text-[var(--text-muted)] mb-1">Канал</label>
            <div
              onClick={toggleDropdown}
              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text)] cursor-pointer flex justify-between items-center 
                         focus:outline-none focus:border-[var(--beacon)] transition-all duration-200 "
            >
              <span>{channelOptions.find((opt) => opt.value === channel)?.label}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-4 h-4 text-[var(--text-muted)] transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {isDropdownOpen && (
              <div className="absolute w-full mt-1 bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg max-h-48 overflow-y-auto animate-fadeIn z-50">
                {channelOptions.map((opt) => (
                  <div
                    key={opt.value}
                    onClick={() => selectOption(opt.value)}
                    className={`px-3 py-2 cursor-pointer hover:bg-[var(--surface-2)] transition-colors ${
                      opt.value === channel ? "bg-[var(--surface-2)]" : ""
                    }`}
                  >
                    {opt.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Учебная тревога */}
          <div className="mt-5">
            <StyledCheckbox
              label="Учебная тревога"
              checked={isDrill}
              onChange={(checked) => setIsDrill(checked)}
            />
          </div>

          {/* Кнопки */}
          <div className="flex justify-center space-x-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[var(--surface-2)] hover:bg-[var(--surface-3)] transition-all duration-200 text-sm cursor-pointer"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[var(--beacon)] hover:bg-[var(--beacon-strong)] text-[#0A0F16] transition-all duration-200 text-sm font-medium cursor-pointer"
            >
              {initialData ? "Сохранить" : "Создать"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
