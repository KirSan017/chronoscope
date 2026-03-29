"use client";

import { motion } from "framer-motion";
import type { HistoryEvent, PersonSubcategory } from "@/types";
import { CATEGORY_COLORS, PERSON_SUBCATEGORY_COLORS } from "@/types";

interface LifespanBarProps {
  person: HistoryEvent;
  left: number;
  width: number;
  top: number;
  onClick: () => void;
}

export function LifespanBar({ person, left, width, top, onClick }: LifespanBarProps) {
  const color = person.subcategory
    ? PERSON_SUBCATEGORY_COLORS[person.subcategory as PersonSubcategory] || CATEGORY_COLORS.person
    : CATEGORY_COLORS.person;
  const startYear = person.dateStart.slice(0, 4).replace(/^-0*/, "");
  const endYear = person.dateEnd ? person.dateEnd.slice(0, 4).replace(/^-0*/, "") : "...";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: 1, scaleX: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      onClick={onClick}
      style={{
        position: "absolute", left, top, width, height: 28,
        background: `linear-gradient(90deg, ${color}4D, ${color}26)`,
        border: `1px solid ${color}66`, borderRadius: 14,
        display: "flex", alignItems: "center", padding: "0 12px",
        cursor: "pointer", transformOrigin: "left center",
        overflow: "hidden",
      }}
    >
      <span style={{ fontSize: 12, color, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", minWidth: 0 }}>{person.title}</span>
      <span style={{ fontSize: 10, color: `${color}80`, marginLeft: 8, whiteSpace: "nowrap", flexShrink: 0 }}>{startYear} — {endYear}</span>
    </motion.div>
  );
}
