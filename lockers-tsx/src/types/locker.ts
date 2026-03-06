export type SedeKey = "CENTRO" | "CAMPUS";

export type SedeConfig = {
  label: string;
  edificios: Record<string, number[]>;
};

export type Locker = {
  id: string;
  code: string;
  sede: SedeKey;
  edificio: string;
  piso: number;
  active: boolean;
};
