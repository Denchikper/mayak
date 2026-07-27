import EditableEventRow from "./EditableEventRow";
import { Plus } from "lucide-react";

export default function EditableDayColumn({ day, events, setLessonModalOpen, setDayChoicen, setEventsChoicen, handleDeleteLesson, onChange }) {
  return (
    <div className="bg-[var(--surface-2)] border border-[var(--border)] shadow-sm rounded-md p-3 flex flex-col min-w-[200px] h-full custom-scrollbar">
      <div className="text-center text-sm font-semibold text-[var(--text)] bg-[var(--surface-3)] border border-[var(--border)] rounded-lg py-2 mb-2">
        {day.name}
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col gap-2 pb-2 pr-1 custom-scrollbar">
        {events.length === 0 && (
          <div className="text-[var(--text-muted)] text-sm text-center mt-3">
            Нет уроков
          </div>
        )}

        {events
          .sort((a, b) => a.event_order - b.event_order)
          .map(event => (
            <EditableEventRow key={event.id} event={event} day={day} handleDeleteLesson={handleDeleteLesson} onChange={onChange}/>
          ))}
      </div>

      <div className="pt-2 pb-2 sticky bottom-0 bg-[var(--surface-2)]">
        <button  
          onClick={() => {
            setLessonModalOpen(true);
            setEventsChoicen(events);
            setDayChoicen(day);
          }} 
          className="w-full flex items-center justify-center gap-2 text-sm text-[var(--beacon)] hover:text-[var(--beacon-strong)] transition-colors py-2 bg-[var(--surface)] rounded-lg cursor-pointer"
        >
          <Plus size={16} />
          Добавить урок
        </button>
      </div>
    </div>
  );
}
