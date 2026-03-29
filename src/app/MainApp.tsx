"use client";

import { useCallback, useRef, useState } from "react";
import type { Category, HistoryEvent } from "@/types";
import { Header } from "@/components/Header/Header";
import { Timeline, type TimelineHandle } from "@/components/Timeline/Timeline";

const ALL_CATEGORIES: Category[] = ["politics", "science", "culture", "religion", "technology", "person"];

interface MainAppProps { events: HistoryEvent[]; }

export function MainApp({ events }: MainAppProps) {
  const [activeCategories, setActiveCategories] = useState<Set<Category>>(new Set(ALL_CATEGORIES));
  const timelineRef = useRef<TimelineHandle>(null);

  const handleToggleCategory = useCallback((category: Category) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category); else next.add(category);
      return next;
    });
  }, []);

  const handleSearchSelect = useCallback((event: HistoryEvent) => {
    const year = parseInt(event.dateStart.slice(0, 4), 10);
    const span = event.dateEnd
      ? Math.max(parseInt(event.dateEnd.slice(0, 4), 10) - year, 20) * 1.5
      : 50;
    timelineRef.current?.goToYear(year + span / 3, span);
  }, []);

  return (
    <main style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header events={events} activeCategories={activeCategories}
        onToggleCategory={handleToggleCategory} onSearchSelect={handleSearchSelect} />
      <Timeline ref={timelineRef} events={events} activeCategories={activeCategories} />
    </main>
  );
}
