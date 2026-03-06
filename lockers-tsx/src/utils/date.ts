export function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function isPastDate(dateISO: string): boolean {
  return dateISO < todayISO();
}

export function prettyDate(dateISO: string): string {
  const [y, m, d] = dateISO.split("-");
  return `${d}/${m}/${y}`;
}

export function uid(): string {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}
