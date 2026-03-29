"use client";

import type { Category, HistoryEvent } from "@/types";
import { SearchBar } from "@/components/Search/SearchBar";
import { CategoryFilters } from "@/components/Filters/CategoryFilters";

interface HeaderProps {
  events: HistoryEvent[];
  activeCategories: Set<Category>;
  onToggleCategory: (category: Category) => void;
  onSearchSelect: (event: HistoryEvent) => void;
}

export function Header({ events, activeCategories, onToggleCategory, onSearchSelect }: HeaderProps) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "12px 20px", background: "rgba(255,255,255,0.05)",
      borderBottom: "1px solid rgba(255,255,255,0.1)", zIndex: 50, position: "relative",
    }}>
      <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: 1 }}>
        <span style={{ color: "#818cf8" }}>CHRONO</span>
        <span style={{ color: "#c084fc" }}>SCOPE</span>
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <SearchBar events={events} onSelect={onSearchSelect} />
        <CategoryFilters active={activeCategories} onToggle={onToggleCategory} />
      </div>
    </div>
  );
}
