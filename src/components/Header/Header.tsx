"use client";

import type { Category, HistoryEvent, PersonSubcategory } from "@/types";
import { SearchBar } from "@/components/Search/SearchBar";
import { CategoryFilters } from "@/components/Filters/CategoryFilters";
import { PersonSubcategoryFilters } from "@/components/Filters/PersonSubcategoryFilters";

interface HeaderProps {
  events: HistoryEvent[];
  activeCategories: Set<Category>;
  onToggleCategory: (category: Category) => void;
  onSearchSelect: (event: HistoryEvent) => void;
  activePersonSubs: Set<PersonSubcategory>;
  onTogglePersonSub: (sub: PersonSubcategory) => void;
  showPersonSubs: boolean;
}

export function Header({ events, activeCategories, onToggleCategory, onSearchSelect, activePersonSubs, onTogglePersonSub, showPersonSubs }: HeaderProps) {
  return (
    <div className="header-container" style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "12px 20px", background: "rgba(255,255,255,0.05)",
      borderBottom: "1px solid rgba(255,255,255,0.1)", zIndex: 50, position: "relative",
    }}>
      <div className="header-logo" style={{ fontSize: 20, fontWeight: 700, letterSpacing: 1 }}>
        <span style={{ color: "#818cf8" }}>CHRONO</span>
        <span style={{ color: "#c084fc" }}>SCOPE</span>
      </div>
      <div className="header-right" style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <SearchBar events={events} onSelect={onSearchSelect} />
        <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
          <CategoryFilters active={activeCategories} onToggle={onToggleCategory} />
          <PersonSubcategoryFilters active={activePersonSubs} onToggle={onTogglePersonSub} visible={showPersonSubs} />
        </div>
      </div>
    </div>
  );
}
