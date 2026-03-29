"use client";

import { AnimatePresence } from "framer-motion";
import type { Viewport, HistoryEvent, Category } from "@/types";
import { yearToPixel, getVisibleRange } from "@/lib/viewport-math";
import { LifespanBar } from "./LifespanBar";

interface LifespanListProps {
  events: HistoryEvent[];
  viewport: Viewport;
  containerWidth: number;
  activeCategories: Set<Category>;
  axisY: number;
  onSelectPerson: (person: HistoryEvent) => void;
}

function parseYear(dateStr: string): number {
  if (dateStr.startsWith("-")) return -parseInt(dateStr.slice(1, 5), 10);
  return parseInt(dateStr.slice(0, 4), 10);
}

export function LifespanList({ events, viewport, containerWidth, activeCategories, axisY, onSelectPerson }: LifespanListProps) {
  if (!activeCategories.has("person")) return null;

  const { startYear, endYear } = getVisibleRange(viewport);
  const buffer = viewport.yearsVisible * 0.2;

  const persons = events.filter((e) => {
    if (e.category !== "person") return false;
    const birthYear = parseYear(e.dateStart);
    const deathYear = e.dateEnd ? parseYear(e.dateEnd) : birthYear + 70;
    return deathYear >= startYear - buffer && birthYear <= endYear + buffer;
  }).slice(0, 20);

  return (
    <AnimatePresence>
      {persons.map((person, i) => {
        const birthYear = parseYear(person.dateStart);
        const deathYear = person.dateEnd ? parseYear(person.dateEnd) : birthYear + 70;
        const left = yearToPixel(birthYear, viewport, containerWidth);
        const right = yearToPixel(deathYear, viewport, containerWidth);
        const width = Math.max(right - left, 80);
        const top = axisY - 40 - i * 34;
        return <LifespanBar key={person.id} person={person} left={left} width={width} top={top} onClick={() => onSelectPerson(person)} />;
      })}
    </AnimatePresence>
  );
}
