import { use, useState } from "react";
import EditableDaysGrid from "./EditableDaysGrid";
import { Trash2, X } from "lucide-react";
import AddLessonModal from "./AddLessonModal";
import Button from "../../../ui/Button";
import { deleteEventsByID, eventsCreate, eventUpdate } from "../../../../api/alerts/events";
import { scenariosGet, scenariosGetByDay } from "../../../../api/alerts/scenarios";
import { schedulesListGet, schedulesUpdate } from "../../../../api/alerts/schedules";

let event_order = 0
let scenario_id = 0

export default function EditScheduleMenu({
  token,
  logout,
  handleDeleteClick,
  navigate,
  updateActiveSchedule,
  activeSchedule,
  setSchedules,
  daysList,
  scenarioList,
  setScenarioList,
  schedulesActual,
  onClose,
}) {

    const [isLessonModalOpen, setLessonModalOpen] = useState(false);
    const [dayChoicen, setDayChoicen] = useState([]);
    const [eventsChoicen, setEventsChoicen] = useState([]);
    const [nameSchedule, setNameSchedule] = useState(schedulesActual.name);

    const handleEventChange = (eventId, changes) => {
      setScenarioList(prev =>
        prev.map(scenario => ({
          ...scenario,
          ScheduleEvents: scenario.ScheduleEvents.map(event =>
            event.id === eventId
              ? { ...event, ...changes, isDirty: true } // помечаем как изменённое
              : event
          )
        }))
      );
    };

    const handleSaveSchedule = async () => {
      if (!schedulesActual.id) {
        console.warn("Расписание не выбрано — сохранять нечего");
        onClose();
        return;
      }

      const res = await schedulesUpdate(
        token,
        schedulesActual.id,
        { name: nameSchedule },
        logout,
        navigate
      );

      if (res.ok) {
        const resSchedules = await schedulesListGet(token, logout, navigate);
        if (resSchedules.ok) setSchedules(resSchedules.data);
        if (activeSchedule.id === schedulesActual.id) updateActiveSchedule();
      } else {
        console.error("Ошибка при сохранении расписания", res);
      }

  // Сохраняем изменённые события
      const changedEvents = scenarioList
        .flatMap(s => s.ScheduleEvents)
        .filter(e => e.isDirty);

      for (const event of changedEvents) {
        await eventUpdate(
          token,
          event.id,
          { start_time: event.start_time, end_time: event.end_time },
          logout,
          navigate
        );
      }

      onClose();
    };

    const handleLessonSave = async (data) => {
        const [formData] = eventsChoicen.slice(-1);
        if (!formData) {
            event_order = 1
            const resByDay = await scenariosGetByDay(token, schedulesActual.id, dayChoicen.id, logout, navigate);
            if (resByDay.ok) {
                scenario_id = resByDay.data.id
            } else {
                console.error("Ошибка при получении сценария для дня", resByDay);
            }
        } else {
            event_order = formData.event_order + 1
            scenario_id = formData.scenario_id
        }

        const res = await eventsCreate(token, scenario_id, event_order, data.startTime, data.endTime, logout, navigate);
        if (res.ok) {
            const updatedScenarioList = await scenariosGet(token, schedulesActual.id, logout, navigate);
            if (updatedScenarioList.ok) {
              setScenarioList(updatedScenarioList.data);
            }   
            setLessonModalOpen(false); // закрываем модалку
        } else {
            console.error("Ошибка при добавлении урока", res);
        }
    };

    const handleDeleteLesson = async (event_id) => {
        const res = await deleteEventsByID(token, event_id, logout, navigate);
        if (res.ok) {
            const updatedScenarioList = await scenariosGet(token, schedulesActual.id, logout, navigate);
            if (updatedScenarioList.ok) {
              setScenarioList(updatedScenarioList.data);
            }   
        } else {
            console.error("Ошибка при удалении урока", res);
        }
    };

  return (
    <div className="fixed inset-0 z-48 flex items-center justify-center px-4">
      {/* overlay */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#05070A]/70"
      />

      <div className="relative z-10 w-full max-w-6xl h-[85vh] bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 flex flex-col animate-modalEnter">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-4 justify-between">
          <input
            value={nameSchedule}
            onChange={(e) => setNameSchedule(e.target.value)}
            placeholder="Название расписания"
            className="flex-1 max-w-[300px] bg-[var(--input)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-colors"
          />
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Закрыть">
            <X size={18} />
          </Button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-x-auto flex custom-scrollbar">
          <EditableDaysGrid
            daysList={daysList}
            scenarioList={scenarioList}
            setEventsChoicen={setEventsChoicen}
            setLessonModalOpen={setLessonModalOpen}
            setDayChoicen={setDayChoicen}
            handleDeleteLesson={handleDeleteLesson}
            onChange={handleEventChange}
          />
        </div>

        {/* FOOTER */}
        <div className="mt-4 flex gap-3 justify-end">
          <Button variant="danger" size="sm" onClick={() => handleDeleteClick()}>
            <Trash2 size={15} />
            Удалить
          </Button>
          <Button variant="primary" size="sm" onClick={() => handleSaveSchedule()}>
            Сохранить
          </Button>
        </div>
      </div>
      {isLessonModalOpen && (
        <AddLessonModal onClose={() => setLessonModalOpen(false)} onSave={(data) => handleLessonSave(data)}/>
      )}
    </div>
  );
}
