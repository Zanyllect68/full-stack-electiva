import { useMemo, useState } from "react";

type SedeKey = "CENTRO" | "CAMPUS";

type Locker = {
  id: string;
  code: string;
  sede: SedeKey;
  edificio: string;
  piso: number;
  active: boolean;
};

const SEDES: Record<SedeKey, { label: string; edificios: Record<string, number[]> }> = {
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

type Props = {
  lockers: Locker[];
  onAdd:    (data: { id: string; code: string; sede: SedeKey; edificio: string; piso: number }) => void;
  onUpdate: (updated: Locker) => void;   // ✅ agregado
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;        // ✅ agregado
};

export default function LockersView({ lockers, onAdd, onUpdate, onToggle, onDelete }: Props) {
  /* ── Formulario crear ── */
  const [id, setId]         = useState("");
  const [code, setCode]     = useState("01");
  const [sede, setSede]     = useState<SedeKey>("CAMPUS");
  const [edificio, setEdificio] = useState(Object.keys(SEDES.CAMPUS.edificios)[0]);
  const [piso, setPiso]     = useState(SEDES.CAMPUS.edificios[Object.keys(SEDES.CAMPUS.edificios)[0]][0]);

  /* ── Modal editar ── */
  const [editing, setEditing]     = useState<Locker | null>(null);
  const [eCode, setECode]         = useState("");
  const [eSede, setESede]         = useState<SedeKey>("CAMPUS");
  const [eEdificio, setEEdificio] = useState("");
  const [ePiso, setEPiso]         = useState(1);

  const edificiosDisponibles = useMemo(() => Object.keys(SEDES[sede].edificios), [sede]);
  const pisosDisponibles     = useMemo(() => SEDES[sede].edificios[edificio] ?? [], [sede, edificio]);
  const eEdificiosDisp       = useMemo(() => Object.keys(SEDES[eSede].edificios), [eSede]);
  const ePisosDisp           = useMemo(() => SEDES[eSede].edificios[eEdificio] ?? [], [eSede, eEdificio]);

  function handleSedeChange(value: SedeKey) {
    setSede(value);
    const ed0 = Object.keys(SEDES[value].edificios)[0];
    setEdificio(ed0);
    setPiso(SEDES[value].edificios[ed0][0]);
  }

  function handleEdificioChange(value: string) {
    setEdificio(value);
    setPiso(SEDES[sede].edificios[value][0]);
  }

  function openEdit(l: Locker) {
    setEditing(l);
    setECode(l.code);
    setESede(l.sede);
    setEEdificio(l.edificio);
    setEPiso(l.piso);
  }

  function saveEdit() {
    if (!editing) return;
    onUpdate({ ...editing, code: eCode, sede: eSede, edificio: eEdificio, piso: ePiso });
    setEditing(null);
  }

  function submitCreate(e: React.FormEvent) {
    e.preventDefault();
    onAdd({ id, code, sede, edificio, piso });
    setId(""); setCode("01");
  }

  return (
    <section className="card">
      <h2>Lockers</h2>
      <p className="muted">CRUD completo: crear, editar, activar/desactivar y eliminar.</p>

      {/* Formulario crear */}
      <form className="row4" onSubmit={submitCreate}>
        <input value={id}   onChange={(e) => setId(e.target.value)}   placeholder="ID (ej: LK-SD-2-05)" />
        <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Código (ej: 05)" />
        <select value={sede} onChange={(e) => handleSedeChange(e.target.value as SedeKey)}>
          {(Object.keys(SEDES) as SedeKey[]).map((k) => (
            <option key={k} value={k}>{SEDES[k].label}</option>
          ))}
        </select>
        <select value={edificio} onChange={(e) => handleEdificioChange(e.target.value)}>
          {edificiosDisponibles.map((ed) => <option key={ed} value={ed}>{ed}</option>)}
        </select>
        <select value={piso} onChange={(e) => setPiso(Number(e.target.value))}>
          {pisosDisponibles.map((p) => <option key={p} value={p}>Piso {p}</option>)}
        </select>
        <button type="submit">+ Crear locker</button>
      </form>

      {/* Tabla */}
      <div className="table table-7">
        <div className="thead">
          <div>ID</div><div>Código</div><div>Sede</div>
          <div>Edificio</div><div>Piso</div><div>Estado</div><div>Acciones</div>
        </div>
        {lockers.map((l) => (
          <div className="trow" key={l.id}>
            <div>{l.id}</div>
            <div>{l.code}</div>
            <div>{SEDES[l.sede]?.label ?? l.sede}</div>
            <div>{l.edificio}</div>
            <div>{l.piso}</div>
            <div>
              <span className={`pill ${l.active ? "CONFIRMADA" : "CANCELADA"}`}>
                {l.active ? "ACTIVO" : "INACTIVO"}
              </span>
            </div>
            <div style={{ display: "flex", gap: "6px" }}>
              <button onClick={() => openEdit(l)}>Editar</button>
              <button onClick={() => onToggle(l.id)}>{l.active ? "Desactivar" : "Activar"}</button>
              <button className="danger" onClick={() => onDelete(l.id)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal editar */}
      {editing && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
          <div className="card" style={{ width: "min(480px, 94%)", maxHeight: "90vh", overflowY: "auto" }}>
            <h3>Editar — {editing.id}</h3>
            <div className="stack">
              <label>Código
                <input value={eCode} onChange={(e) => setECode(e.target.value)} />
              </label>
              <label>Sede
                <select value={eSede} onChange={(e) => {
                  const s = e.target.value as SedeKey;
                  setESede(s);
                  const ed0 = Object.keys(SEDES[s].edificios)[0];
                  setEEdificio(ed0);
                  setEPiso(SEDES[s].edificios[ed0][0]);
                }}>
                  {(Object.keys(SEDES) as SedeKey[]).map((k) => (
                    <option key={k} value={k}>{SEDES[k].label}</option>
                  ))}
                </select>
              </label>
              <label>Edificio
                <select value={eEdificio} onChange={(e) => {
                  setEEdificio(e.target.value);
                  setEPiso(SEDES[eSede].edificios[e.target.value][0]);
                }}>
                  {eEdificiosDisp.map((ed) => <option key={ed} value={ed}>{ed}</option>)}
                </select>
              </label>
              <label>Piso
                <select value={ePiso} onChange={(e) => setEPiso(Number(e.target.value))}>
                  {ePisosDisp.map((p) => <option key={p} value={p}>Piso {p}</option>)}
                </select>
              </label>
            </div>
            <div className="row" style={{ marginTop: "14px" }}>
              <button onClick={saveEdit}>Guardar</button>
              <button onClick={() => setEditing(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
