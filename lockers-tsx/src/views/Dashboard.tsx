
import { prettyDate } from "../utils/date";
type Props = {
  stats: {
    active: number;
    total: number;
    today: number;
  };
  upcomingReservations: any[];
  lockerLabelById: (id: string) => string;
};

export default function Dashboard({ stats, upcomingReservations, lockerLabelById }: Props) {
  return (
    <section className="card">
      <h2>Dashboard</h2>
      <p className="muted">Resumen rápido del estado de lockers.</p>

      <div className="grid3">
        <div className="kpi">
          <div className="kpi-num">{stats.active}</div>
          <div className="kpi-lbl">Lockers activos</div>
        </div>

        <div className="kpi">
          <div className="kpi-num">{stats.total}</div>
          <div className="kpi-lbl">Reservas totales</div>
        </div>

        <div className="kpi">
          <div className="kpi-num">{stats.today}</div>
          <div className="kpi-lbl">Reservas hoy</div>
        </div>
      </div>

      <hr className="hr" />

      <h3>Próximas reservas</h3>

      {upcomingReservations.length === 0 ? (
        <p className="muted">No hay reservas próximas.</p>
      ) : (
        <div className="table table-5">
          <div className="thead">
            <div>Fecha</div>
            <div>Hora</div>
            <div>Locker</div>
            <div>Usuario</div>
            <div>Estado</div>
          </div>

          {upcomingReservations.map((r) => (
            <div className="trow" key={r.id}>
              <div>{prettyDate(r.date)}</div>
              <div>{r.start} - {r.end}</div>
              <div>{lockerLabelById(r.lockerId)}</div>
              <div>{r.user}</div>
              <div>
                <span className={`pill ${r.status}`}>{r.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}