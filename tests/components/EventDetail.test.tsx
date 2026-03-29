import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EventDetail } from "@/components/EventDetail/EventDetail";
import type { HistoryEvent } from "@/types";

const event: HistoryEvent = {
  id: "Q362", title: "Отечественная война 1812 года",
  dateStart: "1812-06-24", dateEnd: "1812-12-14", category: "politics",
  wikiUrl: "https://ru.wikipedia.org/wiki/Отечественная_война_1812_года",
  description: "Военные действия в 1812 году...",
  imageUrl: "https://upload.wikimedia.org/test.jpg",
};

describe("EventDetail", () => {
  it("renders title and description", () => {
    render(<EventDetail event={event} onClose={() => {}} />);
    expect(screen.getByText("Отечественная война 1812 года")).toBeInTheDocument();
    expect(screen.getByText("Военные действия в 1812 году...")).toBeInTheDocument();
  });
  it("has Wikipedia link", () => {
    render(<EventDetail event={event} onClose={() => {}} />);
    expect(screen.getByText("Читать на Wikipedia")).toHaveAttribute("href", event.wikiUrl);
  });
  it("calls onClose", () => {
    const onClose = vi.fn();
    render(<EventDetail event={event} onClose={onClose} />);
    fireEvent.click(screen.getByText("✕"));
    expect(onClose).toHaveBeenCalled();
  });
});
