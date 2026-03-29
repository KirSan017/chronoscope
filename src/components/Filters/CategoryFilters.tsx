"use client";

import type { Category } from "@/types";
import { CATEGORY_COLORS, CATEGORY_LABELS } from "@/types";

const ALL_CATEGORIES: Category[] = ["politics", "science", "culture", "religion", "technology", "person"];

interface CategoryFiltersProps {
  active: Set<Category>;
  onToggle: (category: Category) => void;
}

export function CategoryFilters({ active, onToggle }: CategoryFiltersProps) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {ALL_CATEGORIES.map((cat) => {
        const color = CATEGORY_COLORS[cat];
        const isActive = active.has(cat);
        return (
          <button key={cat} onClick={() => onToggle(cat)}
            style={{
              background: isActive ? `${color}33` : "transparent",
              color: isActive ? color : "#606080",
              border: `1px solid ${isActive ? `${color}4D` : "rgba(255,255,255,0.1)"}`,
              padding: "4px 10px", borderRadius: 6, fontSize: 11, cursor: "pointer", transition: "all 0.2s",
            }}>
            {CATEGORY_LABELS[cat]}
          </button>
        );
      })}
    </div>
  );
}
