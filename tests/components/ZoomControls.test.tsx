import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ZoomControls } from "@/components/Timeline/ZoomControls";
import { EPOCHS } from "@/data/epochs";

describe("ZoomControls", () => {
  it("renders epoch preset buttons", () => {
    render(<ZoomControls yearsVisible={200} onZoom={() => {}} onGoToEpoch={() => {}} />);
    expect(screen.getByText("Античность")).toBeInTheDocument();
    expect(screen.getByText("XX век")).toBeInTheDocument();
  });
  it("calls onGoToEpoch when clicked", () => {
    const onGoToEpoch = vi.fn();
    render(<ZoomControls yearsVisible={200} onZoom={() => {}} onGoToEpoch={onGoToEpoch} />);
    fireEvent.click(screen.getByText("Античность"));
    const epoch = EPOCHS.find((e) => e.label === "Античность")!;
    expect(onGoToEpoch).toHaveBeenCalledWith(epoch.startYear, epoch.endYear);
  });
  it("calls onZoom with 'in' when + clicked", () => {
    const onZoom = vi.fn();
    render(<ZoomControls yearsVisible={200} onZoom={onZoom} onGoToEpoch={() => {}} />);
    fireEvent.click(screen.getByText("+"));
    expect(onZoom).toHaveBeenCalledWith("in");
  });
});
