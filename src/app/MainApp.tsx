"use client";

import { useCallback, useState } from "react";
import type { Category, HistoryEvent } from "@/types";
import { Header } from "@/components/Header/Header";
import { Timeline } from "@/components/Timeline/Timeline";

const ALL_CATEGORIES: Category[] = ["politics", "science", "culture", "religion", "technology", "person"];

interface MainAppProps { events: HistoryEvent[]; }

export function MainApp({ events }: MainAppProps) {
  const [activeCategories, setActiveCategories] = useState<Set<Category>>(new Set(ALL_CATEGORIES));

  const handleToggleCategory = useCallback((category: Category) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category); else next.add(category);
      return next;
    });
  }, []);

  const handleSearchSelect = useCallback((event: HistoryEvent) => {
    console.log("Navigate to:", event.title, event.dateStart);
  }, []);

  return (
    <main style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header events={events} activeCategories={activeCategories}
        onToggleCategory={handleToggleCategory} onSearchSelect={handleSearchSelect} />
      <Timeline events={events} activeCategories={activeCategories} />
    </main>
  );
}
