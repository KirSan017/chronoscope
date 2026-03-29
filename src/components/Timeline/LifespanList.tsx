"use client";

import { AnimatePresence } from "framer-motion";
import type { Viewport, HistoryEvent, Category, PersonSubcategory } from "@/types";
import { yearToPixel, getVisibleRange } from "@/lib/viewport-math";
import { LifespanBar } from "./LifespanBar";

interface LifespanListProps {
  events: HistoryEvent[];
  viewport: Viewport;
  containerWidth: number;
  activeCategories: Set<Category>;
  activePersonSubs: Set<PersonSubcategory>;
  axisY: number;
  onSelectPerson: (person: HistoryEvent) => void;
}

function parseYear(dateStr: string): number {
  if (dateStr.startsWith("-")) return -parseInt(dateStr.slice(1, 5), 10);
  return parseInt(dateStr.slice(0, 4), 10);
}

const BAR_HEIGHT = 28;
const BAR_GAP = 6;

export function LifespanList({ events, viewport, containerWidth, activeCategories, activePersonSubs, axisY, onSelectPerson }: LifespanListProps) {
  if (!activeCategories.has("person")) return null;

  const { startYear, endYear } = getVisibleRange(viewport);
  const buffer = viewport.yearsVisible * 0.2;

  const persons = events
    .filter((e) => {
      if (e.category !== "person") return false;
      if (e.subcategory && !activePersonSubs.has(e.subcategory as PersonSubcategory)) return false;
      const birthYear = parseYear(e.dateStart);
      const deathYear = e.dateEnd ? parseYear(e.dateEnd) : birthYear + 70;
      return deathYear >= startYear - buffer && birthYear <= endYear + buffer;
    })
    .sort((a, b) => parseYear(a.dateStart) - parseYear(b.dateStart))
    .slice(0, 30);

  // Greedy row placement for bars too
  const rows: { endX: number }[] = [];
  const positioned = persons.map((person) => {
    const birthYear = parseYear(person.dateStart);
    const deathYear = person.dateEnd ? parseYear(person.dateEnd) : birthYear + 70;
    const left = yearToPixel(birthYear, viewport, containerWidth);
    const right = yearToPixel(deathYear, viewport, containerWidth);
    const width = Math.max(right - left, 80);

    let rowIndex = 0;
    for (let r = 0; r < rows.length; r++) {
      if (left >= rows[r].endX + BAR_GAP) {
        rowIndex = r;
        break;
      }
      rowIndex = r + 1;
    }
    if (!rows[rowIndex]) rows[rowIndex] = { endX: 0 };
    rows[rowIndex].endX = left + width;

    const top = axisY - 40 - rowIndex * (BAR_HEIGHT + BAR_GAP);
    return { person, left, width, top };
  });

  return (
    <AnimatePresence>
      {positioned.map(({ person, left, width, top }) => (
        <LifespanBar key={person.id} person={person} left={left} width={width} top={top} onClick={() => onSelectPerson(person)} />
      ))}
    </AnimatePresence>
  );
}
