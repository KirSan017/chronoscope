"use client";

import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import type { HistoryEvent } from "@/types";
import { CATEGORY_COLORS, CATEGORY_LABELS } from "@/types";

interface EventCardProps {
  event: HistoryEvent;
  style: CSSProperties;
  onClick: () => void;
}

export function EventCard({ event, style, onClick }: EventCardProps) {
  const color = CATEGORY_COLORS[event.category];
  const year = event.dateStart.slice(0, 4).replace(/^-0*/, "");
  const displayYear = event.dateStart.startsWith("-") ? `${year} до н.э.` : year;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      style={{
        position: "absolute", width: 200,
        background: `${color}15`, border: `1px solid ${color}40`,
        borderRadius: 12, padding: 14, cursor: "pointer", ...style,
      }}
    >
      <div style={{ fontSize: 10, color, textTransform: "uppercase", letterSpacing: 1 }}>
        {CATEGORY_LABELS[event.category]}
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: "#e0e0f0", margin: "6px 0 4px" }}>
        {event.title}
      </div>
      <div style={{ fontSize: 12, color: "#808090" }}>{displayYear}</div>
      <a href={event.wikiUrl} target="_blank" rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        style={{ fontSize: 10, color: `${color}80`, marginTop: 8, display: "block", textDecoration: "none" }}>
        → Wikipedia
      </a>
    </motion.div>
  );
}
