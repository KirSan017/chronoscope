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

export function EventList({ events, viewport, containerWidth, activeCategories, axisY, onSelectEvent }: EventListProps) {
  const { startYear, endYear } = getVisibleRange(viewport);
  const buffer = viewport.yearsVisible * 0.1;

  const visibleEvents = events.filter((e) => {
    if (!activeCategories.has(e.category)) return false;
    if (e.category === "person") return false;
    const year = parseYear(e.dateStart);
    return year >= startYear - buffer && year <= endYear + buffer;
  });

  const positioned = visibleEvents.slice(0, 50).map((event, i) => {
    const x = yearToPixel(parseYear(event.dateStart), viewport, containerWidth);
    const row = i % 3;
    const top = axisY + 40 + row * 100;
    return { event, x: x - 100, top };
  });

  return (
    <AnimatePresence>
      {positioned.map(({ event, x, top }) => (
        <EventCard key={event.id} event={event} style={{ left: x, top }} onClick={() => onSelectEvent(event)} />
      ))}
    </AnimatePresence>
  );
}
