export type ViewKey = "dashboard" | "reservar" | "mis-reservas" | "lockers" | "config";
export type ToastType = "success" | "error" | "info";
export type ReservationStatus = "CONFIRMADA" | "CANCELADA";

export type Reservation = {
  id: string;
  lockerId: string;
  date: string;
  start: string;
  end: string;
  user: string;
  reason: string;
  status: ReservationStatus;
  createdAt: string;
};

export type Toast = { type: ToastType; msg: string };
