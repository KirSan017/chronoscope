import type { Epoch } from "@/types";

export const EPOCHS: Epoch[] = [
  { id: "ancient", label: "Древний мир", startYear: -5000, endYear: -800 },
  { id: "antiquity", label: "Античность", startYear: -800, endYear: 476 },
  { id: "medieval", label: "Средневековье", startYear: 476, endYear: 1453 },
  { id: "renaissance", label: "Возрождение", startYear: 1453, endYear: 1600 },
  { id: "modern", label: "Новое время", startYear: 1600, endYear: 1900 },
  { id: "xx", label: "XX век", startYear: 1900, endYear: 2000 },
  { id: "contemporary", label: "Современность", startYear: 2000, endYear: 2030 },
];

export const DEFAULT_VIEWPORT = { centerYear: 1800, yearsVisible: 200 };
export const MIN_YEARS_VISIBLE = 1;
export const MAX_YEARS_VISIBLE = 7000;
