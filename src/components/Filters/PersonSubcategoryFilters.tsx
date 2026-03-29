"use client";

import type { PersonSubcategory } from "@/types";
import { PERSON_SUBCATEGORY_LABELS, PERSON_SUBCATEGORY_COLORS } from "@/types";

const ALL_SUBCATEGORIES: PersonSubcategory[] = ["politics", "military", "literature", "science", "art", "music", "philosophy", "technology", "activism"];

interface PersonSubcategoryFiltersProps {
  active: Set<PersonSubcategory>;
  onToggle: (sub: PersonSubcategory) => void;
  visible: boolean;
}

export function PersonSubcategoryFilters({ active, onToggle, visible }: PersonSubcategoryFiltersProps) {
  if (!visible) return null;

  return (
    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
      {ALL_SUBCATEGORIES.map((sub) => {
        const color = PERSON_SUBCATEGORY_COLORS[sub];
        const isActive = active.has(sub);
        return (
          <button key={sub} onClick={() => onToggle(sub)}
            style={{
              background: isActive ? `${color}33` : "transparent",
              color: isActive ? color : "#606080",
              border: `1px solid ${isActive ? `${color}4D` : "rgba(255,255,255,0.1)"}`,
              padding: "3px 8px", borderRadius: 6, fontSize: 10, cursor: "pointer", transition: "all 0.2s",
            }}>
            {PERSON_SUBCATEGORY_LABELS[sub]}
          </button>
        );
      })}
    </div>
  );
}
