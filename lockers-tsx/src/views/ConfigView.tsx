type Props = {
  onReset: () => void;
  onExport: () => void;
  onImport: (file: File | undefined) => void;
};

export default function ConfigView({ onReset, onExport, onImport }: Props) {
  return (
    <section className="card">
      <h2>Configuración</h2>

      <div>
        <button onClick={onExport}>Exportar JSON</button>

        <input
          type="file"
          accept="application/json"
          onChange={(e) => onImport(e.target.files?.[0])}
        />

        <button onClick={onReset}>Reset total</button>
      </div>
    </section>
  );
}