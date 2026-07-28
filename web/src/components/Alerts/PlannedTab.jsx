import React, { useEffect, useState } from "react";
import { Bell, Clock, Repeat, Pencil, Trash2, Plus, Power, X } from "lucide-react";
import BigSelect from "../ui/BigSelect";
import StyledCheckbox from "../ui/StyledCheckbox";
import Button from "../ui/Button";
import {
  plannedAlertsListGet,
  plannedAlertCreate,
  plannedAlertUpdate,
  plannedAlertToggle,
  plannedAlertDelete,
} from "../../api/alerts/plannedAlerts";
import { getChannels } from "../../api/channels/channels";
import { getAlarms } from "../../api/alarms/alarms";

const RECURRENCE_LABELS = {
  once: "Однократно",
  daily: "Ежедневно",
  weekly: "Еженедельно",
  monthly: "Ежемесячно",
};

const emptyForm = {
  name: "",
  target_type: "channel",
  target_id: "",
  start_time: "",
  recurrence: "once",
  is_active: true,
};

// ISO → формат input[type=datetime-local] по локальному времени
function toLocalInput(value) {
  if (!value) return "";
  const d = new Date(value);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const fieldClass =
  "w-full bg-[var(--input)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-colors";
const labelClass = "block text-xs text-[var(--text-muted)] mb-1.5";

export default function PlannedTab({ token, logout, navigate }) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [channels, setChannels] = useState([]);
  const [alarms, setAlarms] = useState([]);

  useEffect(() => {
    loadAlerts();
    loadTargets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadTargets() {
    const [chRes, alRes] = await Promise.all([
      getChannels(token, logout, navigate),
      getAlarms(token, logout, navigate),
    ]);
    if (chRes.ok) setChannels(Array.isArray(chRes.data) ? chRes.data : []);
    if (alRes.ok) setAlarms(Array.isArray(alRes.data) ? alRes.data : []);
  }

  // Опции для текущего типа цели
  const targetOptions =
    form.target_type === "channel"
      ? channels.map((c) => ({
          value: c.id,
          label: `#${c.id} · ${c.name || "канал"} (пин ${c.pin_number})`,
        }))
      : alarms.map((a) => ({
          value: a.id,
          label: `#${a.id} · ${a.name}`,
        }));

  // Подпись цели для карточки в списке
  const targetLabel = (alert) => {
    const list = alert.target_type === "channel" ? channels : alarms;
    const found = list.find((x) => x.id === alert.target_id);
    const prefix = alert.target_type === "channel" ? "Канал" : "Тревога";
    return found ? `${prefix}: ${found.name || `#${alert.target_id}`}` : `${prefix} #${alert.target_id}`;
  };

  async function loadAlerts() {
    setLoading(true);
    setError(null);
    const res = await plannedAlertsListGet(token, logout, navigate);
    if (res.ok) {
      setAlerts(Array.isArray(res.data) ? res.data : []);
    } else {
      setError("Не удалось загрузить оповещения");
    }
    setLoading(false);
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setFormOpen(false);
  }

  function openCreate() {
    setForm(emptyForm);
    setEditingId(null);
    setFormOpen(true);
  }

  function startEdit(alert) {
    setEditingId(alert.id);
    setForm({
      name: alert.name || "",
      target_type: alert.target_type || "channel",
      target_id: alert.target_id ?? "",
      start_time: toLocalInput(alert.start_time),
      recurrence: alert.recurrence || "once",
      is_active: !!alert.is_active,
    });
    setFormOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || form.target_id === "" || !form.start_time) return;

    const payload = {
      name: form.name.trim(),
      target_type: form.target_type,
      target_id: Number(form.target_id),
      start_time: new Date(form.start_time).toISOString(),
      recurrence: form.recurrence,
      is_active: form.is_active,
    };

    const res = editingId
      ? await plannedAlertUpdate(token, editingId, payload, logout, navigate)
      : await plannedAlertCreate(token, payload, logout, navigate);

    if (res.ok) {
      resetForm();
      await loadAlerts();
    } else {
      setError(res.data?.error || "Не удалось сохранить оповещение");
    }
  }

  async function handleToggle(id) {
    const res = await plannedAlertToggle(token, id, logout, navigate);
    if (res.ok) await loadAlerts();
  }

  async function handleDelete(id) {
    const res = await plannedAlertDelete(token, id, logout, navigate);
    if (res.ok) {
      if (editingId === id) resetForm();
      await loadAlerts();
    }
  }

  return (
    <div>
      {/* Заголовок + кнопка добавления */}
      <div className="flex items-center justify-between mb-5 gap-3">
        <p className="text-sm text-[var(--text-muted)]">
          {alerts.length > 0 ? `Всего: ${alerts.length}` : "Список пуст"}
        </p>
        {!formOpen && (
          <Button variant="primary" size="sm" onClick={openCreate}>
            <Plus size={16} /> Добавить
          </Button>
        )}
      </div>

      {/* Форма */}
      {formOpen && (
        <form
          onSubmit={handleSubmit}
          className="max-w-2xl bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 sm:p-5 mb-6 animate-fadeIn"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-[var(--text)]">
              {editingId ? "Редактирование оповещения" : "Новое оповещение"}
            </h3>
            <button
              type="button"
              onClick={resetForm}
              className="p-1.5 rounded-lg hover:bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="sm:col-span-2">
              <label className={labelClass}>Название</label>
              <input
                className={fieldClass}
                placeholder="Например: Сбор учеников"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div>
              <label className={labelClass}>Тип цели</label>
              <BigSelect
                value={form.target_type}
                onChange={(v) => setForm({ ...form, target_type: v, target_id: "" })}
                options={[
                  { value: "channel", label: "Канал" },
                  { value: "alarm", label: "Тревога" },
                ]}
              />
            </div>

            <div>
              <label className={labelClass}>
                {form.target_type === "channel" ? "Канал" : "Тревога"}
              </label>
              <BigSelect
                value={form.target_id}
                onChange={(v) => setForm({ ...form, target_id: v })}
                options={targetOptions}
                placeholder={targetOptions.length ? "Выберите из списка" : "Список пуст"}
              />
            </div>

            <div>
              <label className={labelClass}>Время</label>
              <input
                className={fieldClass}
                type="datetime-local"
                value={form.start_time}
                onChange={(e) => setForm({ ...form, start_time: e.target.value })}
              />
            </div>

            <div>
              <label className={labelClass}>Повтор</label>
              <BigSelect
                value={form.recurrence}
                onChange={(v) => setForm({ ...form, recurrence: v })}
                options={Object.entries(RECURRENCE_LABELS).map(([value, label]) => ({ value, label }))}
              />
            </div>
          </div>

          <div className="mt-4">
            <StyledCheckbox
              label="Активно сразу после создания"
              checked={form.is_active}
              onChange={(v) => setForm({ ...form, is_active: v })}
            />
          </div>

          <div className="flex gap-3 mt-5">
            <Button type="submit" variant="primary">{editingId ? "Сохранить" : "Создать"}</Button>
            <Button type="button" variant="secondary" onClick={resetForm}>Отмена</Button>
          </div>
        </form>
      )}

      {error && <p className="text-sm text-[var(--alarm)] text-center mb-3">{error}</p>}

      {/* Список */}
      {loading ? (
        <p className="text-sm text-[var(--text-muted)] text-center py-10">Загрузка...</p>
      ) : alerts.length === 0 ? (
        !formOpen && (
          <div className="flex flex-col items-center justify-center text-center py-14 text-[var(--text-muted)]">
            <Bell size={32} className="mb-3 opacity-50" />
            <p className="text-sm mb-4">Пока нет запланированных оповещений</p>
            <Button variant="primary" size="sm" onClick={openCreate}>
              <Plus size={16} /> Добавить первое
            </Button>
          </div>
        )
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-medium text-[var(--text)] truncate">{alert.name}</h3>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                        alert.is_active
                          ? "bg-[var(--safe)]/12 text-[var(--safe)]"
                          : "bg-[var(--surface-2)] text-[var(--text-muted)]"
                      }`}
                    >
                      {alert.is_active ? "активно" : "выключено"}
                    </span>
                  </div>

                  <div className="flex items-center gap-x-4 gap-y-1 flex-wrap mt-2 text-xs text-[var(--text-muted)]">
                    <span className="inline-flex items-center gap-1.5">
                      <Bell size={13} />
                      {targetLabel(alert)}
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-mono">
                      <Clock size={13} />
                      {new Date(alert.start_time).toLocaleString()}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Repeat size={13} />
                      {RECURRENCE_LABELS[alert.recurrence] || alert.recurrence}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggle(alert.id)}
                    aria-label={alert.is_active ? "Выключить" : "Включить"}
                    className={alert.is_active ? "text-[var(--safe)]" : ""}
                  >
                    <Power size={15} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => startEdit(alert)} aria-label="Редактировать">
                    <Pencil size={15} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(alert.id)} aria-label="Удалить" className="hover:text-[var(--alarm)]">
                    <Trash2 size={15} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
