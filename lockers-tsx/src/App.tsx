import { useEffect, useMemo, useState } from "react";
import "./App.css";

import type { Locker, SedeKey, SedeConfig } from "./types/locker";
import type { Reservation, Toast, ToastType, ViewKey } from "./types/reservation";
import { loadLS, saveLS }                   from "./utils/storage";
import { todayISO, isPastDate, uid } from "./utils/date";
import Dashboard          from "./views/Dashboard";
import LockersView        from "./views/LockersView";
import ReserveView        from "./views/ReserveView";
import MyReservationsView from "./views/MyReservationsView";
import ConfigView         from "./views/ConfigView";

/* ── Constantes ── */
const LS_KEYS = {
  lockers: "lockers_items_v1",
  reservations: "lockers_reservations_v1",
} as const;

const SEDES: Record<SedeKey, SedeConfig> = {
  CENTRO: {
    label: "Centro",
    edificios: { "Centro Histórico": [1, 2, 3] },
  },
  CAMPUS: {
    label: "Campus",
    edificios: {
      "Santo Domingo":  [1, 2, 3, 4, 5, 6],
      "Giordano Bruno": [1, 2, 3, 4],
    },
  },
};

const DEFAULT_LOCKERS: Locker[] = [
  { id: "LK-CH-1-01", code: "01", sede: "CENTRO", edificio: "Centro Histórico", piso: 1, active: true },
  { id: "LK-CH-1-02", code: "02", sede: "CENTRO", edificio: "Centro Histórico", piso: 1, active: true },
  { id: "LK-SD-2-01", code: "01", sede: "CAMPUS", edificio: "Santo Domingo",    piso: 2, active: true },
  { id: "LK-SD-2-02", code: "02", sede: "CAMPUS", edificio: "Santo Domingo",    piso: 2, active: true },
  { id: "LK-GB-3-01", code: "01", sede: "CAMPUS", edificio: "Giordano Bruno",   piso: 3, active: true },
];

/* ══════════════════════════════════════
   APP
══════════════════════════════════════ */
export default function App() {
  const [view, setView]               = useState<ViewKey>("dashboard");
  const [lockers, setLockers]         = useState<Locker[]>(() => loadLS(LS_KEYS.lockers, DEFAULT_LOCKERS));
  const [reservations, setReservations] = useState<Reservation[]>(() => loadLS(LS_KEYS.reservations, []));
  const [toast, setToast]             = useState<Toast>({ type: "info", msg: "" });

  useEffect(() => saveLS(LS_KEYS.lockers, lockers), [lockers]);
  useEffect(() => saveLS(LS_KEYS.reservations, reservations), [reservations]);

  const activeLockers = useMemo(() => lockers.filter((l) => l.active), [lockers]);

  const stats = useMemo(() => ({
    total:  reservations.length,
    today:  reservations.filter((r) => r.date === todayISO()).length,
    active: activeLockers.length,
  }), [reservations, activeLockers]);

  const upcomingReservations = useMemo(() =>
    [...reservations]
      .sort((a, b) => `${a.date} ${a.start}`.localeCompare(`${b.date} ${b.start}`))
      .filter((r) => r.date >= todayISO())
      .slice(0, 6),
    [reservations]
  );

  function notify(type: ToastType, msg: string) {
    setToast({ type, msg });
    const w = window as unknown as { __toastTimer?: number };
    if (w.__toastTimer) clearTimeout(w.__toastTimer);
    w.__toastTimer = window.setTimeout(() => setToast({ type: "info", msg: "" }), 2600);
  }

  function overlaps(aStart: string, aEnd: string, bStart: string, bEnd: string) {
    return aStart < bEnd && bStart < aEnd;
  }

  /* ── CRUD Lockers ── */
  function addLocker(data: { id: string; code: string; sede: SedeKey; edificio: string; piso: number }) {
    const cleanId = data.id.trim().toUpperCase();
    if (!cleanId || !data.code || !data.sede || !data.edificio || !data.piso) {
      notify("error", "Completa todos los campos."); return;
    }
    if (lockers.some((l) => l.id === cleanId)) {
      notify("error", "Ya existe un locker con ese ID."); return;
    }
    setLockers((prev) => [...prev, { ...data, id: cleanId, active: true }]);
    notify("success", "Locker creado.");
  }

  function updateLocker(updated: Locker) {
    setLockers((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
    notify("success", `Locker ${updated.code} actualizado.`);
  }

  function toggleLocker(id: string) {
    setLockers((prev) => prev.map((l) => (l.id === id ? { ...l, active: !l.active } : l)));
    notify("info", "Estado actualizado.");
  }

  function deleteLocker(id: string) {
    if (!confirm("¿Eliminar este locker?")) return;
    setLockers((prev) => prev.filter((l) => l.id !== id));
    notify("info", "Locker eliminado.");
  }

  function lockerLabelById(lockerId: string) {
    const l = lockers.find((x) => x.id === lockerId);
    if (!l) return lockerId;
    return `Locker ${l.code} • ${SEDES[l.sede]?.label ?? l.sede} - ${l.edificio} • Piso ${l.piso}`;
  }

  /* ── Reservas ── */
  function createReservation(payload: { lockerId: string; date: string; start: string; end: string; user: string; reason: string }) {
    const { lockerId, date, start, end, user, reason } = payload;
    if (!lockerId || !date || !start || !end || !user.trim() || !reason.trim()) {
      notify("error", "Todos los campos son obligatorios."); return;
    }
    if (isPastDate(date)) { notify("error", "No puedes reservar en una fecha pasada."); return; }
    if (start >= end)     { notify("error", "Hora inicio debe ser menor que hora fin."); return; }
    const locker = lockers.find((l) => l.id === lockerId);
    if (!locker?.active)  { notify("error", "Locker no disponible."); return; }
    const collision = reservations
      .filter((r) => r.lockerId === lockerId && r.date === date)
      .some((r) => overlaps(start, end, r.start, r.end));
    if (collision) { notify("error", "Conflicto de horario."); return; }
    setReservations((prev) => [{
      id: uid(), lockerId, date, start, end,
      user: user.trim(), reason: reason.trim(),
      status: "CONFIRMADA", createdAt: new Date().toISOString(),
    }, ...prev]);
    notify("success", "Reserva confirmada.");
    setView("mis-reservas");
  }

  function cancelReservation(id: string) {
    setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status: "CANCELADA" } : r)));
    notify("info", "Reserva cancelada.");
  }

  /* ── Config ── */
  function resetAll() {
    if (!confirm("¿Seguro? Se borrarán todos los datos.")) return;
    setLockers(DEFAULT_LOCKERS);
    setReservations([]);
    notify("success", "Datos reiniciados.");
    setView("dashboard");
  }

  function exportJSON() {
    const blob = new Blob(
      [JSON.stringify({ lockers, reservations, exportedAt: new Date().toISOString() }, null, 2)],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const a   = document.createElement("a");
    a.href = url; a.download = "lockers_backup.json"; a.click();
    URL.revokeObjectURL(url);
    notify("success", "Backup exportado.");
  }

  function importJSON(file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as { lockers: Locker[]; reservations: Reservation[] };
        if (!parsed.lockers || !parsed.reservations) throw new Error();
        setLockers(parsed.lockers);
        setReservations(parsed.reservations);
        notify("success", "Backup importado.");
        setView("dashboard");
      } catch {
        notify("error", "Archivo JSON inválido.");
      }
    };
    reader.readAsText(file);
  }

  /* ── Render ── */
  return (
    <div className="layout">
      <header className="topbar">
        <div className="brand">
          <span className="dot" />
          <div>
            <h1>Reserva de Lockers</h1>
            <p>SPA · Vite + React TS · localStorage</p>
          </div>
        </div>
        <nav className="nav">
          {([
            ["dashboard",    "Dashboard"],
            ["reservar",     "Reservar"],
            ["mis-reservas", "Mis reservas"],
            ["lockers",      "Lockers"],
            ["config",       "Config"],
          ] as [ViewKey, string][]).map(([key, label]) => (
            <button key={key} className={view === key ? "active" : ""} onClick={() => setView(key)}>
              {label}
            </button>
          ))}
        </nav>
      </header>

      {toast.msg && (
        <div className={`toast ${toast.type}`}>
          <strong>{toast.type.toUpperCase()}:</strong> {toast.msg}
        </div>
      )}

      <main className="main">
        {view === "dashboard"    && <Dashboard stats={stats} upcomingReservations={upcomingReservations} lockerLabelById={lockerLabelById} />}
        {view === "reservar"     && <ReserveView lockers={activeLockers} onCreate={createReservation} />}
        {view === "mis-reservas" && <MyReservationsView reservations={reservations} lockers={lockers} onCancel={cancelReservation} />}
        {view === "lockers"      && <LockersView lockers={lockers} onAdd={addLocker} onUpdate={updateLocker} onToggle={toggleLocker} onDelete={deleteLocker} />}
        {view === "config"       && <ConfigView onReset={resetAll} onExport={exportJSON} onImport={importJSON} />}
      </main>

      <footer className="footer">
        <span>© 2026 • Lockers • Demo SPA</span>
      </footer>
    </div>
  );
}
