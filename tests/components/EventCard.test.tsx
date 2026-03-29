import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EventCard } from "@/components/Timeline/EventCard";
import type { HistoryEvent } from "@/types";

const event: HistoryEvent = {
  id: "Q362",
  title: "Отечественная война 1812 года",
  dateStart: "1812-06-24",
  category: "politics",
  wikiUrl: "https://ru.wikipedia.org/wiki/Отечественная_война_1812_года",
};

describe("EventCard", () => {
  it("renders event title and date", () => {
    render(<EventCard event={event} style={{}} onClick={() => {}} />);
    expect(screen.getByText("Отечественная война 1812 года")).toBeInTheDocument();
    expect(screen.getAllByText(/1812/).length).toBeGreaterThan(0);
  });
  it("shows category label", () => {
    render(<EventCard event={event} style={{}} onClick={() => {}} />);
    expect(screen.getByText("Политика")).toBeInTheDocument();
  });
  it("has Wikipedia link", () => {
    render(<EventCard event={event} style={{}} onClick={() => {}} />);
    const link = screen.getByText("→ Wikipedia");
    expect(link).toHaveAttribute("href", event.wikiUrl);
  });
});
