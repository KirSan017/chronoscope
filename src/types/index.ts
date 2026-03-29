export type Category = "politics" | "science" | "culture" | "religion" | "technology" | "person";

export interface HistoryEvent {
  id: string;
  title: string;
  dateStart: string;
  dateEnd?: string;
  category: Category;
  subcategory?: string;
  geo?: [number, number];
  wikiUrl: string;
  description?: string;
  imageUrl?: string;
}

export interface Viewport {
  centerYear: number;
  yearsVisible: number;
}

export interface Epoch {
  id: string;
  label: string;
  startYear: number;
  endYear: number;
}

export const CATEGORY_COLORS: Record<Category, string> = {
  politics: "#818cf8",
  science: "#c084fc",
  culture: "#f87171",
  religion: "#fbbf24",
  technology: "#22d3ee",
  person: "#34d399",
};

export const CATEGORY_LABELS: Record<Category, string> = {
  politics: "Политика",
  science: "Наука",
  culture: "Культура",
  religion: "Религия",
  technology: "Технологии",
  person: "Люди",
};

export type PersonSubcategory = "politics" | "military" | "literature" | "science" | "art" | "music" | "philosophy" | "technology" | "activism";

export const PERSON_SUBCATEGORY_LABELS: Record<PersonSubcategory, string> = {
  politics: "Политики",
  military: "Военные",
  literature: "Литература",
  science: "Учёные",
  art: "Художники",
  music: "Музыканты",
  philosophy: "Мыслители",
  technology: "Инженеры",
  activism: "Активисты",
};

export const PERSON_SUBCATEGORY_COLORS: Record<PersonSubcategory, string> = {
  politics: "#ef4444",
  military: "#f97316",
  literature: "#a78bfa",
  science: "#3b82f6",
  art: "#ec4899",
  music: "#8b5cf6",
  philosophy: "#f59e0b",
  technology: "#06b6d4",
  activism: "#10b981",
};
