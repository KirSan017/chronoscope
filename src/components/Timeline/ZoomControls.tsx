"use client";

import { EPOCHS } from "@/data/epochs";

interface ZoomControlsProps {
  yearsVisible: number;
  onZoom: (direction: "in" | "out") => void;
  onGoToEpoch: (startYear: number, endYear: number) => void;
}

export function ZoomControls({ yearsVisible, onZoom, onGoToEpoch }: ZoomControlsProps) {
  const displayScale = yearsVisible >= 1000
    ? `${Math.round(yearsVisible / 100)} вв.`
    : yearsVisible >= 10 ? `${Math.round(yearsVisible)} лет` : `${Math.round(yearsVisible * 12)} мес.`;

  return (
    <div style={{
      position: "absolute", bottom: 0, left: 0, right: 0, padding: "12px 20px",
      background: "rgba(255,255,255,0.03)", borderTop: "1px solid rgba(255,255,255,0.08)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <div style={{ display: "flex", gap: 8 }}>
        {EPOCHS.map((epoch) => (
          <button key={epoch.id} onClick={() => onGoToEpoch(epoch.startYear, epoch.endYear)}
            style={{ color: "#606080", padding: "3px 8px", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 4, fontSize: 11, background: "transparent", cursor: "pointer" }}>
            {epoch.label}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button onClick={() => onZoom("out")}
          style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 4, color: "#a0a0b0", padding: "2px 8px", cursor: "pointer", fontSize: 14 }}>−</button>
        <span style={{ fontSize: 11, color: "#606080", minWidth: 60, textAlign: "center" }}>{displayScale}</span>
        <button onClick={() => onZoom("in")}
          style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 4, color: "#a0a0b0", padding: "2px 8px", cursor: "pointer", fontSize: 14 }}>+</button>
      </div>
    </div>
  );
}
