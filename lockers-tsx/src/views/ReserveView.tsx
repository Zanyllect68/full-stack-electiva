import { useState } from "react";
import { todayISO } from "../utils/date";

type Props = {
  lockers: any[];
  onCreate: (payload: any) => void;
};

export default function ReserveView({ lockers, onCreate }: Props) {
  const [lockerId, setLockerId] = useState("");
  const [date, setDate]         = useState(todayISO());
  const [start, setStart]       = useState("08:00");
  const [end, setEnd]           = useState("09:00");
  const [user, setUser]         = useState("");
  const [reason, setReason]     = useState("");

  const effectiveLocker = lockerId || lockers[0]?.id || "";

  function submit(e: React.FormEvent) {
    e.preventDefault();
    onCreate({ lockerId: effectiveLocker, date, start, end, user, reason });
  }

  return (
    <section className="card">
      <h2>Reservar locker</h2>

      {lockers.length === 0 ? (
        <p className="muted">No hay lockers activos. Ve a "Lockers" y crea alguno.</p>
      ) : (
        <form className="stack" onSubmit={submit}>
          <label>
            Locker
            <select value={effectiveLocker} onChange={(e) => setLockerId(e.target.value)}>
              {lockers.map((l) => (
                <option key={l.id} value={l.id}>
                  Locker {l.code}
                </option>
              ))}
            </select>
          </label>

          <div className="row2">
            <label>Fecha
              <input type="date" value={date} min={todayISO()} onChange={(e) => setDate(e.target.value)} required />
            </label>
            <label>Usuario
              <input value={user} onChange={(e) => setUser(e.target.value)} placeholder="Ej: Sergio Puerto" required />
            </label>
          </div>

          <div className="row2">
            <label>Hora inicio
              <input type="time" value={start} onChange={(e) => setStart(e.target.value)} required />
            </label>
            <label>Hora fin
              <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} required />
            </label>
          </div>

          <label>Motivo
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} placeholder="Ej: Guardar implementos" required />
          </label>

          <button type="submit" disabled={!effectiveLocker}>
            Confirmar reserva
          </button>
        </form>
      )}
    </section>
  );
}
