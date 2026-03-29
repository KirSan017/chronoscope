"use client";

import { AnimatePresence } from "framer-motion";
import type { Viewport, HistoryEvent, Category } from "@/types";
import { yearToPixel, getVisibleRange } from "@/lib/viewport-math";
import { EventCard } from "./EventCard";

interface EventListProps {
  events: HistoryEvent[];
  viewport: Viewport;
  containerWidth: number;
  activeCategories: Set<Category>;
  axisY: number;
  onSelectEvent: (event: HistoryEvent) => void;
}

function parseYear(dateStr: string): number {
  if (dateStr.startsWith("-")) return -parseInt(dateStr.slice(1, 5), 10);
  return parseInt(dateStr.slice(0, 4), 10);
}

const CARD_WIDTH = 180;
const CARD_HEIGHT = 100;
const CARD_GAP = 8;

export function EventList({ events, viewport, containerWidth, activeCategories, axisY, onSelectEvent }: EventListProps) {
  const { startYear, endYear } = getVisibleRange(viewport);
  const buffer = viewport.yearsVisible * 0.1;

  const visibleEvents = events
    .filter((e) => {
      if (!activeCategories.has(e.category)) return false;
      if (e.category === "person") return false;
      const year = parseYear(e.dateStart);
      return year >= startYear - buffer && year <= endYear + buffer;
    })
    .sort((a, b) => parseYear(a.dateStart) - parseYear(b.dateStart))
    .slice(0, 40);

  // Greedy row placement to avoid overlap
  const rows: { endX: number }[] = [];
  const positioned = visibleEvents.map((event) => {
    const x = yearToPixel(parseYear(event.dateStart), viewport, containerWidth) - CARD_WIDTH / 2;

    // Find first row where card fits (no X overlap)
    let rowIndex = 0;
    for (let r = 0; r < rows.length; r++) {
      if (x >= rows[r].endX + CARD_GAP) {
        rowIndex = r;
        break;
      }
      rowIndex = r + 1;
    }

    if (!rows[rowIndex]) rows[rowIndex] = { endX: 0 };
    rows[rowIndex].endX = x + CARD_WIDTH;

    const top = axisY + 40 + rowIndex * (CARD_HEIGHT + CARD_GAP);
    return { event, x, top };
  });

  return (
    <AnimatePresence>
      {positioned.map(({ event, x, top }) => (
        <EventCard key={event.id} event={event} style={{ left: x, top }} onClick={() => onSelectEvent(event)} />
      ))}
    </AnimatePresence>
  );
}
