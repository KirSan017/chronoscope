"use client";

import { useEffect, useRef } from "react";
import type { Viewport, HistoryEvent } from "@/types";
import { yearToPixel, getZoomLevel } from "@/lib/viewport-math";
import { CATEGORY_COLORS } from "@/types";

interface CanvasLayerProps {
  viewport: Viewport;
  events: HistoryEvent[];
  width: number;
  height: number;
}

function getTickYears(yearsVisible: number): number {
  const level = getZoomLevel(yearsVisible);
  switch (level) {
    case "millennia": return 1000;
    case "centuries": return 100;
    case "decades": return 10;
    case "years": return 1;
    case "months": return 1;
  }
}

export function CanvasLayer({ viewport, events, width, height }: CanvasLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
    ctx.clearRect(0, 0, width, height);

    const axisY = height * 0.45;

    // Axis line with gradient
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, "rgba(129, 140, 248, 0.1)");
    gradient.addColorStop(0.3, "rgba(129, 140, 248, 0.4)");
    gradient.addColorStop(0.7, "rgba(192, 132, 252, 0.4)");
    gradient.addColorStop(1, "rgba(192, 132, 252, 0.1)");
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, axisY);
    ctx.lineTo(width, axisY);
    ctx.stroke();

    // Year ticks
    const tickInterval = getTickYears(viewport.yearsVisible);
    const startYear = viewport.centerYear - viewport.yearsVisible / 2;
    const endYear = viewport.centerYear + viewport.yearsVisible / 2;
    const firstTick = Math.ceil(startYear / tickInterval) * tickInterval;

    ctx.fillStyle = "rgba(96, 96, 128, 0.8)";
    ctx.font = "11px system-ui";
    ctx.textAlign = "center";

    for (let year = firstTick; year <= endYear; year += tickInterval) {
      const x = yearToPixel(year, viewport, width);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, axisY - 6);
      ctx.lineTo(x, axisY + 6);
      ctx.stroke();
      const label = year < 0 ? `${Math.abs(year)} до н.э.` : String(year);
      ctx.fillText(label, x, axisY + 22);
    }

    // Event glow dots
    for (const event of events) {
      const eventYear = parseFloat(event.dateStart.slice(0, 4));
      const x = yearToPixel(eventYear, viewport, width);
      if (x < -20 || x > width + 20) continue;
      const color = CATEGORY_COLORS[event.category];
      ctx.shadowColor = color;
      ctx.shadowBlur = 12;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, axisY, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }, [viewport, events, width, height]);

  return <canvas ref={canvasRef} style={{ width, height, position: "absolute", top: 0, left: 0 }} />;
}
