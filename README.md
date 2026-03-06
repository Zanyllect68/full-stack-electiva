El README está perfecto tal como está. Solo copia esto y reemplaza tu `README.md`:

```markdown
# Sistema de Reserva de Lockers 🚀

**Actividad 5 — Electiva Full Stack**

SPA desarrollada con **Vite + React + TypeScript (TSX)** que implementa
un sistema de reserva de lockers con persistencia en `localStorage`.

## Integrantes
- Daniel Fernando Manrique Hernández
- Andres Felipe Galeano Tellez

## Tecnologías
- React 18 + TypeScript (TSX)
- Vite 7
- localStorage (sin backend)
- CSS personalizado

## Funcionalidades
- **Dashboard** — KPIs: lockers activos, reservas totales y de hoy
- **Reservar** — Formulario con filtro Sede → Edificio → Piso → Locker
- **Mis reservas** — Lista, búsqueda y cancelación de reservas
- **Lockers (CRUD)** — Crear, editar, activar/desactivar y eliminar lockers
- **Config** — Exportar/importar backup JSON y reset total

## Estructura del proyecto
```
src/
├── types/
│   ├── locker.ts         # Tipos: Locker, SedeKey, SedeConfig
│   └── reservation.ts    # Tipos: Reservation, Toast, ViewKey...
├── utils/
│   ├── date.ts           # todayISO, prettyDate, isPastDate, uid
│   └── storage.ts        # loadLS<T>, saveLS<T> (genéricos)
├── views/
│   ├── Dashboard.tsx
│   ├── LockersView.tsx   # CRUD completo + modal edición
│   ├── ReserveView.tsx
│   ├── MyReservationsView.tsx
│   └── ConfigView.tsx
├── App.tsx               # Componente raíz + lógica global
└── main.tsx
```

## Cómo correr el proyecto
```bash
npm install
npm run dev
```

## Contraste JSX vs TSX
Este proyecto implementa los conceptos del contraste JSX/TSX:
- Props tipadas con `type Props`
- Genéricos: `loadLS<T>()` y `saveLS<T>()`
- Unions: `SedeKey`, `ViewKey`, `ReservationStatus`
- Modelos de dominio: `type Locker`, `type Reservation`
```

Luego en la terminal:

```bash
git add README.md
git commit -m "docs: README completo con estructura y funcionalidades"
git push
```

¡Listo! ¿Ahora necesitas ayuda con el PDF del punto 1? [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/147725353/42806b10-d6ea-4ddd-9006-3d40e5dc8491/El-contraste-entre-JSX-y-TSX.pdf)