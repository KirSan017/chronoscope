"use client";

import { useCallback, useRef, useState } from "react";
import type { Viewport } from "@/types";
import { clampViewport } from "@/lib/viewport-math";
import { DEFAULT_VIEWPORT } from "@/data/epochs";

const ZOOM_FACTOR = 1.15;

export function useViewport() {
  const [viewport, setViewport] = useState<Viewport>(DEFAULT_VIEWPORT);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartCenter = useRef(0);

  const zoom = useCallback((direction: "in" | "out", pivotX?: number, containerWidth?: number) => {
    setViewport((prev) => {
      const factor = direction === "in" ? 1 / ZOOM_FACTOR : ZOOM_FACTOR;
      let newCenter = prev.centerYear;
      if (pivotX !== undefined && containerWidth) {
        const pivotRatio = pivotX / containerWidth - 0.5;
        const yearShift = prev.yearsVisible * pivotRatio * (1 - factor);
        newCenter = prev.centerYear + yearShift;
      }
      return clampViewport({ centerYear: newCenter, yearsVisible: prev.yearsVisible * factor });
    });
  }, []);

  const panStart = useCallback((clientX: number) => {
    isDragging.current = true;
    dragStartX.current = clientX;
    dragStartCenter.current = viewport.centerYear;
  }, [viewport.centerYear]);

  const panMove = useCallback((clientX: number, containerWidth: number) => {
    if (!isDragging.current) return;
    const dx = clientX - dragStartX.current;
    const yearsPerPixel = viewport.yearsVisible / containerWidth;
    setViewport((prev) => ({ ...prev, centerYear: dragStartCenter.current - dx * yearsPerPixel }));
  }, [viewport.yearsVisible]);

  const panEnd = useCallback(() => { isDragging.current = false; }, []);

  const goToEpoch = useCallback((startYear: number, endYear: number) => {
    const center = (startYear + endYear) / 2;
    setViewport(clampViewport({ centerYear: center, yearsVisible: (endYear - startYear) * 1.1 }));
  }, []);

  const goToYear = useCallback((year: number, span?: number) => {
    setViewport(clampViewport({ centerYear: year, yearsVisible: span ?? viewport.yearsVisible }));
  }, [viewport.yearsVisible]);

  return { viewport, zoom, panStart, panMove, panEnd, goToEpoch, goToYear };
}
