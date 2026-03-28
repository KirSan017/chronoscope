import { describe, it, expect } from "vitest";
import { yearToPixel, pixelToYear, getVisibleRange, clampViewport, getZoomLevel } from "@/lib/viewport-math";
import type { Viewport } from "@/types";

describe("yearToPixel", () => {
  it("maps center year to center pixel", () => {
    const viewport: Viewport = { centerYear: 1800, yearsVisible: 200 };
    expect(yearToPixel(1800, viewport, 1000)).toBe(500);
  });
  it("maps start of visible range to pixel 0", () => {
    const viewport: Viewport = { centerYear: 1800, yearsVisible: 200 };
    expect(yearToPixel(1700, viewport, 1000)).toBe(0);
  });
  it("maps end of visible range to container width", () => {
    const viewport: Viewport = { centerYear: 1800, yearsVisible: 200 };
    expect(yearToPixel(1900, viewport, 1000)).toBe(1000);
  });
  it("handles negative years (BCE)", () => {
    const viewport: Viewport = { centerYear: 0, yearsVisible: 2000 };
    expect(yearToPixel(-1000, viewport, 1000)).toBe(0);
  });
});

describe("pixelToYear", () => {
  it("is the inverse of yearToPixel", () => {
    const viewport: Viewport = { centerYear: 1800, yearsVisible: 200 };
    expect(pixelToYear(250, viewport, 1000)).toBe(1750);
  });
});

describe("getVisibleRange", () => {
  it("returns start and end year from viewport", () => {
    const viewport: Viewport = { centerYear: 1800, yearsVisible: 200 };
    expect(getVisibleRange(viewport)).toEqual({ startYear: 1700, endYear: 1900 });
  });
});

describe("clampViewport", () => {
  it("clamps yearsVisible to min", () => {
    expect(clampViewport({ centerYear: 1800, yearsVisible: 0.5 }).yearsVisible).toBe(1);
  });
  it("clamps yearsVisible to max", () => {
    expect(clampViewport({ centerYear: 1800, yearsVisible: 10000 }).yearsVisible).toBe(7000);
  });
});

describe("getZoomLevel", () => {
  it("returns 'millennia' for 7000 years", () => { expect(getZoomLevel(7000)).toBe("millennia"); });
  it("returns 'centuries' for 1000 years", () => { expect(getZoomLevel(1000)).toBe("centuries"); });
  it("returns 'decades' for 100 years", () => { expect(getZoomLevel(100)).toBe("decades"); });
  it("returns 'years' for 10 years", () => { expect(getZoomLevel(10)).toBe("years"); });
  it("returns 'months' for 1 year", () => { expect(getZoomLevel(1)).toBe("months"); });
});
