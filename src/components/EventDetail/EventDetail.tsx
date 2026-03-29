"use client";

import { motion } from "framer-motion";
import type { HistoryEvent } from "@/types";
import { CATEGORY_COLORS, CATEGORY_LABELS } from "@/types";

interface EventDetailProps { event: HistoryEvent; onClose: () => void; }

export function EventDetail({ event, onClose }: EventDetailProps) {
  const color = CATEGORY_COLORS[event.category];
  const startYear = event.dateStart.slice(0, 4);
  const endYear = event.dateEnd?.slice(0, 4);
  const dateDisplay = endYear ? `${startYear} — ${endYear}` : startYear;

  return (
    <motion.div
      className="event-detail-panel"
      initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}
      style={{
        position: "fixed", top: 80, right: 20, width: 360, maxHeight: "calc(100vh - 100px)",
        overflowY: "auto", background: "#12122a", border: `1px solid ${color}40`,
        borderRadius: 16, padding: 24, zIndex: 200, boxShadow: `0 0 40px ${color}20`,
      }}>
      <button onClick={onClose} style={{
        position: "absolute", top: 12, right: 12, background: "transparent",
        border: "none", color: "#606080", fontSize: 18, cursor: "pointer" }}>✕</button>
      <div style={{ fontSize: 10, color, textTransform: "uppercase", letterSpacing: 1 }}>{CATEGORY_LABELS[event.category]}</div>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: "#e0e0f0", margin: "8px 0" }}>{event.title}</h2>
      <div style={{ fontSize: 14, color: "#808090", marginBottom: 16 }}>{dateDisplay}</div>
      {event.imageUrl && <img src={event.imageUrl} alt={event.title} style={{ width: "100%", borderRadius: 8, marginBottom: 16 }} />}
      {event.description && <p style={{ fontSize: 14, lineHeight: 1.6, color: "#c0c0d0", marginBottom: 16 }}>{event.description}</p>}
      <a href={event.wikiUrl} target="_blank" rel="noopener noreferrer"
        style={{ display: "inline-block", padding: "8px 16px", background: `${color}20`,
          border: `1px solid ${color}40`, borderRadius: 8, color, fontSize: 13, textDecoration: "none" }}>
        Читать на Wikipedia
      </a>
    </motion.div>
  );
}
