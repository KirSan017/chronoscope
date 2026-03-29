"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import type { Category, HistoryEvent, PersonSubcategory } from "@/types";
import { useViewport } from "./useViewport";
import { CanvasLayer } from "./CanvasLayer";
import { EventList } from "./EventList";
import { LifespanList } from "./LifespanList";
import { ZoomControls } from "./ZoomControls";
import { EventDetail } from "@/components/EventDetail/EventDetail";
import { fetchExtract } from "@/lib/wikipedia";

interface TimelineProps {
  events: HistoryEvent[];
  activeCategories: Set<Category>;
  activePersonSubs: Set<PersonSubcategory>;
}

export interface TimelineHandle {
  goToYear: (year: number, span?: number) => void;
}

export const Timeline = forwardRef<TimelineHandle, TimelineProps>(function Timeline({ events, activeCategories, activePersonSubs }, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [selectedEvent, setSelectedEvent] = useState<HistoryEvent | null>(null);
  const { viewport, zoom, panStart, panMove, panEnd, goToEpoch, goToYear } = useViewport();

  useImperativeHandle(ref, () => ({ goToYear }));

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setSize({ width, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    zoom(e.deltaY > 0 ? "out" : "in", e.clientX - rect.left, size.width);
  }, [zoom, size.width]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    panStart(e.clientX);
  }, [panStart]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    panMove(e.clientX, size.width);
  }, [panMove, size.width]);

  // Touch handling
  const touchStartRef = useRef<{ x: number; y: number; dist?: number }>({ x: 0, y: 0 });

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      panStart(e.touches[0].clientX);
    } else if (e.touches.length === 2) {
      panEnd();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchStartRef.current = { x: (e.touches[0].clientX + e.touches[1].clientX) / 2, y: 0, dist: Math.sqrt(dx * dx + dy * dy) };
    }
  }, [panStart, panEnd]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      panMove(e.touches[0].clientX, size.width);
    } else if (e.touches.length === 2 && touchStartRef.current.dist) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const newDist = Math.sqrt(dx * dx + dy * dy);
      const ratio = newDist / touchStartRef.current.dist;
      if (ratio > 1.05) {
        zoom("in");
        touchStartRef.current.dist = newDist;
      } else if (ratio < 0.95) {
        zoom("out");
        touchStartRef.current.dist = newDist;
      }
    }
  }, [panMove, size.width, zoom]);

  const handleTouchEnd = useCallback(() => {
    panEnd();
  }, [panEnd]);

  async function handleSelectEvent(event: HistoryEvent) {
    setSelectedEvent(event);
    if (!event.description) {
      const { description, imageUrl } = await fetchExtract(event.wikiUrl);
      setSelectedEvent((prev) =>
        prev?.id === event.id ? { ...prev, description: description ?? undefined, imageUrl: imageUrl ?? undefined } : prev
      );
    }
  }

  const axisY = size.height * 0.45;

  return (
    <div ref={containerRef} onWheel={handleWheel} onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove} onMouseUp={panEnd} onMouseLeave={panEnd}
      onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}
      style={{ position: "relative", flex: 1, overflow: "hidden", cursor: "grab", userSelect: "none" }}>
      {size.width > 0 && (
        <>
          <CanvasLayer viewport={viewport} events={events.filter((e) => activeCategories.has(e.category))} width={size.width} height={size.height} />
          <LifespanList events={events} viewport={viewport} containerWidth={size.width} activeCategories={activeCategories} activePersonSubs={activePersonSubs} axisY={axisY} onSelectPerson={handleSelectEvent} />
          <EventList events={events} viewport={viewport} containerWidth={size.width} activeCategories={activeCategories} axisY={axisY} onSelectEvent={handleSelectEvent} />
        </>
      )}
      <ZoomControls yearsVisible={viewport.yearsVisible} onZoom={(dir) => zoom(dir)} onGoToEpoch={goToEpoch} />
      <AnimatePresence>
        {selectedEvent && <EventDetail event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
      </AnimatePresence>
    </div>
  );
});
