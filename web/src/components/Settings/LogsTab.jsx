import React, { useEffect, useState, useCallback } from "react";
import { RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { getLogs, getLogLevels } from "../../api/logs/logs";
import BigSelect from "../ui/BigSelect";
import Button from "../ui/Button";

const PAGE = 50;

const fieldClass =
  "bg-[var(--input)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-colors";

// Цвет бейджа уровня
function levelClass(level) {
  if (level.includes("error")) return "bg-[var(--alarm)]/12 text-[var(--alarm)]";
  if (level.includes("warn")) return "bg-[var(--accent)]/12 text-[var(--accent)]";
  if (level === "audit") return "bg-[var(--text-muted)]/15 text-[var(--text-soft)]";
  if (level.includes("success")) return "bg-[var(--safe)]/12 text-[var(--safe)]";
  return "bg-[var(--surface-2)] text-[var(--text-muted)]";
}

export default function LogsTab({ token, logout, navigate }) {
  const [rows, setRows] = useState([]);
  const [count, setCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const [level, setLevel] = useState("");
  const [q, setQ] = useState("");
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (off = 0, lvl = level, query = q) => {
    setLoading(true);
    const res = await getLogs(token, { limit: PAGE, offset: off, level: lvl, q: query }, logout, navigate);
    if (res.ok) {
      setRows(res.data.rows || []);
      setCount(res.data.count || 0);
      setOffset(off);
    }
    setLoading(false);
  }, [token, logout, navigate, level, q]);

  useEffect(() => {
    load(0);
    getLogLevels(token, logout, navigate).then((r) => {
      if (r.ok) setLevels(Array.isArray(r.data) ? r.data : []);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const levelOptions = [{ value: "", label: "Все уровни" }, ...levels.map((l) => ({ value: l, label: l }))];
  const page = Math.floor(offset / PAGE) + 1;
  const pages = Math.max(1, Math.ceil(count / PAGE));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <h2 className="font-display text-base font-semibold uppercase tracking-wide flex-1">Журнал ({count})</h2>
        <div className="w-44"><BigSelect value={level} onChange={(v) => { setLevel(v); load(0, v, q); }} options={levelOptions} /></div>
        <form
          onSubmit={(e) => { e.preventDefault(); load(0, level, q); }}
          className="flex gap-2"
        >
          <input className={fieldClass} placeholder="Поиск…" value={q} onChange={(e) => setQ(e.target.value)} />
          <Button type="button" variant="ghost" size="sm" onClick={() => load(offset)} aria-label="Обновить"><RefreshCw size={15} /></Button>
        </form>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[var(--text-muted)] border-b border-[var(--border)]">
                <th className="px-3 py-2 font-medium whitespace-nowrap">Время</th>
                <th className="px-3 py-2 font-medium">Уровень</th>
                <th className="px-3 py-2 font-medium">Пользователь</th>
                <th className="px-3 py-2 font-medium">Сообщение</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="px-3 py-6 text-center text-[var(--text-muted)]">Загрузка…</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={4} className="px-3 py-6 text-center text-[var(--text-muted)]">Записей нет</td></tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id} className="border-b border-[var(--border)] last:border-0 align-top">
                    <td className="px-3 py-2 whitespace-nowrap font-mono text-xs text-[var(--text-muted)]">{new Date(r.created_at).toLocaleString()}</td>
                    <td className="px-3 py-2"><span className={`text-[11px] px-2 py-0.5 rounded-full ${levelClass(r.level)}`}>{r.level}</span></td>
                    <td className="px-3 py-2 whitespace-nowrap text-[var(--text-soft)]">{r.username || "—"}{r.ip ? ` (${r.ip})` : ""}</td>
                    <td className="px-3 py-2 text-[var(--text)] break-all">
                      {r.message}
                      {r.meta?.status ? <span className="text-[var(--text-muted)]"> · {r.meta.status}</span> : null}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-[var(--text-muted)]">Стр. {page} из {pages}</span>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            disabled={offset === 0}
            onClick={() => load(Math.max(0, offset - PAGE))}
          >
            <ChevronLeft size={15} /> Назад
          </Button>
          <Button
            variant="secondary"
            size="sm"
            disabled={offset + PAGE >= count}
            onClick={() => load(offset + PAGE)}
          >
            Вперёд <ChevronRight size={15} />
          </Button>
        </div>
      </div>
    </div>
  );
}
