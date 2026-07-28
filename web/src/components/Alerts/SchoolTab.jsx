import React, { useEffect, useState } from "react";
import DaysList from "./schoolRings/DaysList";
import StyledSelect from "../ui/StyledSelect";
import Button from "../ui/Button";
import { daysListGet } from "../../api/alerts/days";
import { activateSchedule, deactivateSchedule, deleteSchedules, schedulesActiveListGet, schedulesCreate, schedulesListGet } from "../../api/alerts/schedules";
import { scenariosGet } from "../../api/alerts/scenarios";
import EditScheduleMenu from "./schoolRings/Editable/EditScheduleMenu";
import ConfirmDeleteScheduleModal from "./schoolRings/Editable/ConfirmDeleteScheduleModal";
import CreateScheduleModal from "./schoolRings/CreateScheduleModal";

export default function SchoolTab({ token,  logout, navigate}) {
  const [isCreateScheduleModalOpen, setCreateScheduleModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [activeSchedule, setActiveSchedule] = useState([]);
  const [scenarioList, setScenarioList] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [daysList, setDaysList] = useState([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, name: "" });
  const [loading, setLoading] = useState(false);

  const handleDeleteClick = () => {
    const scheduleToDelete = schedules.find(s => s.id === selectedSchedule);
    if (scheduleToDelete) {
      setDeleteModal({ 
        isOpen: true, 
        name: scheduleToDelete.name 
      });
    }
  }

  const handleCreateSchedule = async (name) => {
    const res = await schedulesCreate(token, name, logout, navigate);
    if (res.ok) {
      const resSchedules = await schedulesListGet(token, logout, navigate);
      if (resSchedules.ok) {
        const newSchedule =  resSchedules.data.find(s => s.name === name) || {}
        setSchedules(resSchedules.data);
        setSelectedSchedule(newSchedule.id);
      }
    }
  }

  const handleConfirmDelete = async () => {
    try {
      const res = await deleteSchedules(token, selectedSchedule, logout, navigate);
      if (res.ok) {
        const resSchedules = await schedulesListGet(token, logout, navigate);
        if (resSchedules.ok) {
          setSchedules(resSchedules.data);
          setSelectedSchedule("");
          setScenarioList([]);
            
          if (activeSchedule.id === selectedSchedule) {
            setActiveSchedule({})
            await updateActiveSchedule();
          } else {
            setSelectedSchedule(activeSchedule.id);
        }
       }
      }
        setIsEditOpen(false);
      } catch (err) {
      console.error("Ошибка удаления расписания:", err);
    } finally {
      setDeleteModal({ isOpen: false, name: "" });
    }
  };

  const handleSchedule = async () => {
    if (!selectedSchedule) return;
    await activateSchedule(token, selectedSchedule, logout, navigate);
    updateActiveSchedule();
  };

  const handleDeactivate = async () => {
    const res = await deactivateSchedule(token, logout, navigate);
    if (res.ok) setActiveSchedule({});
  };

  const updateActiveSchedule = async () => {
    const resAсtiveSchedules = await schedulesActiveListGet(token, logout, navigate);
    if (resAсtiveSchedules.ok && resAсtiveSchedules.data.length > 0) {
      setActiveSchedule(resAсtiveSchedules.data[0])
      setSelectedSchedule(resAсtiveSchedules.data[0].id);
    }
  }

  useEffect(() => {
    setLoading(true);
    const loadData = async () => {
        if (!token) return;

        updateActiveSchedule();

        const resDays = await daysListGet(token, logout, navigate);
        const resSchedules = await schedulesListGet(token, logout, navigate);
    
        if (resDays.ok) setDaysList(resDays.data);
        if (resSchedules.ok) setSchedules(resSchedules.data);

        setLoading(false);
        }
        
        loadData();
  }, []);

  useEffect(() => {
    if (!selectedSchedule) {
      setScenarioList([]);
      return;
    }
    async function loadScenarios() {
        const resScenarioList = await scenariosGet(token, selectedSchedule, logout, navigate);
        if (resScenarioList.ok) setScenarioList(resScenarioList.data);
    }

    loadScenarios();
  }, [selectedSchedule]);

  const getSelectedSchedule = () => {
    return schedules.find(s => s.id === selectedSchedule) || {};
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between w-full">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="w-full sm:w-60">
            <StyledSelect
              options={schedules.map((s) => ({ value: s.id, label: s.name }))}
              value={selectedSchedule}
              onChange={(e) => setSelectedSchedule(Number(e.target.value))}
              placeholder="Выберите расписание"
            />
          </div>
          <Button variant="primary" size="sm" onClick={handleSchedule}>Активировать</Button>
          {activeSchedule?.id && (
            <Button variant="secondary" size="sm" onClick={handleDeactivate}>Выключить</Button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--surface-2)] text-sm text-[var(--text-soft)] rounded-lg">
            <span className="beacon-dot beacon-dot--live" style={{ "--pulse-color": "var(--safe)" }} />
            <span className="truncate whitespace-nowrap">
              Активно: {activeSchedule.name || "не выбрано"}
            </span>
          </span>

          {selectedSchedule && (
            <Button variant="secondary" size="sm" onClick={() => setIsEditOpen(true)}>Управление</Button>
          )}
          <Button variant="primary" size="sm" onClick={() => setCreateScheduleModalOpen(true)}>Создать</Button>
        </div>
      </div>

      <div className="w-full animate-fadeIn">
        <DaysList daysList={daysList} scenarioList={scenarioList}/>
      </div>

      {isEditOpen && (
        <EditScheduleMenu 
        handleDeleteClick={handleDeleteClick}
        activeSchedule={activeSchedule}
        updateActiveSchedule={updateActiveSchedule} 
        setSchedules={setSchedules} 
        setScenarioList={setScenarioList} 
        token={token} 
        logout={logout} 
        navigate={navigate} 
        onClose={() => setIsEditOpen(false)} 
        daysList={daysList} 
        scenarioList={scenarioList} 
        schedulesActual={getSelectedSchedule()}
        />
      )}

      <ConfirmDeleteScheduleModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, name: "" })}
        onConfirm={handleConfirmDelete}
        scheduleName={getSelectedSchedule()}
      />
      {isCreateScheduleModalOpen && (
        <CreateScheduleModal onClose={() => setCreateScheduleModalOpen(false)} onCreate={(name) => handleCreateSchedule(name)}/>
      )}

    </div>
  );
}
