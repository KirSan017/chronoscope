import type { Viewport } from "@/types";
import { MIN_YEARS_VISIBLE, MAX_YEARS_VISIBLE } from "@/data/epochs";

export type ZoomLevel = "millennia" | "centuries" | "decades" | "years" | "months";

export function yearToPixel(year: number, viewport: Viewport, containerWidth: number): number {
  const startYear = viewport.centerYear - viewport.yearsVisible / 2;
  const pixelsPerYear = containerWidth / viewport.yearsVisible;
  return (year - startYear) * pixelsPerYear;
}

export function pixelToYear(px: number, viewport: Viewport, containerWidth: number): number {
  const startYear = viewport.centerYear - viewport.yearsVisible / 2;
  const yearsPerPixel = viewport.yearsVisible / containerWidth;
  return startYear + px * yearsPerPixel;
}

export function getVisibleRange(viewport: Viewport): { startYear: number; endYear: number } {
  const half = viewport.yearsVisible / 2;
  return { startYear: viewport.centerYear - half, endYear: viewport.centerYear + half };
}

export function clampViewport(viewport: Viewport): Viewport {
  return {
    centerYear: viewport.centerYear,
    yearsVisible: Math.max(MIN_YEARS_VISIBLE, Math.min(MAX_YEARS_VISIBLE, viewport.yearsVisible)),
  };
}

export function getZoomLevel(yearsVisible: number): ZoomLevel {
  if (yearsVisible >= 3000) return "millennia";
  if (yearsVisible >= 500) return "centuries";
  if (yearsVisible >= 50) return "decades";
  if (yearsVisible >= 5) return "years";
  return "months";
}
