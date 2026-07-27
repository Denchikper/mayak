export default function ErrorModal({ isOpen, onClose, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6 w-full max-w-sm shadow-xl animate-fadeIn">
        <h2 className="font-display uppercase tracking-wide text-xl font-semibold text-center mb-3 text-[var(--alarm)]">Ошибка</h2>
        <p className="text-[var(--text-soft)] text-center mb-6">{message}</p>
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-md bg-[var(--surface-2)] hover:bg-[var(--surface-3)] transition text-sm font-medium"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}