import { useMemo, useState } from "react";
import { prettyDate } from "../utils/date";

type Props = {
  reservations: any[];
  lockers: any[];
  onCancel: (id: string) => void;
};

export default function MyReservationsView({ reservations, lockers, onCancel }: Props) {
  const [q, setQ]                   = useState("");
  const [onlyActive, setOnlyActive] = useState(true);

  // ✅ Usamos lockers para obtener la etiqueta del locker
  function lockerLabel(id: string) {
    const l = lockers.find((x) => x.id === id);
    if (!l) return id;
    return `Locker ${l.code} • ${l.edificio} • Piso ${l.piso}`;
  }

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return reservations
      .filter((r) => (onlyActive ? r.status === "CONFIRMADA" : true))
      .filter((r) => {
        if (!query) return true;
        return (
          r.user.toLowerCase().includes(query) ||
          r.reason.toLowerCase().includes(query) ||
          r.date.includes(query) ||
          lockerLabel(r.lockerId).toLowerCase().includes(query)
        );
      })
      .sort((a: any, b: any) =>
        `${b.date} ${b.start}`.localeCompare(`${a.date} ${a.start}`)
      );
  }, [reservations, q, onlyActive, lockers]);

  return (
    <section className="card">
      <h2>Mis reservas</h2>
      <p className="muted">Filtra por usuario, motivo, fecha o locker.</p>

      <div className="row">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por usuario, motivo, fecha o locker..."
        />
        <label className="check">
          <input
            type="checkbox"
            checked={onlyActive}
            onChange={(e) => setOnlyActive(e.target.checked)}
          />
          Solo confirmadas
        </label>
      </div>

      {filtered.length === 0 ? (
        <p className="muted">No hay reservas para mostrar.</p>
      ) : (
        <div className="table table-6">
          <div className="thead">
            <div>Fecha</div>
            <div>Hora</div>
            <div>Locker</div>
            <div>Usuario</div>
            <div>Motivo</div>
            <div>Acción</div>
          </div>
          {filtered.map((r: any) => (
            <div className="trow" key={r.id}>
              <div>{prettyDate(r.date)}</div>
              <div>{r.start} - {r.end}</div>
              <div>{lockerLabel(r.lockerId)}</div>
              <div>{r.user}</div>
              <div className="clip" title={r.reason}>{r.reason}</div>
              <div>
                {r.status === "CONFIRMADA" ? (
                  <button className="danger" onClick={() => onCancel(r.id)}>
                    Cancelar
                  </button>
                ) : (
                  <span className={`pill ${r.status}`}>{r.status}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
