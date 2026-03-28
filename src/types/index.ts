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
